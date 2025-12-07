# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Produto, Pedido, Mesa, Garcom

app = Flask(__name__)
CORS(app)

# armazenamento em memória (substituir por DB quando quiser)
produtos = []
pedidos = []
mesas = {}

# dados iniciais (opcional)
produtos.append(Produto("X-Burger", 22.5, "Prato Principal"))
produtos.append(Produto("Coca-Cola", 8.0, "Bebida"))

# criar / listar produtos (mantido)
@app.route("/api/produtos", methods=["POST"])
def criar_produto():
    data = request.get_json()
    nome = data.get("nome")
    preco = float(data.get("preco"))
    categoria = data.get("categoria")
    p = Produto(nome, preco, categoria)
    produtos.append(p)
    return jsonify({
        "id": p.id, "nome": p.nome, "preco": p.preco, "categoria": p.categoria
    }), 201

@app.route("/api/produtos", methods=["GET"])
def listar_produtos():
    return jsonify([{"id": p.id, "nome": p.nome, "preco": p.preco, "categoria": p.categoria} for p in produtos])


# -----------------------
# MESAS
# -----------------------
@app.route("/api/mesas/<int:numero>", methods=["GET"])
def get_or_create_mesa(numero):
    if numero not in mesas:
        mesas[numero] = Mesa(numero)
    m = mesas[numero]
    return jsonify({"numero": m.numero, "aberta": m.aberta})


# -----------------------
# PEDIDOS
# -----------------------
# Criar um pedido
# corpo: { "mesa": 3, "itens": [ { "produto_id": 1, "quantidade": 2 }, ... ], "garcom": {"id":1, "nome":"João"} }
@app.route("/api/pedidos", methods=["POST"])
def criar_pedido():
    data = request.get_json()
    mesa_num = int(data.get("mesa"))
    itens = data.get("itens", [])
    garcom_data = data.get("garcom", None)

    # obter ou criar mesa
    if mesa_num not in mesas:
        mesas[mesa_num] = Mesa(mesa_num)
    mesa = mesas[mesa_num]
    mesa.abrirMesa()

    # criar pedido via Garcom (se fornecido)
    if garcom_data:
        garcom = Garcom(garcom_data.get("id", 0), garcom_data.get("nome", "Garcom"))
        pedido = garcom.abrirPedido(mesa)
    else:
        pedido = Pedido(mesa)

    # adicionar itens
    for it in itens:
        pid = int(it.get("produto_id"))
        q = int(it.get("quantidade", 1))
        produto = next((p for p in produtos if p.id == pid), None)
        if produto:
            pedido.adicionarItem(produto, q)

    pedidos.append(pedido)

    return jsonify({
        "id": pedido.id,
        "mesa": pedido.mesa.numero,
        "status": pedido.status,
        "itens": [{"produto_id": it.produto.id, "nome": it.produto.nome, "quantidade": it.quantidade} for it in pedido.itens],
        "total": pedido.calcularTotal()
    }), 201

# Listar pedidos
@app.route("/api/pedidos", methods=["GET"])
def listar_pedidos():
    return jsonify([{
        "id": p.id,
        "mesa": p.mesa.numero,
        "status": p.status,
        "itens": [{"produto_id": it.produto.id, "nome": it.produto.nome, "quantidade": it.quantidade} for it in p.itens],
        "total": p.calcularTotal()
    } for p in pedidos])

# Alterar status de um pedido
@app.route("/api/pedidos/<int:pedido_id>/status", methods=["PUT"])
def alterar_status(pedido_id):
    data = request.get_json()
    novo = data.get("status")
    p = next((x for x in pedidos if x.id == pedido_id), None)
    if not p:
        return jsonify({"error": "Pedido não encontrado"}), 404
    p.alterarStatus(novo)
    return jsonify({"id": p.id, "status": p.status})

if __name__ == "__main__":
    app.run(debug=True)
