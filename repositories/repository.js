const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	constructor(filename) {
		if (!filename) throw new Error('File name required.');
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (e) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}

	async writeAll(records) {
		await fs.promises.writeFile(this.filename, [ JSON.stringify(records, null, 2) ]);
	}
	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}
	async delete(id) {
		const records = await this.getAll();
		const filtered = records.filter((record) => record.id !== id);
		await this.writeAll(filtered);
	}
	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		if (!record) throw new Error('Record not found!');
		Object.assign(record, attrs);
		await this.writeAll(records);
	}
	async getOneBy(filters) {
		const records = await this.getAll();
		let found = true;
		for (let record of records) {
			for (let key in filters) {
				record[key] !== filters[key] ? (found = false) : (found = true);
			}
			if (found) {
				return record;
			}
		}
	}
	async create(attrs) {
		attrs.id = this.randomId();
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);
		return attrs;
	}
	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}
};
