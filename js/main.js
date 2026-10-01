const CONTACT_EMAIL = "laxmifarmstays@gmail.com";
const WHATSAPP_NUMBER = "917032520408";

const navToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".menu");
const form = document.querySelector("#enquiry-form");
const statusEl = document.querySelector("#form-status");
const lightbox = document.querySelector("#lightbox");
const lightboxImg = lightbox.querySelector("img");

navToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".gallery button").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImg.src = button.dataset.full;
    lightboxImg.alt = button.querySelector("img").alt;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const subject = `Stay enquiry — Laxmi Vanam Farmhouse (${data.checkin})`;
  const message = [
    "Hello, I would like to enquire about a stay at Laxmi Vanam Farmhouse.",
    `Name: ${data.name}`,
    `Contact: ${data.contact}`,
    `Check-in: ${data.checkin}`,
    `Guests: ${data.guests}`,
    `Notes: ${data.notes || "None"}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  statusEl.textContent = "Sending your enquiry by email and opening WhatsApp...";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        name: data.name,
        contact: data.contact,
        checkin: data.checkin,
        guests: data.guests,
        notes: data.notes || "None",
      }),
    });
    const result = await response.json();

    if (!response.ok || (result.success !== true && result.success !== "true")) {
      throw new Error("The enquiry email could not be sent.");
    }

    statusEl.textContent = "Enquiry emailed. Review and send the prepared WhatsApp message.";
  } catch (error) {
    statusEl.textContent = "Email could not be sent. Please try again or contact us on WhatsApp.";
  } finally {
    submitButton.disabled = false;
  }
});
