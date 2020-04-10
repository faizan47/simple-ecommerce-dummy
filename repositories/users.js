const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');

class UserRepository extends Repository {
	async create(attrs) {
		const { password } = attrs;
		attrs.id = this.randomId();
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(password, salt, 64);
		const record = {
			...attrs,
			password: `${buf.toString('hex')}.${salt}`
		};
		const records = await this.getAll();
		records.push(record);
		await this.writeAll(records);
		return record;
	}
	async passwordCheck(supplied, saved) {
		// destructuring arrays
		const [ hash, salt ] = saved.split('.');
		const buf = await scrypt(supplied, salt, 64);
		return buf.toString('hex') === hash;
	}
}

module.exports = new UserRepository('users.json');
