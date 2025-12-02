// ========= THEME ==========
const THEME_KEY = "restaurando-theme";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  const icon = document.getElementById("theme-toggle-icon");
  if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
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
  toggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    try {
      localStorage.setItem(THEME_KEY, currentTheme);
    } catch {}
  });
}

// ========= KANBAN (index.html) ==========
const kanbanRoot = document.getElementById("kanban-root");

if (kanbanRoot) {
  const mockTasks = [
    {
      id: "1",
      title: "Preparar Salada Caesar",
      description: "Alface romana fresca com molho caseiro",
      category: "Entradas",
      status: "todo",
    },
    {
      id: "2",
      title: "Grelhar Bife Ancho",
      description: "Corte prime de 350g com legumes da estação",
      category: "Prato Principal",
      status: "todo",
    },
    {
      id: "3",
      title: "Fazer Limonada",
      description: "Suco fresco para o serviço de hoje",
      category: "Bebidas",
      status: "todo",
    },
    {
      id: "4",
      title: "Preparar Carbonara",
      description: "Receita italiana tradicional com pancetta",
      category: "Prato Principal",
      status: "in_progress",
    },
    {
      id: "5",
      title: "Preparar Bruschetta",
      description: "Tomate e manjericão no pão torrado",
      category: "Entradas",
      status: "in_progress",
    },
    {
      id: "6",
      title: "Montar Tiramisu",
      description: "Sobremesa italiana clássica para 10 porções",
      category: "Sobremesas",
      status: "done",
    },
    {
      id: "7",
      title: "Sopa do Chef",
      description: "Creme de cogumelos com azeite trufado",
      category: "Especiais",
      status: "done",
    },
    {
      id: "8",
      title: "Espresso Martini",
      description: "Coquetel especial para o serviço noturno",
      category: "Bebidas",
      status: "done",
    },
  ];

  const statusConfig = {
    todo: {
      label: "A Fazer",
      icon: "📝",
      gradient: "linear-gradient(135deg,#f97316,#f59e0b)",
    },
    in_progress: {
      label: "Em Andamento",
      icon: "⏱️",
      gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    },
    done: {
      label: "Concluído",
      icon: "✅",
      gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    },
  };

  const categoryClass = {
    Entradas: "badge-cat-entradas",
    "Prato Principal": "badge-cat-prato-principal",
    Sobremesas: "badge-cat-sobremesas",
    Bebidas: "badge-cat-bebidas",
    Especiais: "badge-cat-especiais",
  };

  function renderKanban() {
    const statuses = ["todo", "in_progress", "done"];
    kanbanRoot.innerHTML = "";

    statuses.forEach((status) => {
      const cfg = statusConfig[status];
      const tasks = mockTasks.filter((t) => t.status === status);

      const column = document.createElement("div");
      column.className = "kanban-column";
      column.setAttribute("data-testid", `column-${status}`);

      const header = document.createElement("div");
      header.className = "kanban-column-header";

      const icon = document.createElement("div");
      icon.className = "kanban-icon";
      icon.style.background = cfg.gradient;
      icon.textContent = cfg.icon;

      const title = document.createElement("h3");
      title.className = "kanban-title";
      title.textContent = cfg.label;
      title.setAttribute("data-testid", `text-column-title-${status}`);

      const count = document.createElement("div");
      count.className = "kanban-count";
      count.textContent = tasks.length.toString();
      count.setAttribute("data-testid", `badge-column-count-${status}`);

      header.appendChild(icon);
      header.appendChild(title);
      header.appendChild(count);

      const body = document.createElement("div");
      body.className = "kanban-column-body";

      if (tasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "kanban-empty";
        empty.textContent = "Nenhuma tarefa aqui";
        body.appendChild(empty);
      } else {
        tasks.forEach((task) => {
          const card = document.createElement("article");
          card.className = "task-card";
          card.setAttribute("data-testid", `card-task-${task.id}`);

          const h4 = document.createElement("h4");
          h4.className = "task-title";
          h4.textContent = task.title;
          h4.setAttribute("data-testid", `text-task-title-${task.id}`);

          const p = document.createElement("p");
          p.className = "task-desc";
          p.textContent = task.description;
          p.setAttribute("data-testid", `text-task-description-${task.id}`);

          const badge = document.createElement("div");
          badge.className =
            "badge " + (categoryClass[task.category] || "");
          badge.textContent = task.category;
          badge.setAttribute(
            "data-testid",
            `badge-task-category-${task.id}`
          );

          card.appendChild(h4);
          card.appendChild(p);
          card.appendChild(badge);

          body.appendChild(card);
        });
      }

      column.appendChild(header);
      column.appendChild(body);
      kanbanRoot.appendChild(column);
    });
  }

  renderKanban();
}

