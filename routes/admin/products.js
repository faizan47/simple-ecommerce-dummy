const express = require('express');
const multer = require('multer');
const { handleErrors, isLoggedIn } = require('./middleware');
const { validateTitle, validatePrice } = require('./validator');
const productsLoop = require('../../views/admin/products/index');
const newProductTemplate = require('../../views/admin/products/new');
const editProductTemplate = require('../../views/admin/products/edit');
const ProductsRepository = require('../../repositories/products');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', isLoggedIn, async (req, res) => {
	const products = await ProductsRepository.getAll();
	res.send(productsLoop({ products }));
});

router.get('/admin/products/new', isLoggedIn, (req, res) => {
	res.send(newProductTemplate({}));
});

router.post(
	'/admin/products/new',
	isLoggedIn,
	upload.single('productImage'),
	[ validateTitle, validatePrice ],
	handleErrors(newProductTemplate),
	async (req, res) => {
		const { title, price } = req.body;
		const image = req.file.buffer.toString('base64');
		await ProductsRepository.create({ title, price, image });
		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', isLoggedIn, async (req, res) => {
	// res.send(req.params.id);
	const product = await ProductsRepository.getOne(req.params.id);
	if (!product) {
		return res.send('Product not found!');
	}

	res.send(editProductTemplate({ product }));
});

router.post(
	'/admin/products/:id/edit',
	isLoggedIn,
	upload.single('productImage'),
	[ validateTitle, validatePrice ],
	handleErrors(editProductTemplate, async (req) => {
		console.log(req.params.id, 'ID should be here');
		const product = await ProductsRepository.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;

		if (req.file) {
			changes.image = req.file.buffer.toString('base64');
		}
		try {
			// console.log(changes);
			await ProductsRepository.update(req.params.id, changes);
		} catch (error) {
			return res.send(`Product not found. Error message ${error}`);
		}
		res.redirect(`/admin/products/`);
	}
);

router.post('/admin/products/:id/delete', isLoggedIn, async (req, res) => {
	try {
		await ProductsRepository.delete(req.params.id);
	} catch (error) {
		return res.send('There was an error deleting the product. Error details: ' + req.params.id);
	}
	res.redirect(`/admin/products/`);
});

module.exports = router;
