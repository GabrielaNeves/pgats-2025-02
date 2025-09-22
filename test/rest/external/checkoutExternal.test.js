const request = require("supertest");
const { expect, use } = require("chai");

const chaiExclude = require("chai-exclude");
use(chaiExclude);

require("dotenv").config();

// Testes
describe("Checkout", () => {
  describe("POST /api/checkout", () => {
    let token;

    beforeEach(async () => {
      const respostaLogin = await request(process.env.BASE_URL_REST)
        .post("/api/users/login")
        .send({
          email: "alice@email.com",
          password: "123456",
        });

      token = respostaLogin.body.token;
    });

    it("Quando não envio token recebo 401", async () => {
      const resposta = await request(process.env.BASE_URL_REST)
        .post("/api/checkout")
        .send({
          items: [{ productId: 1, quantity: 2 }],
          freight: 20,
          paymentMethod: "boleto",
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.have.property("error", "Token inválido");
    });

    it("Quando envio dados válidos tenho sucesso com 200", async () => {
      const resposta = await request(process.env.BASE_URL_REST)
        .post("/api/checkout")
        .set("Authorization", `Bearer ${token}`)
        .send({
          items: [{ productId: 1, quantity: 2 }],
          freight: 20,
          paymentMethod: "boleto",
        });

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.have.property("valorFinal", 220);
      expect(resposta.body).to.have.property("freight", 20);
    });
  });
});
