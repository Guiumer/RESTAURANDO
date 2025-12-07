// order_script.js
const API_URL = "http://127.0.0.1:5000/api/produtos";
const API_PEDIDOS = "http://127.0.0.1:5000/api/pedidos";

const produtoSelect = document.getElementById("produto-select");
const btnAdd = document.getElementById("btn-add-item");
const orderItems = document.getElementById("order-items");
const orderForm = document.getElementById("order-form");
const mesaInput = document.getElementById("mesa");
const quantInput = document.getElementById("quant");

let produtosCache = [];
let itensTemp = []; // { produto_id, nome, quantidade }

async function carregarProdutosSelect() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    produtosCache = data;
    produtoSelect.innerHTML = "";
    data.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.nome} — R$ ${Number(p.preco).toFixed(2)}`;
      produtoSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

function renderItens() {
  orderItems.innerHTML = "";
  itensTemp.forEach((it, idx) => {
    const li = document.createElement("li");
    li.className = "list-item";
    li.innerHTML = `${it.nome} x ${it.quantidade} <button class="button button-outline" data-idx="${idx}">Remover</button>`;
    orderItems.appendChild(li);
  });
  // remover handler
  document.querySelectorAll("#order-items button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.target.getAttribute("data-idx"));
      itensTemp.splice(idx, 1);
      renderItens();
    });
  });
}

btnAdd.addEventListener("click", () => {
  const produtoId = Number(produtoSelect.value);
  const quant = Number(quantInput.value);
  if (!produtoId || quant <= 0) return alert("Selecione produto e quantidade válidos");
  const prod = produtosCache.find(p => p.id === produtoId);
  if (!prod) return alert("Produto inválido");
  itensTemp.push({ produto_id: produtoId, nome: prod.nome, quantidade: quant });
  renderItens();
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mesa = Number(mesaInput.value);
  if (!mesa || itensTemp.length === 0) return alert("Informe mesa e adicione pelo menos 1 item");

  const payload = {
    mesa: mesa,
    itens: itensTemp.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade })),
    garcom: { id: 1, nome: "João" } // exemplo de garçom
  };

  try {
    const resp = await fetch(API_PEDIDOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new Error("Falha ao criar pedido");

    const data = await resp.json();
    alert(`Pedido criado! ID ${data.id} — Total R$ ${Number(data.total).toFixed(2)}`);
    // limpar
    itensTemp = [];
    renderItens();
  } catch (err) {
    console.error(err);
    alert("Erro ao criar pedido");
  }
});

// inicia
carregarProdutosSelect();
