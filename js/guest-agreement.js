const agreementForm = document.querySelector("#agreement-form");
const agreementStatus = document.querySelector("#agreement-status");
const pdfInput = document.querySelector("#agreement-pdf");
let controlsToRestore = [];

if (new URLSearchParams(window.location.search).get("agreement") === "submitted") {
  agreementStatus.textContent = "Agreement submitted to farmhouse management. The signed PDF is attached to the email.";
  window.history.replaceState(null, "", window.location.pathname);
}

function restoreFormControls() {
  controlsToRestore.forEach(([control, wasDisabled]) => {
    control.disabled = wasDisabled;
  });
  controlsToRestore = [];
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("The PDF tool could not be loaded."));
    document.head.append(script);
  });
}

async function loadPdfMaker() {
  if (!window.pdfMake) {
    await loadScript("https://cdn.jsdelivr.net/npm/pdfmake@0.2.20/build/pdfmake.min.js");
  }
  if (!window.pdfMake.vfs) {
    await loadScript("https://cdn.jsdelivr.net/npm/pdfmake@0.2.20/build/vfs_fonts.js");
  }
}

function createAgreementPdf(data, signedAt) {
  const content = [
    { text: "LAXMI VANAM", style: "brand" },
    { text: "Guest Rules & Agreement", style: "title" },
    { text: "Bhuvanagiri, Telangana", style: "subtitle" },
    { text: "Please read and follow these rules throughout your stay.", margin: [0, 0, 0, 12] },
  ];

  document.querySelectorAll(".rules-section").forEach((section) => {
    content.push({ text: section.querySelector("h2").textContent, style: "sectionHeading", margin: [0, 10, 0, 5] });

    section.querySelectorAll(".rule").forEach((rule) => {
      const number = rule.querySelector(".rule-number, .rule-mark")?.textContent.trim();
      const heading = rule.querySelector("h3").textContent.trim();
      const description = rule.querySelector("p").textContent.trim();
      content.push({ text: `${number ? `${number}. ` : ""}${heading}`, style: "ruleHeading", margin: [0, 4, 0, 1] });
      content.push({ text: description, style: "bodyText" });
    });
  });

  document.querySelectorAll(".responsibility-note p").forEach((paragraph, index) => {
    if (index === 0) content.push({ text: "Guest responsibility", style: "sectionHeading", margin: [0, 10, 0, 5] });
    content.push({ text: paragraph.textContent.trim(), style: "bodyText" });
  });

  const confirmedRules = [...document.querySelectorAll(".rule-acknowledgement input:checked")].map((input) => ({
    text: `[CONFIRMED] ${input.closest("label").querySelector("strong").textContent.trim()}`,
    style: "detail",
  }));

  content.push(
    { text: "Signed Guest Acknowledgement", style: "sectionHeading", margin: [0, 14, 0, 5] },
    { text: "I confirm that I have read, understood, and agree to follow all farmhouse rules during my stay at Laxmi Vanam.", style: "bodyText" },
    ...confirmedRules,
    { text: `Guest name: ${data.guest_name}`, style: "detail" },
    { text: `Mobile number: ${data.mobile}`, style: "detail" },
    { text: `Booking date: ${data.booking_date}`, style: "detail" },
    { text: `Check-in: ${data.checkin_date}`, style: "detail" },
    { text: `Check-out: ${data.checkout_date}`, style: "detail" },
    { text: `Declared guests: ${data.declared_guests}`, style: "detail" },
    { text: `Electronic signature: ${data.guest_signature}`, style: "signature" },
    { text: `Signed on: ${signedAt}`, style: "detail" },
  );

  return {
    pageSize: "A4",
    pageMargins: [42, 42, 42, 48],
    content,
    defaultStyle: { font: "Roboto", fontSize: 9, color: "#1b2418", lineHeight: 1.2 },
    styles: {
      brand: { fontSize: 11, bold: true, color: "#2f4a32", characterSpacing: 1.2 },
      title: { fontSize: 22, bold: true, color: "#1b2418", margin: [0, 4, 0, 2] },
      subtitle: { fontSize: 9, color: "#5c6757", margin: [0, 0, 0, 8] },
      sectionHeading: { fontSize: 13, bold: true, color: "#2f4a32" },
      ruleHeading: { fontSize: 9.5, bold: true },
      bodyText: { fontSize: 8.5, color: "#3f493c", margin: [0, 0, 0, 3] },
      detail: { fontSize: 9, margin: [0, 3, 0, 0] },
      signature: { fontSize: 11, bold: true, color: "#2f4a32", margin: [0, 8, 0, 2] },
    },
    footer: (currentPage, pageCount) => ({
      text: `Laxmi Vanam Farmhouse · Guest Agreement · Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      color: "#5c6757",
      margin: [0, 18, 0, 0],
    }),
  };
}

function getPdfBlob(definition) {
  return new Promise((resolve, reject) => {
    try {
      window.pdfMake.createPdf(definition).getBlob(resolve);
    } catch (error) {
      reject(error);
    }
  });
}

agreementForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!agreementForm.reportValidity()) return;

  const submitButton = agreementForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(agreementForm).entries());
  submitButton.disabled = true;
  agreementStatus.textContent = "Preparing your signed PDF...";

  try {
    await loadPdfMaker();
    const signedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const pdfBlob = await getPdfBlob(createAgreementPdf(data, signedAt));
    const filename = `Laxmi-Vanam-Agreement-${data.guest_name.replace(/[^a-z0-9]+/gi, "-")}.pdf`;
    const transfer = new DataTransfer();
    transfer.items.add(new File([pdfBlob], filename, { type: "application/pdf" }));
    pdfInput.files = transfer.files;
    document.querySelector("#agreement-subject").value = `Signed guest agreement — ${data.guest_name} (${data.checkin_date})`;
    document.querySelector("#agreement-next").value = `${window.location.origin}${window.location.pathname}?agreement=submitted`;
    document.querySelector("#agreement-email-message").value = "The signed guest agreement is attached as a PDF.";

    agreementStatus.textContent = "Sending the signed PDF. FormSubmit will return a confirmation or an error.";
    const includedFields = new Set(["_subject", "_next", "_template", "_captcha", "message", "attachment"]);
    controlsToRestore = [...agreementForm.elements].map((control) => [control, control.disabled]);
    controlsToRestore.forEach(([control]) => {
      if (!includedFields.has(control.name)) control.disabled = true;
    });
    agreementForm.submit();
  } catch (error) {
    restoreFormControls();
    agreementStatus.textContent = "We could not create or email your signed PDF. Please try again or call +91 70325 20408.";
    submitButton.disabled = false;
  }
});