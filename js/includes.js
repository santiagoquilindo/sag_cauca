// Carga parcial simple para header y footer
const loadPartial = async (targetId, url) => {
  const container = document.getElementById(targetId);
  if (!container) return { targetId, loaded: false };

  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    const html = await response.text();
    container.innerHTML = html;
    return { targetId, loaded: true };
  } catch (error) {
    console.error(`No se pudo cargar ${url}:`, error);
    container.innerHTML = "";
    return { targetId, loaded: false, error };
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const results = await Promise.all([
    loadPartial("site-header", "partials/header.html"),
    loadPartial("site-footer", "partials/footer.html"),
  ]);

  const detail = {
    results,
    loaded: results.every((r) => r.loaded),
  };

  document.dispatchEvent(new CustomEvent("partials:loaded", { detail }));
});
