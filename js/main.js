// Menú hamburguesa en móvil
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// Año dinámico en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Envío por mailto del formulario de contacto (sin almacenar datos)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = contactForm.querySelector("#nombre")?.value.trim() || "";
    const correo = contactForm.querySelector("#correo")?.value.trim() || "";
    const canal = contactForm.querySelector("#canal")?.value || "correo";
    const mensaje = contactForm.querySelector("#mensaje")?.value.trim() || "";
    const statusEl = document.getElementById("contactStatus");

    if (!nombre || !correo || !mensaje) {
      if (statusEl) {
        statusEl.textContent = "Por favor completa nombre, correo y mensaje.";
        statusEl.style.color = "#b23b3b";
      }
      return;
    }

    const cuerpo = [
      "Datos de contacto desde el formulario:",
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      "",
      "Mensaje:",
      mensaje,
    ].join("\n");

    if (canal === "whatsapp") {
      const numeroWhatsApp = "573155692130";
      const waUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        cuerpo
      )}`;
      if (statusEl) {
        statusEl.textContent =
          "Abriendo WhatsApp con tu mensaje. Si no se abre, copia y pégalo manualmente.";
        statusEl.style.color = "var(--color-primary)";
      }
      window.open(waUrl, "_blank");
    } else {
      const destinatario = "sagcaucapw@gmail.com";
      const asunto = encodeURIComponent(`Contacto web - ${nombre}`);
      const mailtoUrl = `mailto:${destinatario}?subject=${asunto}&body=${encodeURIComponent(
        cuerpo
      )}`;
      if (statusEl) {
        statusEl.textContent =
          "Abriendo tu cliente de correo. Si no se abre, copia el mensaje y envíalo manualmente.";
        statusEl.style.color = "var(--color-primary)";
      }
      window.location.href = mailtoUrl;
    }
  });
}
