from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Produto

app = Flask(__name__)
CORS(app)

produtos = []



@app.route("/api/produtos", methods=["POST"])
def criar_produto():
    data = request.get_json()

    nome = data.get("nome")
    preco = float(data.get("preco"))
    categoria = data.get("categoria")

    produto = Produto(nome, preco, categoria)
    produtos.append(produto)

    return jsonify(produto.to_dict()), 201



@app.route("/api/produtos", methods=["GET"])
def listar_produtos():
    return jsonify([p.to_dict() for p in produtos])



if __name__ == "__main__":
    app.run(debug=True)
