const CONTACT_EMAIL = ""; // e.g. "bookings@example.com"

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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const subject = `Stay enquiry — Laxmi Vanam Farmhouse (${data.checkin})`;
  const body = [
    `Name: ${data.name}`,
    `Contact: ${data.contact}`,
    `Check-in: ${data.checkin}`,
    `Guests: ${data.guests}`,
    "",
    data.notes || "No extra notes.",
  ].join("\n");

  const mailto = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  statusEl.textContent = CONTACT_EMAIL
    ? "Opening your email app with the enquiry."
    : "Opening your email app. Add a To address, or set CONTACT_EMAIL in js/main.js.";
});
