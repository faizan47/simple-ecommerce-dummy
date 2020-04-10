module.exports = {
	getError(error, prop) {
		try {
			// console.log(error.mapped()[prop].msg);
			return error.mapped()[prop].msg;
		} catch (err) {
			return '';
		}
	}
};
