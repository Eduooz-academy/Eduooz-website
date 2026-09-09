const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWaKNiZFQieppC2gC-gZFxX2j0iJX_9Jz5-lrZg-0pNRrPkuSsgxyglw49T41msoWe/exec";

// CONTACT FORM
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Sending...";

    const data = {
      formType: "contact",
      name: contactForm.elements["name"].value.trim(),
      email: contactForm.elements["email"].value.trim(),
      phone: contactForm.elements["phone"].value.trim(),
      state: contactForm.elements["state"].value.trim(),
      subject: contactForm.elements["subject"].value.trim(),
      message: contactForm.elements["message"].value.trim()
    };

    try {
      // Remove the no-cors mode and change content type
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      // Parse the response to check if it was successful
      const result = await response.json();
      
      if (result.success) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Error: " + result.message);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");

    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}