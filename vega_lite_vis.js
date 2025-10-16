const MAP_SPEC_URL      = "population_by_state.vg.json";
const COMBO_SPEC_URL    = "income_poverty.vg.json";
const SMALLS_SPEC_URL   = "poverty_small_multiples.vg.json";

function embedWithBindings(targetSelector, specUrl, bindingsSelector) {
  const targetEl = document.querySelector(targetSelector);
  if (!targetEl) {
    console.warn(`Target not found: ${targetSelector}`);
    return Promise.resolve(null);
  }

  targetEl.innerHTML = "";

  return vegaEmbed(targetEl, specUrl, { actions: false, renderer: "canvas" })
    .then((res) => {
      const bindings =
        targetEl.querySelector(".vega-bindings") ||
        (res.view && typeof res.view.container === "function"
          ? res.view.container().querySelector(".vega-bindings")
          : null);

      if (bindings && bindingsSelector) {
        const host = document.querySelector(bindingsSelector);
        if (host) host.appendChild(bindings);
      }

      return res;
    })
    .catch((err) => {
      console.error(`Error embedding ${specUrl}:`, err);
      targetEl.innerHTML = `
        <div style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fffbea;color:#7c2d12;">
          Failed to load <code>${specUrl}</code>. Check the console for details.
        </div>`;
      return null;
    });
}

function embedAll() {
  // MAP with custom slider host
  embedWithBindings("#map", MAP_SPEC_URL, "#mapBindings");

  // BAR + SCATTER (combined spec) with custom dropdown host
  embedWithBindings("#combo", COMBO_SPEC_URL, "#comboBindings");

  // Small multiples (no custom bindings needed)
  vegaEmbed("#smallMultiples", SMALLS_SPEC_URL, { actions: false, renderer: "canvas" })
    .catch(console.error);
}

document.addEventListener("DOMContentLoaded", embedAll);
