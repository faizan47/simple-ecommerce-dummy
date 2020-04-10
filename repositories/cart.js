const Repository = require('./repository');

class CartRepo extends Repository {}

module.exports = new CartRepo('cart.json');
