// =============================================================
// practice-test-gcc.js — FLAT mock-test engine for nursing GCC
// landing pages ONLY (dha/haad/kuwait/oman/qatar/saudi/sharjah
// nursing prometric/pearson-vue pages).
//
// Loaded as a second script AFTER practice-test.js on those 7
// pages only, so it overwrites window.PracticeTest with this
// flat "Test 1..Test 5" implementation before question-bank.js's
// loader calls window.PracticeTest.init(). Every other course
// landing page does not include this file and keeps using the
// Category > Topic > Section engine in practice-test.js unchanged.
//
// Hierarchy here: Test (5) -> Question — no category/topic
// nesting. Reads window.EXAM_QUESTION_BANK as an array of
// { name, icon, color, questions:[{q,opts,ans,exp}] } objects.
// =============================================================
(function () {
    function init() {
        const wrapper = document.getElementById('mts-wrapper');
        if (!wrapper) return;

        const TESTS = window.EXAM_QUESTION_BANK;
        if (!TESTS || !TESTS.length) {
            console.warn('[PracticeTestGCC] window.EXAM_QUESTION_BANK is empty or not set.');
            return;
        }

        function freshTestState() {
            return { question: 0, answers: null, result: null };
        }

        const testStates = TESTS.map(() => null);
        function stateFor(i) {
            if (!testStates[i]) {
                testStates[i] = freshTestState();
                testStates[i].answers = Array(TESTS[i].questions.length).fill(null);
            }
            return testStates[i];
        }

        let activeTest = 0;
        let state = stateFor(activeTest);
        let chartInstances = {};

        function switchToTest(i) {
            activeTest = i;
            state = stateFor(i);
        }

        function curTest() { return TESTS[activeTest]; }

        // ── DOM refs ───────────────────────────────────────────────
        const screenExam     = document.getElementById('mts-exam');
        const screenResults  = document.getElementById('mts-results');
        const tabsScroll     = document.getElementById('mts-tabs-scroll');
        const qCounter       = document.getElementById('mts-q-counter');
        const sectionBadge   = document.getElementById('mts-section-badge');
        const progressFill   = document.getElementById('mts-progress-fill');
        const qNum           = document.getElementById('mts-q-num');
        const qText          = document.getElementById('mts-q-text');
        const optionsWrap    = document.getElementById('mts-options');
        const submitBtn      = document.getElementById('mts-submit-btn');
        const feedbackCard   = document.getElementById('mts-feedback-card');
        const feedbackResult = document.getElementById('mts-feedback-result');
        const correctReveal  = document.getElementById('mts-correct-reveal');
        const explanationEl  = document.getElementById('mts-explanation');
        const navBar         = document.getElementById('mts-nav-bar');
        const prevBtn        = document.getElementById('mts-prev-btn');
        const nextBtn        = document.getElementById('mts-next-btn');
        const navCenter      = document.getElementById('mts-nav-center');
        const questionCard   = document.getElementById('mts-question-card');
        const doneScreen     = document.getElementById('mts-section-done');
        const doneTitle      = document.getElementById('mts-done-title');
        const doneStats      = document.getElementById('mts-done-stats');
        const doneNextBtn    = document.getElementById('mts-next-section-btn');
        const leftNav        = document.getElementById('mts-left-nav');
        const examBody       = document.querySelector('.mts-exam-body');

        // No category/topic panel here — Test 1..Test 5 lives in the top
        // tab row instead, so the left column is removed and the right
        // area (tabs + question panel) takes the full width.
        if (leftNav) leftNav.classList.add('mts-hidden');
        if (examBody) examBody.style.gridTemplateColumns = '1fr';

        // One-time static text patches
        const secScoresHeading = document.getElementById('mts-section-scores');
        if (secScoresHeading && secScoresHeading.previousElementSibling) {
            secScoresHeading.previousElementSibling.innerHTML = '<i class="fa-solid fa-chart-bar"></i> Test-wise Score';
        }
        const barChartCanvas = document.getElementById('mts-bar-chart');
        if (barChartCanvas) barChartCanvas.setAttribute('aria-label', 'Test-wise score bar chart');

        // ── Utility ────────────────────────────────────────────────
        function show(el)  { if (el) el.classList.remove('mts-hidden'); }
        function hide(el)  { if (el) el.classList.add('mts-hidden');    }
        function showScreen(name) {
            [screenExam, screenResults].forEach(s => { if (s) s.classList.add('mts-hidden'); });
            const target = { exam: screenExam, results: screenResults }[name];
            if (target) target.classList.remove('mts-hidden');
        }

        // ── Overall running score across every test attempted so far ──
        function overallAggregate() {
            let answered = 0, correct = 0, wrong = 0;
            testStates.forEach(st => {
                if (!st) return;
                st.answers.forEach(a => {
                    if (a === null) return;
                    answered++;
                    if (a.correct) correct++; else wrong++;
                });
            });
            return { answered, correct, wrong };
        }

        function updateOverallScoreRow() {
            const container = document.querySelector('.mts-q-progress-info');
            if (!container) return;
            let row = document.getElementById('mts-cat-topscore');
            if (!row) {
                row = document.createElement('div');
                row.id = 'mts-cat-topscore';
                row.className = 'mts-cat-topscore';
                if (sectionBadge) container.insertBefore(row, sectionBadge);
                else container.appendChild(row);
            }
            const agg = overallAggregate();
            row.innerHTML = `
                <span class="mts-cat-topscore-item mts-cat-topscore-answered"><span>Answered</span><strong>${agg.answered}</strong></span>
                <span class="mts-cat-topscore-item mts-cat-topscore-correct"><span>Correct</span><strong>${agg.correct}</strong></span>
                <span class="mts-cat-topscore-item mts-cat-topscore-wrong"><span>Wrong</span><strong>${agg.wrong}</strong></span>
            `;
        }

        // ── Top tab row: flat Test 1..Test 5 tabs (reuses the existing
        //    section-tabs styling from the original design). ─────────
        function buildTestTabs() {
            if (!tabsScroll) return;
            tabsScroll.innerHTML = TESTS.map((t, i) => {
                const st = testStates[i];
                const total = t.questions.length;
                const answered = st ? st.answers.filter(a => a !== null).length : 0;
                const allDone = total > 0 && answered === total;
                const isCurrent = i === activeTest;

                let cls = 'mts-tab';
                let icon = '';
                if (isCurrent)     { cls += ' mts-tab-active'; icon = '<i class="fa-solid fa-circle-dot"></i> '; }
                else if (allDone)  { cls += ' mts-tab-done';   icon = '<i class="fa-solid fa-check"></i> '; }

                const scoreEl = answered > 0
                    ? `<span class="mts-tab-score">${answered}/${total}</span>`
                    : '';
                return `<button class="${cls}" data-test-idx="${i}"><span>${icon}${t.name}</span>${scoreEl}</button>`;
            }).join('');

            tabsScroll.querySelectorAll('.mts-tab').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.testIdx);
                    if (idx !== activeTest) switchToTest(idx);
                    showScreen('exam');
                    renderQuestion();
                });
            });
        }

        // ── Render question ────────────────────────────────────────
        function renderQuestion() {
            const qi = state.question;
            const t  = curTest();
            const q  = t.questions[qi];
            const existing = state.answers[qi];
            const answered = existing !== null;

            show(questionCard);
            hide(doneScreen);
            hide(feedbackCard);
            hide(navBar);

            if (qNum)     qNum.textContent      = `Q${qi + 1}.`;
            if (qText)    qText.textContent     = q.q;
            if (qCounter) qCounter.textContent  = `Question ${qi + 1} of ${t.questions.length}`;
            if (sectionBadge) sectionBadge.textContent = t.name;
            if (progressFill) progressFill.style.width = ((qi + (answered ? 1 : 0)) / t.questions.length * 100) + '%';

            if (optionsWrap) {
                optionsWrap.innerHTML = q.opts.map((opt, idx) => {
                    let cls = 'mts-option';
                    if (answered) {
                        if (idx === q.ans)                  cls += ' mts-opt-correct';
                        else if (idx === existing.selected) cls += ' mts-opt-wrong';
                    }
                    const disabled = answered ? 'disabled' : '';
                    return `<button class="${cls}" data-idx="${idx}" ${disabled}>
                        <span class="mts-opt-key">${String.fromCharCode(65 + idx)}</span>${opt}
                    </button>`;
                }).join('');

                if (!answered) {
                    optionsWrap.querySelectorAll('.mts-option').forEach(btn => {
                        btn.addEventListener('click', () => {
                            optionsWrap.querySelectorAll('.mts-option').forEach(b => b.classList.remove('mts-opt-selected'));
                            btn.classList.add('mts-opt-selected');
                            if (submitBtn) submitBtn.disabled = false;
                        });
                    });
                }
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (answered) hide(submitBtn); else show(submitBtn);
            }

            if (answered) {
                showFeedback(qi, existing.selected);
                show(navBar);
                updateNavButtons(qi);
            }

            buildTestTabs();
            updateOverallScoreRow();
        }

        function showFeedback(qi, selected) {
            const q = curTest().questions[qi];
            const isCorrect = selected === q.ans;

            show(feedbackCard);
            if (feedbackResult) {
                feedbackResult.className = 'mts-feedback-result ' + (isCorrect ? 'mts-correct' : 'mts-wrong');
                feedbackResult.innerHTML = isCorrect
                    ? '<i class="fa-solid fa-circle-check"></i> Correct Answer! +1 Mark Awarded'
                    : '<i class="fa-solid fa-circle-xmark"></i> Incorrect Answer';
            }
            if (!isCorrect && correctReveal) {
                show(correctReveal);
                correctReveal.innerHTML = `<strong>Correct Answer:</strong> ${q.opts[q.ans]}`;
            } else if (correctReveal) {
                hide(correctReveal);
            }
            if (explanationEl) {
                explanationEl.innerHTML = `<strong>Explanation:</strong> ${q.exp}`;
            }
        }

        function updateNavButtons(qi) {
            if (prevBtn) prevBtn.style.visibility = qi > 0 ? 'visible' : 'hidden';
            const t = curTest();
            const isLastQuestion = qi >= t.questions.length - 1;
            const isLastTest = activeTest >= TESTS.length - 1;
            if (nextBtn) {
                nextBtn.innerHTML = isLastQuestion
                    ? ((isLastTest) ? 'View Results <i class="fa-solid fa-flag-checkered"></i>' : 'Finish Test <i class="fa-solid fa-check"></i>')
                    : 'Next <i class="fa-solid fa-chevron-right"></i>';
                nextBtn.className = 'mts-nav-btn mts-btn-cyan';
                nextBtn.disabled = false;
            }
            if (navCenter) {
                const answered = state.answers.filter(a => a !== null).length;
                navCenter.textContent = `${answered} / ${t.questions.length} answered`;
            }
        }

        function submitAnswer() {
            const selected = optionsWrap ? optionsWrap.querySelector('.mts-opt-selected') : null;
            if (!selected) return;
            const qi = state.question;
            const selectedIdx = parseInt(selected.dataset.idx);
            const isCorrect = selectedIdx === curTest().questions[qi].ans;

            state.answers[qi] = { selected: selectedIdx, correct: isCorrect };
            answeredCount++;
            hide(submitBtn);
            renderQuestion();
        }

        function completeTest(i) {
            const st = stateFor(i);
            const correct = st.answers.filter(a => a && a.correct).length;
            const wrong   = st.answers.filter(a => a && !a.correct).length;
            st.result = { correct, wrong };
        }

        function showTestDone(i) {
            hide(questionCard);
            hide(feedbackCard);
            hide(navBar);
            show(doneScreen);

            const st = stateFor(i);
            const r = st.result || { correct: 0, wrong: 0 };
            const total = TESTS[i].questions.length;
            const pct = total > 0 ? Math.round(r.correct / total * 100) : 0;

            if (doneTitle) doneTitle.textContent = `${TESTS[i].name} Completed!`;
            if (doneStats) {
                doneStats.innerHTML = `
                    <div class="mts-done-stat"><strong>${r.correct}</strong><span>Correct</span></div>
                    <div class="mts-done-stat"><strong>${r.wrong}</strong><span>Wrong</span></div>
                    <div class="mts-done-stat"><strong>${pct}%</strong><span>Accuracy</span></div>
                `;
            }
            if (doneNextBtn) {
                doneNextBtn.innerHTML = `Go to ${TESTS[i + 1].name} <i class="fa-solid fa-arrow-right"></i>`;
                doneNextBtn.onclick = () => {
                    switchToTest(i + 1);
                    renderQuestion();
                };
            }
        }

        // ── Results screen — aggregated across every attempted test ──
        function showResults() {
            showScreen('results');

            const attempted = TESTS.map((t, i) => {
                const st = testStates[i];
                if (!st) return null;
                const answered = st.answers.filter(a => a !== null).length;
                if (answered === 0) return null;
                const correct = st.answers.filter(a => a && a.correct).length;
                const wrong   = answered - correct;
                return { i, r: { correct, wrong } };
            }).filter(Boolean);
            const testTotal = i => TESTS[i].questions.length;

            const totalQs    = attempted.reduce((sum, { i }) => sum + testTotal(i), 0);
            const totCorrect = attempted.reduce((s, { r }) => s + r.correct, 0);
            const totWrong   = attempted.reduce((s, { r }) => s + r.wrong, 0);
            const pct        = totalQs > 0 ? Math.round(totCorrect / totalQs * 100) : 0;
            const passed     = pct >= 60;

            const subEl = document.getElementById('mts-results-sub');
            if (subEl) subEl.textContent = `Score: ${totCorrect}/${totalQs} · ${pct}% · ${passed ? '✅ PASS' : '❌ NEEDS IMPROVEMENT'}`;

            const secScoresEl = document.getElementById('mts-section-scores');
            if (secScoresEl) {
                secScoresEl.innerHTML = attempted.map(({ i, r }) => {
                    const total = testTotal(i);
                    const pctW = Math.round(r.correct / total * 100);
                    return `<div class="mts-sec-score-row">
                        <span class="mts-sec-score-label">${TESTS[i].name}</span>
                        <div class="mts-sec-score-bar-wrap"><div class="mts-sec-score-bar" style="width:0%" data-target="${pctW}"></div></div>
                        <span class="mts-sec-score-val">${r.correct}/${total}</span>
                    </div>`;
                }).join('');
                setTimeout(() => {
                    secScoresEl.querySelectorAll('.mts-sec-score-bar').forEach(b => {
                        b.style.width = b.dataset.target + '%';
                    });
                }, 100);
            }

            const totEl = document.getElementById('mts-total-score-row');
            if (totEl) {
                totEl.innerHTML = `<span class="mts-total-score-left">Total Score</span>
                    <span class="mts-total-score-right">${totCorrect} / ${totalQs} &nbsp;·&nbsp; ${pct}%</span>`;
            }

            const scores = attempted.map(({ i, r }) => ({ i, correct: r.correct }));
            const best   = scores.reduce((a, b) => b.correct > a.correct ? b : a, scores[0]);
            const worst  = scores.reduce((a, b) => b.correct < a.correct ? b : a, scores[0]);
            const anaEl  = document.getElementById('mts-analytics-grid');
            if (anaEl) {
                anaEl.innerHTML = [
                    ['Accuracy', pct + '%', passed ? 'Pass' : 'Below 60%'],
                    ['Total Correct', totCorrect, `of ${totalQs}`],
                    ['Total Wrong', totWrong, `of ${totalQs}`],
                    ...(scores.length > 1 ? [
                        ['Strongest', TESTS[best.i].name, `${best.correct}/${testTotal(best.i)}`],
                        ['Weakest',   TESTS[worst.i].name, `${worst.correct}/${testTotal(worst.i)}`]
                    ] : []),
                    ['Status', passed ? 'PASS' : 'FAIL', '']
                ].map(([lbl, val, sub]) =>
                    `<div class="mts-analytic-item">
                        <div class="mts-analytic-label">${lbl}</div>
                        <div class="mts-analytic-val">${val}</div>
                        ${sub ? `<div class="mts-analytic-sub">${sub}</div>` : ''}
                    </div>`
                ).join('');
            }

            buildCharts(totCorrect, totWrong, scores, totalQs, testTotal);

            buildReviewList('all');
            const filterBtns = document.querySelectorAll('.mts-filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('mts-filter-active'));
                    btn.classList.add('mts-filter-active');
                    buildReviewList(btn.dataset.filter);
                });
            });
        }

        function buildCharts(totCorrect, totWrong, scores, totalQs, testTotal) {
            if (typeof Chart === 'undefined') return;

            Object.values(chartInstances).forEach(c => { try { c.destroy(); } catch (e) {} });
            chartInstances = {};

            const donutCtx = document.getElementById('mts-donut-chart');
            if (donutCtx) {
                chartInstances.donut = new Chart(donutCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Correct', 'Wrong'],
                        datasets: [{ data: [totCorrect, totWrong], backgroundColor: ['#06b6d4', '#f43f5e'], borderWidth: 0, hoverOffset: 6 }]
                    },
                    options: {
                        cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } } },
                        animation: { animateRotate: true, duration: 1000 }
                    }
                });
            }
            const centerEl = document.getElementById('mts-donut-center');
            if (centerEl) {
                const pct = totalQs > 0 ? Math.round(totCorrect / totalQs * 100) : 0;
                centerEl.innerHTML = `<strong>${pct}%</strong><span>Accuracy</span>`;
            }
            const legendEl = document.getElementById('mts-donut-legend');
            if (legendEl) {
                legendEl.innerHTML = [['#06b6d4', 'Correct', totCorrect], ['#f43f5e', 'Wrong', totWrong]].map(([c, lbl, val]) =>
                    `<div class="mts-donut-legend-item"><div class="mts-legend-dot" style="background:${c}"></div>${lbl}: ${val}</div>`
                ).join('');
            }

            const barCtx = document.getElementById('mts-bar-chart');
            if (barCtx) {
                const maxQs = Math.max(...scores.map(s => testTotal(s.i)));
                chartInstances.bar = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: scores.map(s => TESTS[s.i].name),
                        datasets: [{
                            data: scores.map(s => s.correct),
                            backgroundColor: scores.map((s, i) => ['#06b6d4', '#3b82f6', '#7c3aed', '#14b8a6', '#f59e0b'][i]),
                            borderRadius: 8, borderSkipped: false
                        }]
                    },
                    options: {
                        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` Score: ${ctx.raw}/${testTotal(scores[ctx.dataIndex].i)}` } } },
                        scales: {
                            y: { min: 0, max: maxQs, ticks: { stepSize: Math.ceil(maxQs / 5), font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
                            x: { ticks: { font: { size: 11 } }, grid: { display: false } }
                        },
                        animation: { duration: 800 }
                    }
                });
            }
        }

        function buildReviewList(filter) {
            const listEl = document.getElementById('mts-review-list');
            if (!listEl) return;
            let items = [];
            TESTS.forEach((t, ti) => {
                const st = testStates[ti];
                if (!st) return;
                t.questions.forEach((q, qi) => {
                    const ans = st.answers[qi];
                    if (!ans) return;
                    const isCorrect = ans.correct;
                    if (filter === 'correct' && !isCorrect) return;
                    if (filter === 'wrong'   && isCorrect)  return;
                    items.push({ ti, qi, q, ans, isCorrect });
                });
            });
            listEl.innerHTML = items.map(({ ti, qi, q, ans, isCorrect }) => `
                <div class="mts-review-item ${isCorrect ? 'mts-rev-correct' : 'mts-rev-wrong'}">
                    <div class="mts-review-q">${TESTS[ti].name} Q${qi + 1}: ${q.q}</div>
                    <div class="mts-review-answers">
                        <div class="mts-review-row">
                            <span class="mts-review-row-label">Your Ans</span>
                            <span class="mts-review-row-val ${isCorrect ? 'mts-val-correct' : 'mts-val-wrong'}">${q.opts[ans.selected]}</span>
                        </div>
                        ${!isCorrect ? `<div class="mts-review-row"><span class="mts-review-row-label">Correct</span><span class="mts-review-row-val mts-val-correct">${q.opts[q.ans]}</span></div>` : ''}
                    </div>
                    <span class="mts-review-status ${isCorrect ? 'mts-status-correct' : 'mts-status-wrong'}">${isCorrect ? '✓ Correct' : '✗ Wrong'}</span>
                </div>`
            ).join('') || '<div style="padding:20px;text-align:center;color:#94a3b8;font-size:0.85rem;">No questions to show.</div>';
        }

        // ── Retest — resets ONLY the active test's progress ──────────
        function retest() {
            testStates[activeTest] = null;
            state = stateFor(activeTest);
            showScreen('exam');
            renderQuestion();
        }

        // ── Lead-capture gate — after the first LEAD_GATE_THRESHOLD
        //    questions answered in this session, block further progress
        //    until the popup form (reuses .glass-form/.lead-form and the
        //    shared popupLeadFormSubmitted flag also used by the
        //    syllabus-download and question-paper gates elsewhere on the
        //    site) is submitted. Once unlocked, it stays unlocked for the
        //    rest of the test — and for the other gated features too. ──
        const LEAD_GATE_THRESHOLD   = 10;
        const LEAD_GATE_STORAGE_KEY = 'popupLeadFormSubmitted';
        let answeredCount    = 0;
        let pendingAdvance   = null;
        let leadGateLastFocusedEl = null;

        // Read live (not cached) so a form submitted elsewhere on the same
        // page view — the syllabus or question-paper gate, or the plain
        // enquiry section form — is picked up immediately, without needing
        // a page reload.
        function isLeadGateUnlocked() {
            return localStorage.getItem(LEAD_GATE_STORAGE_KEY) === 'true';
        }

        if (!document.getElementById('mts-lead-modal-overlay')) {
            document.body.insertAdjacentHTML('beforeend',
                '<div class="qp-lead-modal-overlay" id="mts-lead-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="mts-lead-modal-title">' +
                    '<div class="qp-lead-modal-content">' +
                        '<button type="button" class="qp-lead-modal-close" id="mts-lead-modal-close" aria-label="Close form"><i class="fa-solid fa-xmark"></i></button>' +
                        '<div class="qp-lead-modal-header">' +
                            '<span class="qp-lead-modal-eyebrow"><i class="fa-solid fa-graduation-cap"></i> Keep Going</span>' +
                            '<h3 class="qp-lead-modal-title" id="mts-lead-modal-title">Share your details to continue</h3>' +
                            '<p class="qp-lead-modal-sub">You&rsquo;ve completed ' + LEAD_GATE_THRESHOLD + ' questions — tell us a bit about you to unlock the rest of this free practice test.</p>' +
                        '</div>' +
                        '<form class="glass-form lead-form" id="mts-lead-modal-form">' +
                            '<div class="form-row">' +
                                '<div class="input-group"><input type="text" name="name" required placeholder="Full Name"></div>' +
                                '<div class="input-group"><input type="tel" name="phone" required placeholder="Phone Number"></div>' +
                            '</div>' +
                            '<div class="form-row">' +
                                '<div class="input-group"><input type="email" name="email" placeholder="Email Address"></div>' +
                                '<div class="input-group"><input type="text" name="state" required placeholder="State"></div>' +
                            '</div>' +
                            '<div class="input-group select-wrapper">' +
                                '<select name="course" required>' +
                                    '<option value="" disabled selected>Select Course Category</option>' +
                                    '<option value="nursing">Nursing Coaching</option>' +
                                    '<option value="pharmacy">Pharmacist Exams</option>' +
                                    '<option value="mlt">Lab Technician Courses</option>' +
                                    '<option value="german">German Languages</option>' +
                                '</select>' +
                                '<i class="fa-solid fa-chevron-down select-icon"></i>' +
                            '</div>' +
                            '<div class="input-group"><textarea name="message" rows="3" placeholder="How can we help you?"></textarea></div>' +
                            '<input type="hidden" name="source" value="Free Practice Test">' +
                            '<button type="submit" class="btn-form-submit">Submit &amp; Continue Test <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i></button>' +
                        '</form>' +
                    '</div>' +
                '</div>');
        }
        const leadGateOverlay = document.getElementById('mts-lead-modal-overlay');
        const leadGateForm    = document.getElementById('mts-lead-modal-form');
        const leadGateClose   = document.getElementById('mts-lead-modal-close');

        function onLeadGateKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLeadGateModal();
                return;
            }
            if (e.key === 'Tab' && leadGateOverlay) {
                const content = leadGateOverlay.querySelector('.qp-lead-modal-content');
                const focusables = content ? content.querySelectorAll('input, select, textarea, button:not([disabled])') : [];
                if (!focusables.length) return;
                const first = focusables[0], last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        function openLeadGateModal() {
            if (!leadGateOverlay) return;
            leadGateLastFocusedEl = document.activeElement;
            leadGateOverlay.classList.add('qp-active');
            document.body.classList.add('qp-modal-open');
            document.addEventListener('keydown', onLeadGateKeydown);
            const firstField = leadGateOverlay.querySelector('input, select, textarea');
            if (firstField) firstField.focus();
        }

        function closeLeadGateModal() {
            if (!leadGateOverlay) return;
            leadGateOverlay.classList.remove('qp-active');
            document.body.classList.remove('qp-modal-open');
            document.removeEventListener('keydown', onLeadGateKeydown);
            if (leadGateLastFocusedEl && typeof leadGateLastFocusedEl.focus === 'function')
                leadGateLastFocusedEl.focus();
        }

        if (leadGateClose) leadGateClose.addEventListener('click', closeLeadGateModal);
        if (leadGateOverlay) {
            leadGateOverlay.addEventListener('click', (e) => {
                if (e.target === leadGateOverlay) closeLeadGateModal();
            });
        }
        if (leadGateForm) {
            leadGateForm.addEventListener('leadFormSuccess', () => {
                // forms.js already sets LEAD_GATE_STORAGE_KEY on every
                // successful .lead-form submission — nothing to write here.
                closeLeadGateModal();
                if (pendingAdvance) {
                    const fn = pendingAdvance;
                    pendingAdvance = null;
                    fn();
                }
            });
        }

        // ── Wire events ────────────────────────────────────────────
        if (submitBtn) submitBtn.addEventListener('click', submitAnswer);

        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (state.question > 0) {
                state.question--;
                renderQuestion();
            }
        });

        function proceedToNext() {
            const t = curTest();
            const isLastQuestion = state.question >= t.questions.length - 1;

            if (!isLastQuestion) {
                state.question++;
                renderQuestion();
                return;
            }

            completeTest(activeTest);
            const isLastTest = activeTest >= TESTS.length - 1;

            if (!isLastTest) {
                showTestDone(activeTest);
            } else {
                showResults();
            }
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            if (!isLeadGateUnlocked() && answeredCount >= LEAD_GATE_THRESHOLD) {
                pendingAdvance = proceedToNext;
                openLeadGateModal();
                return;
            }
            proceedToNext();
        });

        const retestBtn = document.getElementById('mts-retest-btn');
        if (retestBtn) retestBtn.addEventListener('click', retest);

        if (submitBtn) submitBtn.disabled = true;

        // ── Boot straight into Test 1, Question 1 ─────────────────
        showScreen('exam');
        renderQuestion();
    }

    window.PracticeTest = { init };
})();
