(() => {
  const CONTACT_EMAIL = "sagcauca@gmail.com";
  const WHATSAPP_NUMBER = "573155692130";
  const HERO_CAROUSEL_IMAGES = [
    "/public/img/azucar.jpg",
    "/public/img/cafe1.jpg",
    "/public/img/panela.jpg",
    "/public/img/pinos.png",
    "/public/img/mano.jpg",
  ];
  const HERO_CAROUSEL_INTERVAL_MS = 4500;
  let initialized = false;

  const setFooterYear = () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear().toString();
    }
  };

  const setupNavToggle = () => {
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (!navToggle || !mainNav) return;

    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cierra el men&uacute; al hacer click en un enlace (mejora UX en m&oacute;vil).
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mainNav.classList.contains("open")) {
          mainNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  };

  const highlightActiveNav = () => {
    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("#mainNav a").forEach((link) => {
      const href = link.getAttribute("href")?.toLowerCase();
      const isActive = href === current || (href === "index.html" && current === "");
      link.classList.toggle("active", Boolean(isActive));
    });
  };

  const isValidEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

  const getStatusElement = (form) =>
    form.querySelector(".form-status") || document.getElementById("contactStatus");

  const updateStatus = (statusEl, message, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#b23b3b" : "var(--color-primary)";
  };

  const buildBody = ({ nombre, correo, mensaje }) =>
    [
      "Datos de contacto desde el formulario:",
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      "",
      "Mensaje:",
      mensaje,
    ].join("\n");

  const handleFormSubmit = (form) => (event) => {
    event.preventDefault();

    const nombre = form.querySelector("#nombre")?.value.trim() || "";
    const correo = form.querySelector("#correo")?.value.trim() || "";
    const canal = form.querySelector("#canal")?.value || "correo";
    const mensaje = form.querySelector("#mensaje")?.value.trim() || "";
    const statusEl = getStatusElement(form);

    if (!nombre || !correo || !mensaje) {
      updateStatus(statusEl, "Por favor completa nombre, correo y mensaje.", true);
      return;
    }

    if (!isValidEmail(correo)) {
      updateStatus(statusEl, "Ingresa un correo electr&oacute;nico v&aacute;lido.", true);
      return;
    }

    const cuerpo = buildBody({ nombre, correo, mensaje });

    if (canal === "whatsapp") {
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cuerpo)}`;
      updateStatus(
        statusEl,
        "Abriendo WhatsApp con tu mensaje. Si no se abre, copia y p&eacute;galo manualmente."
      );
      window.open(waUrl, "_blank", "noopener");
      return;
    }

    const asunto = encodeURIComponent(`Contacto web - ${nombre}`);
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${asunto}&body=${encodeURIComponent(
      cuerpo
    )}`;
    updateStatus(
      statusEl,
      "Abriendo tu cliente de correo. Si no se abre, copia el mensaje y env&iacute;alo manualmente."
    );
    window.location.href = mailtoUrl;
  };

  const setupContactForms = () => {
    const forms = document.querySelectorAll(".contact-form");
    if (!forms.length) return;

    forms.forEach((form) => {
      form.addEventListener("submit", handleFormSubmit(form));
    });
  };

  const setHeroBgImage = (element, src) => {
    element.style.setProperty("--hero-bg-image", `url('${src}')`);
  };

  const setupHeroCarousel = () => {
    const heroes = document.querySelectorAll(".page-hero, .hero");
    if (!heroes.length || HERO_CAROUSEL_IMAGES.length < 2) return;

    heroes.forEach((hero, heroIndex) => {
      const bgPrimary = document.createElement("div");
      const bgSecondary = document.createElement("div");
      bgPrimary.className = "hero-bg is-visible";
      bgSecondary.className = "hero-bg";

      hero.prepend(bgSecondary);
      hero.prepend(bgPrimary);

      let current = heroIndex % HERO_CAROUSEL_IMAGES.length;
      let next = (current + 1) % HERO_CAROUSEL_IMAGES.length;
      let active = bgPrimary;
      let idle = bgSecondary;

      setHeroBgImage(active, HERO_CAROUSEL_IMAGES[current]);
      setHeroBgImage(idle, HERO_CAROUSEL_IMAGES[next]);

      setInterval(() => {
        active.classList.remove("is-visible");
        idle.classList.add("is-visible");

        current = next;
        next = (next + 1) % HERO_CAROUSEL_IMAGES.length;

        const oldActive = active;
        active = idle;
        idle = oldActive;

        setHeroBgImage(idle, HERO_CAROUSEL_IMAGES[next]);
      }, HERO_CAROUSEL_INTERVAL_MS);
    });
  };

  const init = () => {
    if (initialized) return;
    setFooterYear();
    setupNavToggle();
    setupContactForms();
    setupHeroCarousel();
    highlightActiveNav();
    initialized = true;
  };

  // Inicializa tras insertar los parciales; incluye fallback si falla la carga.
  document.addEventListener("partials:loaded", init);
  document.addEventListener("DOMContentLoaded", () => {
    // Fallback para casos sin includes.js o si los parciales ya estaban en el DOM.
    setTimeout(init, 50);
  });
})();