// ========= FORM PRODUTO (product.html) ==========
const productForm = document.getElementById("product-form");

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
}

function hideError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = true;
}

function showToastSuccess() {
  const toast = document.getElementById("toast-success");
  if (!toast) return;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("name");
    const priceEl = document.getElementById("price");
    const categoryEl = document.getElementById("category");

    const name = nameEl.value.trim();
    const priceStr = priceEl.value.trim();
    const category = categoryEl.value;

    let hasError = false;

    if (!name) {
      showError("error-name", "Nome do produto é obrigatório");
      hasError = true;
    } else hideError("error-name");

    const price = Number(priceStr.replace(",", "."));
    if (!priceStr || Number.isNaN(price) || price <= 0) {
      showError("error-price", "O preço deve ser um número positivo");
      hasError = true;
    } else hideError("error-price");

    if (!category) {
      showError("error-category", "Por favor, selecione uma categoria");
      hasError = true;
    } else hideError("error-category");

    if (hasError) return;

    const product = { name, price, category };

    try {
      const raw = localStorage.getItem("restaurando-products");
      const stored = raw ? JSON.parse(raw) : [];
      stored.push(product);
      localStorage.setItem("restaurando-products", JSON.stringify(stored));
    } catch {
      // ignore
    }

    showToastSuccess();
    productForm.reset();
    categoryEl.value = "Entradas";
  });
}

// ========= LISTAGEM E EXCLUSÃO (products.html) ==========
const productsBody = document.getElementById("products-body");
const noProductsText = document.getElementById("no-products");

function loadProductsTable() {
  if (!productsBody) return;

  let products = [];
  try {
    const raw = localStorage.getItem("restaurando-products");
    products = raw ? JSON.parse(raw) : [];
  } catch {
    products = [];
  }

  productsBody.innerHTML = "";

  if (!products.length) {
    if (noProductsText) noProductsText.hidden = false;
    return;
  }

  if (noProductsText) noProductsText.hidden = true;

  products.forEach((p, index) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = p.name;

    const tdCategory = document.createElement("td");
    tdCategory.textContent = p.category;

    const tdPrice = document.createElement("td");
    tdPrice.textContent = `R$ ${Number(p.price).toFixed(2)}`;

    const tdActions = document.createElement("td");
    tdActions.className = "col-actions";

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.className = "button button-outline";
    btnDelete.textContent = "🗑 Excluir";
    btnDelete.addEventListener("click", () => {
      deleteProduct(index);
    });

    tdActions.appendChild(btnDelete);

    tr.appendChild(tdName);
    tr.appendChild(tdCategory);
    tr.appendChild(tdPrice);
    tr.appendChild(tdActions);

    productsBody.appendChild(tr);
  });
}

// Tornar função global para ser usada se precisar
window.deleteProduct = function (index) {
  try {
    const raw = localStorage.getItem("restaurando-products");
    const products = raw ? JSON.parse(raw) : [];
    products.splice(index, 1);
    localStorage.setItem(
      "restaurando-products",
      JSON.stringify(products)
    );
  } catch {}
  loadProductsTable();
};

loadProductsTable();
