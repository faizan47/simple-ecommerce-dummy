const express = require('express');
const router = express.Router();
const CartRepo = require('../repositories/cart');
const ProductRepo = require('../repositories/products');
const cartTemplate = require('../views/cart');
router.post('/cart/products', async (req, res) => {
	// const data = await CartRepo.getAll();
	const productId = req.body.productId;
	// if sesson is not there create one, and if it is there then update
	let cart;
	if (!req.session.cartId) {
		cart = await CartRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		// we have a cart already
		cart = await CartRepo.getOne(req.session.cartId);
	}
	// increase quantity of cart if item is there, else add to cart

	const existingItem = cart.items.find((item) => item.id === productId);
	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.items.push({ id: productId, quantity: 1 });
	}
	// console.log(cart, 'is in Cart');
	await CartRepo.update(cart.id, { items: cart.items });
	res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
	const cartId = req.session.cartId;

	if (!cartId) {
		return res.redirect('/');
	}
	const cart = await CartRepo.getOne(cartId);
	for (let item of cart.items) {
		const product = await ProductRepo.getOne(item.id);
		item.product = product;
	}
	res.send(cartTemplate({ items: cart.items }));
});

router.post('/cart', async (req, res) => {
	const { cartId } = req.session;
	console.log(`${req.body.productIdCart} is productIdCart *& ${cartId} is cart id`);
	const cart = await CartRepo.getOne(cartId);
	const items = cart.items.filter((item) => item.id !== req.body.productIdCart);
	console.log(items);
	await CartRepo.update(cartId, { items });
	res.redirect('/cart');
});
module.exports = router;
