const API_URL = "http://127.0.0.1:5000/api/produtos";


const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-toggle-icon");

// Carrega o tema salvo
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (themeIcon) themeIcon.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      if (themeIcon) themeIcon.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      if (themeIcon) themeIcon.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
}


const form = document.getElementById("product-form");
const toast = document.getElementById("toast-success");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("name").value.trim();
    const preco = Number(document.getElementById("price").value);
    const categoria = document.getElementById("category").value;

    if (!nome || !preco || !categoria) {
      alert("Preencha todos os campos!");
      return;
    }

    const produto = { nome, preco, categoria };

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });

      if (!resp.ok) throw new Error("Erro ao salvar produto.");

      const data = await resp.json();
      console.log("Produto salvo:", data);

      if (toast) {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-20px)";
        }, 3000);
      }

      form.reset();

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend!");
    }
  });
}


async function carregarProdutos() {
  const tabela = document.getElementById("product-list");
  if (!tabela) return;

  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();

    tabela.innerHTML = "";

    data.forEach(prod => {
      tabela.innerHTML += `
        <tr>
          <td>${prod.id}</td>
          <td>${prod.nome}</td>
          <td>R$ ${prod.preco.toFixed(2)}</td>
          <td>${prod.categoria}</td>
        </tr>`;
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}


let pedidosAntigos = [
  { id: 1, mesa: 2, item: "X-Burger", status: "pendente" },
  { id: 2, mesa: 4, item: "Pizza Portuguesa", status: "preparo" },
  { id: 3, mesa: 1, item: "Refrigerante", status: "pronto" }
];

function renderKanban() {
  const colP = document.getElementById("old-col-pendente");
  const colR = document.getElementById("old-col-preparo");
  const colT = document.getElementById("old-col-pronto");

  if (!colP) return;

  colP.innerHTML = "";
  colR.innerHTML = "";
  colT.innerHTML = "";

  pedidosAntigos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("kanban-old-card");

    card.innerHTML = `
      <strong>Pedido #${p.id}</strong><br>
      Mesa: ${p.mesa}<br>
      Item: ${p.item}<br><br>
      ${gerarBotao(p)}
    `;

    if (p.status === "pendente") colP.appendChild(card);
    if (p.status === "preparo") colR.appendChild(card);
    if (p.status === "pronto") colT.appendChild(card);
  });
}

function gerarBotao(p) {
  if (p.status === "pendente") {
    return `<button onclick="moverParaPreparo(${p.id})" class="kanban-btn prep-btn">Mover para Preparo</button>`;
  }
  if (p.status === "preparo") {
    return `<button onclick="moverParaPronto(${p.id})" class="kanban-btn pronto-btn">Mover para Pronto</button>`;
  }
  if (p.status === "pronto") {
    return `<button onclick="finalizarPedido(${p.id})" class="kanban-btn fim-btn">Finalizar</button>`;
  }
}

function moverParaPreparo(id) {
  pedidosAntigos = pedidosAntigos.map(p =>
    p.id === id ? { ...p, status: "preparo" } : p
  );
  renderKanban();
}

function moverParaPronto(id) {
  pedidosAntigos = pedidosAntigos.map(p =>
    p.id === id ? { ...p, status: "pronto" } : p
  );
  renderKanban();
}

function finalizarPedido(id) {
  pedidosAntigos = pedidosAntigos.filter(p => p.id !== id);
  renderKanban();
}


document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos();
  renderKanban();
});
