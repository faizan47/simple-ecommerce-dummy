const userRepo = require('../../repositories/users');
const { check } = require('express-validator');

module.exports = {
	validateTitle: check('title')
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Title must be minimum 6 and maximum 20 characters.'),
	validatePrice: check('price').trim().toFloat().isFloat({ min: 1 }).withMessage('Price must be minimum 1.'),
	// validatePrice: check('price').trim(),
	validateEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email.')
		.custom(async (email) => {
			const existingUser = await userRepo.getOneBy({ email });
			if (existingUser) throw new Error('Email is already in use. Please try another email.');
		}),
	validatePassword: check('password')
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Password must be minimum 6 and maximum 20 characters.'),
	comparePasswords: check('passwordConfirmation')
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Password must be minimum 6 and maximum 20 characters.')
		.custom(async (passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
		}),
	isEmailUsed: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const user = await userRepo.getOneBy({ email });
			if (!user) throw new Error('Email not found!');
		}),
	isPasswordOk: check('password').trim().custom(async (password, { req }) => {
		const email = req.body.email;
		const user = await userRepo.getOneBy({ email });
		if (!user) throw new Error('Invalid password.');
		const isVerified = await userRepo.passwordCheck(password, user.password);
		if (!isVerified) throw new Error('Invalid password.');
	})
};
