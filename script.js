(function () {
  const THEME_KEY = "restaurando-theme";

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    const icon = document.getElementById("theme-toggle-icon");
    if (icon) {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  function initTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") {
        applyTheme(stored);
        return stored;
      }
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      applyTheme(initial);
      return initial;
    } catch {
      applyTheme("light");
      return "light";
    }
  }

  let currentTheme = initTheme();

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(currentTheme);
      try {
        localStorage.setItem(THEME_KEY, currentTheme);
      } catch {
        // ignore
      }
    });
  }

  // Product form logic
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const priceInput = document.getElementById("price");
      const categorySelect = document.getElementById("category");

      const name = nameInput.value.trim();
      const priceStr = priceInput.value.trim();
      const category = categorySelect.value;

      const errorName = document.getElementById("error-name");
      const errorPrice = document.getElementById("error-price");
      const errorCategory = document.getElementById("error-category");

      errorName.hidden = true;
      errorPrice.hidden = true;
      errorCategory.hidden = true;

      let hasError = false;

      if (!name) {
        errorName.textContent = "Nome do produto é obrigatório";
        errorName.hidden = false;
        hasError = true;
      }

      const priceNumber = Number(priceStr.replace(",", "."));
      if (!priceStr || Number.isNaN(priceNumber) || priceNumber <= 0) {
        errorPrice.textContent = "O preço deve ser um número positivo";
        errorPrice.hidden = false;
        hasError = true;
      }

      if (!category) {
        errorCategory.textContent = "Por favor, selecione uma categoria";
        errorCategory.hidden = false;
        hasError = true;
      }

      if (hasError) return;

      const product = {
        name,
        price: priceNumber,
        category
      };

      console.log("Product data:", product);

      try {
        const raw = localStorage.getItem("restaurando-products");
        const stored = raw ? JSON.parse(raw) : [];
        stored.push(product);
        localStorage.setItem("restaurando-products", JSON.stringify(stored));
      } catch {
        // ignore persistence errors
      }

      const toast = document.getElementById("toast-success");
      if (toast) {
        toast.classList.add("visible");
        setTimeout(() => {
          toast.classList.remove("visible");
        }, 2000);
      }

      nameInput.value = "";
      priceInput.value = "";
      categorySelect.value = "Entradas";
    });
  }
})();
