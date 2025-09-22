const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../rest/app');

const checkoutService = require('../../../src/services/checkoutService');

describe('Checkout Controller', () => {
  describe('POST /api/checkout', () => {
    let token;

    beforeEach(async () => {
      const respostaLogin = await request(app)
        .post('/api/users/login')
        .send({
          email: 'alice@email.com',
          password: '123456'
        });

      token = respostaLogin.body.token;
    });

    it('Quando o service lança erro recebo 400', async () => {
      sinon.stub(checkoutService, 'checkout')
        .throws(new Error('Erro no processamento do checkout'));

      const resposta = await request(app)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: 1, quantity: 2 }],
          freight: 20,
          paymentMethod: 'credit_card',
          cardData: { number: '1234123412341234', cvv: '123', expiry: '12/26' }
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Erro no processamento do checkout');
    });

    afterEach(() => {
      sinon.restore();
    });
  });
});
