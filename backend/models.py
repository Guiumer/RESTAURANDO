# backend/models.py

from typing import List

# -----------------------
# Modelo de domínio (POO)
# -----------------------

class Produto:
    _next_id = 1

    def __init__(self, nome: str, preco: float, categoria: str):
        self.id = Produto._next_id
        Produto._next_id += 1
        self.nome = nome
        self.preco = preco
        self.categoria = categoria

    def getInfo(self) -> str:
        return f"{self.nome} (R$ {self.preco:.2f})"


class ItemPedido:
    def __init__(self, produto: Produto, quantidade: int):
        self.quantidade = quantidade
        self.produto = produto

    def calcularSubtotal(self) -> float:
        return self.quantidade * self.produto.preco


class Mesa:
    def __init__(self, numero: int):
        self.numero = numero
        self.aberta = False

    def abrirMesa(self) -> None:
        self.aberta = True

    def fecharMesa(self) -> None:
        self.aberta = False


class Pedido:
    _next_id = 100

    def __init__(self, mesa: Mesa):
        self.id = Pedido._next_id
        Pedido._next_id += 1
        self.mesa = mesa
        self.itens: List[ItemPedido] = []
        self.status = "pendente"

    def adicionarItem(self, produto: Produto, qnt: int) -> None:
        # se já existe item do mesmo produto, incrementa
        for it in self.itens:
            if it.produto.id == produto.id:
                it.quantidade += qnt
                return
        self.itens.append(ItemPedido(produto, qnt))

    def calcularTotal(self) -> float:
        return sum(it.calcularSubtotal() for it in self.itens)

    def alterarStatus(self, novo: str) -> None:
        self.status = novo


# -----------------------
# Usuario, Garcom, Cozinheiro (POO / polimorfismo)
# -----------------------

class Usuario:
    def __init__(self, id: int, nome: str):
        self.id = id
        self.nome = nome

    def registrarAcao(self, descricao: str) -> str:
        return f"{self.nome}: {descricao}"


class Garcom(Usuario):
    def registrarAcao(self, descricao: str) -> str:
        return f"Garçom {self.nome} registrou: {descricao}"

    def abrirPedido(self, mesa: Mesa) -> Pedido:
        p = Pedido(mesa)
        return p


class Cozinheiro(Usuario):
    def registrarAcao(self, descricao: str) -> str:
        return f"Cozinheiro {self.nome} registrou: {descricao}"

    def atualizarPedido(self, pedido: Pedido, status: str) -> None:
        pedido.alterarStatus(status)
