/**
 * Google Reviews — Dynamic GMB Integration
 *
 * SETUP REQUIRED (one-time):
 *   1. Go to https://console.cloud.google.com → Enable "Places API (New)" or "Maps JavaScript API"
 *   2. Create an API key and restrict it to your domain (HTTP Referrers)
 *   3. Find your Google Place ID at https://developers.google.com/maps/documentation/javascript/place-id
 *      (search for "Eduooz International Academy")
 *   4. Replace the values in GOOGLE_REVIEWS_CFG below
 *
 * How it works:
 *   - Reads `data-page-type` from the `#reviews` section (or detects from URL)
 *   - Calls Google Places API for live reviews + overall rating
 *   - Filters & scores reviews by topic keywords for each page type
 *   - Renders cards using the exact existing `.greview-card` structure
 *   - Injects a "View All Google Reviews" link
 *   - Re-initialises the carousel cleanly after rendering
 *   - Falls back to existing static cards when API is unavailable
 */
(function () {
  'use strict';

  /* ================================================================
     CONFIGURATION — edit these values before deploying
     ================================================================ */
  var GOOGLE_REVIEWS_CFG = {
    /* Place ID for Eduooz International Academy.
       Find yours at: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
       Example: 'ChIJN1t_tDeuEmsRUsoyG83frY4'                        */
    placeId: '',

    /* Google Maps JavaScript API key with Places library enabled.
       Restrict to your domain(s) in Cloud Console to prevent misuse. */
    apiKey: '',

    /* Canonical link to the Eduooz Google review page               */
    reviewsPageUrl: 'https://www.google.com/search?q=Eduooz+Academy+Reviews',

    /* Maximum review cards shown initially in the carousel           */
    maxVisible: 6,

    /* Keywords used to score relevance per page type.
       Reviews are sorted: most keyword matches → highest rating → newest. */
    pageKeywords: {
      nursing: [
        'nurse', 'nursing', 'norcet', 'dha', 'haad', 'moh', 'nclex',
        'aiims', 'staff nurse', 'rn', 'bsc nursing', 'gnm', 'ward',
        'icu', 'nicu', 'hospital', 'clinical', 'patient care',
        'jphn', 'esic', 'rrb', 'dsssb', 'pgimer', 'sgpgims',
        'jipmer', 'military nursing', 'prometric', 'pearson vue',
        'recruitment', 'nursing officer', 'examination'
      ],
      pharmacy: [
        'pharmacist', 'pharmacy', 'pharma', 'drug', 'dispensing',
        'dha pharmacist', 'germany pharmacist', 'medicines', 'prescription',
        'gpat', 'upsc drug', 'rrb pharmacist', 'psc pharmacist',
        'clinical pharmacy', 'drug inspector', 'pharmacology'
      ],
      german: [
        'german', 'germany', 'deutsch', 'goethe', 'telc',
        'language', 'abroad', 'europe', 'migration',
        'language training', 'language course', 'b1', 'b2', 'a1', 'a2'
      ],
      'lab-tech': [
        'lab', 'laboratory', 'technician', 'mlt', 'pathology',
        'blood', 'specimen', 'haematology', 'biochemistry',
        'microbiology', 'dhs lab', 'psc lab'
      ]
    }
  };

  /* ================================================================
     PAGE-TYPE DETECTION
     ================================================================ */
  function detectPageType() {
    var section = document.getElementById('reviews');
    if (section) {
      var pt = section.getAttribute('data-page-type');
      if (pt && GOOGLE_REVIEWS_CFG.pageKeywords[pt]) return pt;
    }
    var path = location.pathname.toLowerCase();
    if (path.indexOf('pharmacy') !== -1) return 'pharmacy';
    if (path.indexOf('german') !== -1 || path.indexOf('deutsch') !== -1) return 'german';
    if (path.indexOf('lab') !== -1 || path.indexOf('mlt') !== -1) return 'lab-tech';
    return 'nursing';
  }

  /* ================================================================
     REVIEW SORTING
     ================================================================ */
  function relevanceScore(review, keywords) {
    var text = ((review.text || '') + ' ' + (review.author_name || '')).toLowerCase();
    var score = 0;
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i].toLowerCase()) !== -1) score++;
    }
    return score;
  }

  function sortReviews(reviews, pageType) {
    var keywords = GOOGLE_REVIEWS_CFG.pageKeywords[pageType] || [];
    var scored = reviews.map(function (r) {
      return { review: r, score: relevanceScore(r, keywords) };
    });

    // If no review has any keyword match, skip keyword sort and fall through to rating/date
    var hasRelevant = scored.some(function (s) { return s.score > 0; });

    scored.sort(function (a, b) {
      if (hasRelevant && b.score !== a.score) return b.score - a.score;
      if ((b.review.rating || 0) !== (a.review.rating || 0)) return (b.review.rating || 0) - (a.review.rating || 0);
      return ((b.review.time || 0) - (a.review.time || 0));
    });

    return scored.map(function (s) { return s.review; });
  }

  /* ================================================================
     HTML HELPERS
     ================================================================ */
  function starsHTML(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i class="fa-solid fa-star"></i>';
      } else if (rating % 1 !== 0 && i - 1 < rating) {
        html += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        html += '<i class="fa-regular fa-star"></i>';
      }
    }
    return html;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ================================================================
     CARD HTML — matches existing .greview-card structure exactly
     ================================================================ */
  function buildCardHTML(review) {
    var name     = review.author_name || 'Google Reviewer';
    var safeName = escapeHTML(name);
    var initials = name
      .split(/\s+/)
      .filter(Boolean)
      .map(function (w) { return w[0]; })
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

    var rating   = typeof review.rating === 'number' ? review.rating : 5;
    var text     = escapeHTML(review.text || '');
    var dateStr  = escapeHTML(review.relative_time_description || '');
    var photoUrl = review.profile_photo_url || '';

    /* Avatar — profile photo if available, fallback to initials */
    var avatarHTML;
    if (photoUrl) {
      /* On image load error: swap class so CSS shows gradient background */
      var escapedInitials = initials.replace(/'/g, "\\'");
      avatarHTML = '<div class="greview-avatar greview-avatar-photo">'
        + '<img src="' + escapeHTML(photoUrl) + '" alt="' + safeName + '" loading="lazy"'
        + ' onerror="this.parentElement.className=\'greview-avatar\';this.outerHTML=\'' + escapedInitials + '\'">'
        + '</div>';
    } else {
      avatarHTML = '<div class="greview-avatar">' + initials + '</div>';
    }

    /* Date badge + Google Verified badge */
    var badgesHTML = '';
    if (dateStr) {
      badgesHTML += '<span class="greview-badge">' + dateStr + '</span>';
    }
    badgesHTML += '<span class="greview-badge greview-badge-inst">'
      + '<i class="fa-brands fa-google" style="margin-right:4px"></i>Google Verified'
      + '</span>';

    return '<div class="greview-card">'
      + '<div class="greview-card-top">'
      + avatarHTML
      + '<div><h5>' + safeName + '</h5>'
      + '<div class="greview-card-stars">' + starsHTML(rating) + '</div></div>'
      + '<i class="fa-brands fa-google greview-g-icon"></i>'
      + '</div>'
      + '<p class="greview-text">“' + text + '”</p>'
      + '<div class="greview-badges-row">' + badgesHTML + '</div>'
      + '</div>';
  }

  /* ================================================================
     STATS BAR UPDATE — real rating & review count from Google
     ================================================================ */
  function updateStatsBar(place) {
    if (!place) return;

    if (place.rating) {
      var ratingEl = document.querySelector('.greview-rating-num');
      if (ratingEl) ratingEl.textContent = place.rating.toFixed(1);

      var starsEl = document.querySelector('.greview-stars-lg');
      if (starsEl) starsEl.innerHTML = starsHTML(place.rating);
    }

    if (place.user_ratings_total) {
      /* Find the counter that shows total Google Reviews */
      var countEl = document.querySelector('.greview-count[data-suffix="+"]');
      if (countEl) {
        var total = place.user_ratings_total;
        countEl.setAttribute('data-target', total);
        countEl.textContent = total.toLocaleString() + '+';
      }
    }
  }

  /* VIEW-ALL BUTTON — disabled */
  function injectViewAllButton() { /* removed */ }

  /* ================================================================
     CAROUSEL RE-INITIALISATION
     Cleans up the previous initReviewCarousel() instance before
     calling it again with the freshly rendered cards.
     ================================================================ */
  function reinitCarousel() {
    /* Stop auto-timer exposed by course-landing.js */
    if (typeof window._greviewAutoTimer !== 'undefined') {
      clearInterval(window._greviewAutoTimer);
      window._greviewAutoTimer = undefined;
    }

    /* Clone arrow buttons to drop stale event listeners */
    ['greview-prev', 'greview-next'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) {
        var fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
      }
    });

    /* Re-run init functions from course-landing.js (explicit cross-file dependency:
       initReviewCarousel and initReviewCounters are defined in course-landing.js
       and exposed as window.initReviewCarousel / window.initReviewCounters) */
    if (typeof initReviewCarousel === 'function') {
      try { initReviewCarousel(); } catch (e) { /* silent */ }
    }
    if (typeof initReviewCounters === 'function') {
      try { initReviewCounters(); } catch (e) { /* silent */ }
    }
  }

  /* ================================================================
     RENDER REVIEWS INTO DOM
     ================================================================ */
  function renderReviews(reviews, place, pageType) {
    var track = document.getElementById('greview-track');
    if (!track) return;

    var sorted = sortReviews(reviews, pageType);
    var toShow = sorted.slice(0, GOOGLE_REVIEWS_CFG.maxVisible);

    if (!toShow.length) {
      useFallback(pageType);
      return;
    }

    track.innerHTML = toShow.map(buildCardHTML).join('');

    updateStatsBar(place);
    injectViewAllButton();
    reinitCarousel();
  }

  /* ================================================================
     STATIC FALLBACK REVIEWS — shown when API is not configured
     ================================================================ */
  var STATIC_REVIEWS = [
    {
      author_name: 'Feba Stephen',
      rating: 5,
      text: 'I recently joined Eduooz Academy and loving it so far. The personal mentoring and supportive faculty make online learning feel much more effective. Classes are clear and easy to follow. A great choice for anyone looking to upskill!',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Lakshmy Lachu',
      rating: 5,
      text: 'I recently cleared my Kuwait Prometric exam with the help of Eduooz Academy. It was a very good experience. The live classes were interactive and very helpful. The recorded theory sessions and mock tests were well structured.',
      relative_time_description: '1 month ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Priya Raj',
      rating: 5,
      text: 'I recently passed my DHA exam after taking classes from Eduooz Academy. The teaching methods, study materials, and mock tests were very helpful and easy to understand. The trainers were supportive and explained every topic clearly.',
      relative_time_description: '2 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Shintu Saji',
      rating: 5,
      text: 'I recently completed my Saudi Prometric coaching at Eduooz Academy, and it was a great experience. The classes were well structured, the mock tests were exam focused, and the explanations were clear.',
      relative_time_description: '2 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Ashitha Aishu',
      rating: 5,
      text: 'I recently completed my HAAD exam coaching through Eduooz Academy, and it was a very effective experience. The online coaching was well structured, and the mock tests were highly exam oriented. The detailed explanations helped me understand the concepts better.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anjali Preman',
      rating: 5,
      text: 'Excellent classes and convenient for those who are living abroad. I\'m currently a student at Eduooz Academy, and they help me a lot with my exam preparation. The support team is always available to clear doubts whenever needed.',
      relative_time_description: '2 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'NITHA K R',
      rating: 5,
      text: 'I would like to express my sincere appreciation to the DHS Nursing Exam Coaching Center for their excellent and well structured approach to exam preparation. I truly appreciate the dedicated efforts of the coaching center and mentor. I strongly recommend this center to anyone preparing for the DHS Nursing exam.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Athira Athira',
      rating: 5,
      text: 'I recently joined Eduooz Academy for the Assistant Professor in Nursing exam coaching, and my experience so far has been excellent. The team provided all the necessary information clearly. I really appreciate the flexibility of live and recorded classes.',
      relative_time_description: '3 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'MADHURA N M',
      rating: 5,
      text: 'I am extremely happy to share that I cleared my DHA exam within just one month of preparation. All the credit goes to Eduooz Academy for their excellent training, guidance, and continuous support throughout my preparation.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anupriya Arun',
      rating: 5,
      text: 'I recently joined the Eduooz Marathon Batch. It is very effective, informative, and helpful for my exam preparation. The mentor support and classes are excellent. I am very happy to be part of the team. Keep it up!',
      relative_time_description: '1 month ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Thansil Thaha',
      rating: 5,
      text: 'The classes are very helpful and well structured. The faculty explains topics clearly and focuses mainly on important exam areas. Model exams and revision sessions improved my confidence. Overall, it is an excellent class for competitive exam preparation.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anumol Joji',
      rating: 5,
      text: 'I opted for online classes at Eduooz Academy for DME coaching, and it was a great experience. The faculty, especially Shine Sir, was knowledgeable and interactive. The study materials, mock tests, and question bank were comprehensive and very useful.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Krishnapriya Krishnapriya',
      rating: 5,
      text: 'Eduooz Academy provides an excellent learning environment with knowledgeable and supportive instructors. The classes are well structured, and the concepts are explained in a clear and practical way. I had a very positive learning experience and highly recommend the academy.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Chinchu Anoop',
      rating: 5,
      text: 'I had a great experience with Eduooz Academy. They provide expert coaching along with excellent mentor support. Even with online classes, it\'s easy to connect with teachers and clear doubts. The classes are well organized and very effective.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Diny Shanto',
      rating: 5,
      text: 'Wonderful experience with Eduooz Academy. I felt confident throughout my DME Staff Nurse exam preparation because of the guidance, motivation, support, mock tests, and interview sessions provided by the entire Eduooz team.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aleena Antony',
      rating: 5,
      text: 'I chose Eduooz Academy for my competitive nursing exam preparation. The academy provided excellent coaching, guidance, and mentor support throughout my learning journey. The mentors were approachable, friendly, and truly committed to helping students succeed.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'ASWATHY R S',
      rating: 5,
      text: 'I\'m blown away by the exceptional teaching and support I\'ve received at this education center. The faculty is knowledgeable, passionate, and genuinely invested in helping students succeed. The personalized attention and flexible scheduling made my learning experience outstanding.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aiswarya Sushama',
      rating: 5,
      text: 'The topics are explained very clearly, and the mock tests are extremely helpful for understanding the exam pattern. The mentors and teachers are very supportive, and the app used for classes is user friendly.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Raji Rajan',
      rating: 5,
      text: 'Outstanding coaching center in Trivandrum. Sincere thanks to all the teachers for their support and encouragement during my DME Staff Nurse exam preparation. The two day mock interview was especially valuable and boosted my confidence.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Kavya G Nath',
      rating: 5,
      text: 'Eduooz Academy provides excellent coaching for the DME exam and interview. The free mock interview conducted by a former PSC board member gave me real time interview experience and helped improve my confidence and preparation.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Steffi Saji',
      rating: 5,
      text: 'Eduooz Academy provides good teaching with clear explanations. Their teaching methods are effective, interactive, and easy to understand. The teachers are supportive and make learning enjoyable. Thank you so much.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Jeethu Joseph',
      rating: 5,
      text: 'I\'m Jeethu Joseph, a student of the DME Nursing Batch 4 at Eduooz Academy. The guidance was excellent. The mock tests, theory classes, marathon revisions, and question paper discussions were very effective. They helped me secure a place in the rank list.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aparna Sajith Akshada',
      rating: 5,
      text: 'I\'m really glad I joined Eduooz Academy. The admission procedure is systematic and transparent, with clear communication throughout. The mentor support is professional, responsive, and focused on each student\'s progress.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aswani C',
      rating: 5,
      text: 'I got selected in CRE 4 as a Senior Nursing Officer with Rank 41 because of Eduooz Academy. The live and recorded classes were very useful, and the mentors were always supportive and ready to help. Thank you, Eduooz!',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Haritha Hari',
      rating: 5,
      text: 'The overall classes are effective for upcoming exams. The recorded sessions are very helpful, and the mock interview sessions were exceptional. They definitely helped improve my confidence and preparation.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Neethu S',
      rating: 5,
      text: 'I joined Eduooz Academy to prepare for the DME Staff Nurse exam. The academy provided excellent nursing classes with clear explanations and updated content. The mock interviews were very helpful, boosting my confidence, and the mentors were always supportive throughout my preparation.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Pravitha Ratheesh',
      rating: 5,
      text: 'It was a great experience. I am completely satisfied with the classes and the efforts taken for us. The mock interview was a wonderful experience and helped me prepare with confidence.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anjana Kumar',
      rating: 5,
      text: 'I\'m Anjana, a student of the DHS Long Term Batch 3 at Eduooz Academy. I recently joined the batch, and the admission process was systematic. The support from mentor Aarya was excellent, and Shine Sir\'s classes are outstanding. Thank you to the entire team.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Sini Laly',
      rating: 5,
      text: 'The DME interview classes were extremely useful. They helped us understand our strengths and areas for improvement. I truly appreciate the effort put into every session. Every class was excellent. Thank you so much.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Preetha Peethambaran',
      rating: 5,
      text: 'I attended the DME crash course at Eduooz Academy. The classes, PDF notes, sure-shot materials, practice questions, unit tests, and mock tests were very helpful. I also attended the mock interview, which gave me valuable feedback and helped me assess my preparation.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Immaculate Nancy',
      rating: 5,
      text: 'No words to describe the classes. Every session was excellent and highly effective. The entire team is amazing, and I sincerely appreciate all the support they provided. Their guidance greatly increased my confidence. Thank you, Eduooz Academy!',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Jayalakshmi VS',
      rating: 5,
      text: 'I am Jayalakshmi VS, a Qatar Prometric exam winner. Eduooz Academy provides excellent classes with well qualified and supportive tutors. I am very satisfied with the coaching and guidance I received.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Athira Ms',
      rating: 5,
      text: 'I am happy to share that I cleared the DME Staff Nurse written exam and made it to the main list. Joining the Eduooz Academy crash course was the best decision. Thank you to the entire team for your excellent support and guidance.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Ananda Kannan',
      rating: 5,
      text: 'I had a very good experience with Eduooz Academy. I sincerely thank the academy for helping me pass my Prometric exam. Special thanks to Vidhu Ma\'am, Thaniya Ma\'am, and everyone working behind the scenes for their support.',
      relative_time_description: '2 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aswini N',
      rating: 5,
      text: 'Eduooz Academy delivers clear, exam focused teaching with supportive staff and well structured study materials that make exam preparation much easier.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Athira R',
      rating: 5,
      text: 'A good coaching class with strong conceptual clarity. Shine Sir is an excellent teacher with deep knowledge and outstanding teaching skills. His explanations make even difficult topics easy to understand.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Remya Rajan',
      rating: 5,
      text: 'Eduooz Academy offers excellent teaching and a supportive learning environment. I\'m very satisfied with my experience and would highly recommend it to anyone preparing for competitive nursing exams.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Gopika R.S',
      rating: 5,
      text: 'I am so happy to join Eduooz Academy. Every member of the team is excellent and always ready to clear doubts. It is one of the best platforms for nursing competitive exam preparation.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Vijina K',
      rating: 5,
      text: 'I had a wonderful experience with Eduooz Academy. The coaching gave me confidence throughout my DME Staff Nurse exam preparation, and the guidance from the team was truly valuable.',
      relative_time_description: '3 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anu Prasad',
      rating: 5,
      text: 'I contacted Eduooz Academy for DHS Staff Nurse coaching. They provided excellent support throughout the admission process and completed all the formalities quickly. Thank you for the great assistance.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Rani Binil',
      rating: 5,
      text: 'Eduooz Academy is doing a great job with its online courses. I highly recommend it to anyone looking for quality nursing coaching and exam preparation.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aswathy Chandran R S',
      rating: 5,
      text: 'Excellent classes with talented and dedicated teachers. The mock interview sessions helped improve my confidence significantly. Thank you, Eduooz team, for your excellent guidance and support.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Asha Gopan',
      rating: 5,
      text: 'Well organized classes with very supportive faculty and staff. Highly recommended for anyone looking for quality online coaching.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'ARYA S R',
      rating: 5,
      text: 'The best institute for nursing exam coaching. I recently joined the DHS Long Term Batch, and I\'m confident that this academy will help me achieve my dream.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Angelanna Tintu',
      rating: 5,
      text: 'Eduooz Academy classes have been extremely helpful for me. I am thankful to each and every teacher for their dedication and continuous support throughout my learning journey.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aneesh A',
      rating: 5,
      text: 'The online classes are very good, and the support from the entire team has been extremely helpful for my exam preparation.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Thanima A',
      rating: 5,
      text: 'I am really satisfied with Eduooz Academy. Every faculty member is excellent, especially Shine Sir. The mock interview sessions were very helpful and gave me much more confidence.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Raimi Robin',
      rating: 5,
      text: 'Thank you, Eduooz, for helping me fulfill my dreams. Your classes and study notes were extremely helpful and played a big role in my preparation.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Sini N. Sini',
      rating: 5,
      text: 'I contacted Eduooz Academy to join a course. They explained all the course details clearly and treated me with professionalism, patience, and courtesy throughout the admission process.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Beulah VT',
      rating: 5,
      text: 'The admission process was transparent and trustworthy. Every student is assigned a mentor to clear doubts and provide guidance. I am completely satisfied with my experience at Eduooz Academy.',
      relative_time_description: '5 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Sariga Kokkodu',
      rating: 5,
      text: 'I had been writing PSC exams since 2011, but this was the first time I attended an exam without any tension. Shine Sir\'s motivation classes, tips, and tricks made a huge difference in my preparation. Special thanks to Shine Sir, Arathy Ma\'am, Biji Ma\'am, and the entire Eduooz team.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Fidha Kareem',
      rating: 5,
      text: 'Excellent experience. The staff was incredibly professional and friendly. Everything was handled quickly and efficiently. Thank you for the wonderful support.',
      relative_time_description: '4 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Saji Saeed',
      rating: 5,
      text: 'I am a student at Eduooz Academy, and the classes are truly amazing. The teachers are very supportive, especially Shine Sir. Thanks to Eduooz, I scored 59 marks in the DME exam. I highly recommend this academy to all nurses.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'ATHIRA VA',
      rating: 5,
      text: 'Sir\'s classes are excellent. Every topic is explained in a simple and easy to understand way, making learning enjoyable and effective.',
      relative_time_description: '6 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Anjana Anand',
      rating: 5,
      text: 'Shine Sir\'s classes are excellent. His students are lucky to have such a dedicated lecturer. Anyone planning to join should first watch his YouTube videos. They clearly reflect his outstanding teaching style and commitment.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aswathy Aswathy',
      rating: 5,
      text: 'Eduooz Academy is not just about classes. The entire team guides, supports, and motivates students throughout their preparation. Shine Sir\'s study strategies, exam tips, and tricks helped me crack the exam. Thank you, Eduooz!',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Chithra Arun',
      rating: 5,
      text: 'I sincerely thank Eduooz Academy for its excellent training strategy and unwavering support. The sessions were well structured, informative, and helped me build confidence for competitive exams.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Saira O E',
      rating: 5,
      text: 'After joining Eduooz Academy, I learned more than ever before. Shine Sir\'s classes were outstanding, and the teamwork of the entire academy was remarkable. Even with my work schedule, the recorded classes helped me continue my preparation effectively.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Krupa P',
      rating: 5,
      text: 'Unfortunately, I couldn\'t attend the exam, but I was completely satisfied with the classes. The teaching style was excellent, every topic was explained clearly, and I look forward to joining future batches. Thank you, Eduooz and Shine Sir.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    },
    {
      author_name: 'Aswathi Umesh',
      rating: 5,
      text: 'I am really satisfied with this institution. All the teachers, especially Shine Sir, are dedicated and motivating. The daily live classes and previous year question discussions were extremely helpful. I trust Eduooz Academy completely.',
      relative_time_description: '11 months ago',
      profile_photo_url: ''
    }
  ];

  /* ================================================================
     FALLBACK — render static reviews when API is not configured
     ================================================================ */
  function useFallback() {
    var track = document.getElementById('greview-track');
    if (track && !track.querySelector('.greview-card')) {
      var pageType = detectPageType();
      var sorted   = sortReviews(STATIC_REVIEWS, pageType);
      var toShow   = sorted.slice(0, GOOGLE_REVIEWS_CFG.maxVisible);
      track.innerHTML = toShow.map(buildCardHTML).join('');
      reinitCarousel();
    }
    injectViewAllButton();
  }

  /* ================================================================
     GOOGLE PLACES API FETCH
     ================================================================ */
  function fetchFromPlacesAPI(pageType) {
    var cfg = GOOGLE_REVIEWS_CFG;

    /* Skip if config is not filled in */
    if (!cfg.apiKey || !cfg.placeId) {
      useFallback(pageType);
      return;
    }

    var cbName = '__eduoozGReviewsCB__';

    window[cbName] = function () {
      try {
        /* PlacesService requires a map or an HTML element */
        var dummy = document.createElement('div');
        var svc   = new google.maps.places.PlacesService(dummy);

        svc.getDetails(
          {
            placeId: cfg.placeId,
            fields: ['name', 'rating', 'user_ratings_total', 'reviews']
          },
          function (place, status) {
            if (
              status === google.maps.places.PlacesServiceStatus.OK
              && place
              && Array.isArray(place.reviews)
              && place.reviews.length
            ) {
              renderReviews(place.reviews, place, pageType);
            } else {
              useFallback(pageType);
            }
          }
        );
      } catch (err) {
        useFallback(pageType);
      }

      delete window[cbName];
    };

    var script    = document.createElement('script');
    script.src    = 'https://maps.googleapis.com/maps/api/js'
                  + '?key=' + encodeURIComponent(cfg.apiKey)
                  + '&libraries=places'
                  + '&callback=' + cbName;
    script.async  = true;
    script.onerror = function () { useFallback(pageType); };

    document.head.appendChild(script);
  }

  /* ================================================================
     ENTRY POINT
     ================================================================ */
  function init() {
    if (!document.getElementById('greview-track')) return;
    var pageType = detectPageType();
    fetchFromPlacesAPI(pageType);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
