const API_URL = "http://127.0.0.1:5000/api/produtos";

const form = document.getElementById("product-form");
const toast = document.getElementById("toast-success");

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
      body: JSON.stringify(produto)
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
