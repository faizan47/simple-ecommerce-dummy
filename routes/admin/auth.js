const express = require('express');
const router = express.Router();
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { validateEmail, validatePassword, comparePasswords, isEmailUsed, isPasswordOk } = require('./validator');
const UserRepository = require('../../repositories/users');
const { handleErrors } = require('./middleware');

/* Sign in */
router.post('/signin', [ isEmailUsed, isPasswordOk ], handleErrors(signinTemplate), async (req, res) => {
	const { email, password } = req.body;
	const user = await UserRepository.getOneBy({ email });
	const isVerified = await UserRepository.passwordCheck(password, user.password);
	if (isVerified) req.session.userId = user.id;
	res.redirect('/admin/products');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

/* End Sign in */

/* Sign up */
router.post(
	'/signup',
	[ validateEmail, validatePassword, comparePasswords ],
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await UserRepository.create({ email, password });
		req.session.userId = user.id;
		res.redirect('/admin/products');
	}
);

router.get('/signup', (req, res) => res.send(signupTemplate({ req })));

/* End Sign up */

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/signin');
});

module.exports = router;
