const express = require('express');
const router = express.Router();
const ProductsRepository = require('../repositories/products');
const publicProductTemplate = require('../views/products/index');

router.get('/', async (req, res) => {
	const products = await ProductsRepository.getAll();
	res.send(publicProductTemplate({ products }));
});

module.exports = router;
