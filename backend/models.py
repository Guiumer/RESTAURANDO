class Produto:
    _id_seq = 1  # auto incremento

    def __init__(self, nome: str, preco: float, categoria: str):
        self.id = Produto._id_seq
        Produto._id_seq += 1
        self.nome = nome
        self.preco = preco
        self.categoria = categoria

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "preco": self.preco,
            "categoria": self.categoria
        }
