// ==============================================
// TEMA (CLARO / ESCURO) — ROXO MODERNO
// ==============================================

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-toggle-icon");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      themeIcon.textContent = "☀️";
    } else {
      themeIcon.textContent = "🌙";
    }
  });
}



// ==============================================
// API URLs
// ==============================================

const API_URL = "http://127.0.0.1:5000/api/produtos";
const API_PEDIDOS = "http://127.0.0.1:5000/api/pedidos";



// ==============================================
// LISTAR PRODUTOS (INDEX.HTML)
// ==============================================

async function carregarProdutos() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();

    const tabela = document.getElementById("product-list");
    if (!tabela) return; // só roda no index.html

    tabela.innerHTML = "";

    data.forEach(prod => {
      tabela.innerHTML += `
        <tr>
          <td>${prod.id}</td>
          <td>${prod.nome}</td>
          <td>R$ ${Number(prod.preco).toFixed(2)}</td>
          <td>${prod.categoria}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutos);



// ==============================================
// CADASTRAR NOVO PRODUTO (PRODUCT.HTML)
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  const toast = document.getElementById("toast-success");

  if (!form) return; // só roda no product.html

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

      if (!resp.ok) throw new Error("Erro ao salvar produto no backend.");

      // Sucesso → mostrar toast
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
      }, 3000);

      form.reset();

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend Python!");
    }
  });
});



// ==============================================
// KANBAN — PEDIDOS REAIS DO BACKEND
// ==============================================

async function carregarKanban() {
  try {
    const resp = await fetch(API_PEDIDOS);
    const pedidos = await resp.json();
    renderKanban(pedidos);
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
  }
}


// Renderiza o Kanban
function renderKanban(pedidos) {
  const colP = document.getElementById("old-col-pendente");
  const colR = document.getElementById("old-col-preparo");
  const colT = document.getElementById("old-col-pronto");

  if (!colP) return; // só roda no index.html

  colP.innerHTML = "";
  colR.innerHTML = "";
  colT.innerHTML = "";

  pedidos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("kanban-old-card");

    const itens = p.itens
      .map(i => `${i.nome} x ${i.quantidade}`)
      .join("<br>");

    card.innerHTML = `
      <strong>Pedido #${p.id}</strong><br>
      Mesa: ${p.mesa}<br><br>
      ${itens}<br><br>
      ${gerarBotaoKanban(p)}
    `;

    if (p.status === "pendente") colP.appendChild(card);
    if (p.status === "preparo") colR.appendChild(card);
    if (p.status === "pronto") colT.appendChild(card);
  });
}


// Botões conforme o status
function gerarBotaoKanban(p) {
  if (p.status === "pendente") {
    return `<button onclick="moverStatus(${p.id}, 'preparo')" class="kanban-btn prep-btn">Mover para Preparo</button>`;
  }
  if (p.status === "preparo") {
    return `<button onclick="moverStatus(${p.id}, 'pronto')" class="kanban-btn pronto-btn">Mover para Pronto</button>`;
  }
  if (p.status === "pronto") {
    return `<button onclick="moverStatus(${p.id}, 'finalizado')" class="kanban-btn fim-btn">Finalizar</button>`;
  }
}


// Atualiza no backend
async function moverStatus(id, novoStatus) {
  try {
    await fetch(`${API_PEDIDOS}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus })
    });

    carregarKanban(); // atualiza a tela

  } catch (err) {
    console.error("Erro ao atualizar status:", err);
  }
}


// Atualiza o kanban automaticamente
setInterval(carregarKanban, 3000);
document.addEventListener("DOMContentLoaded", carregarKanban);
