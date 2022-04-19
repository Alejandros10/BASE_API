const { hooks } = require('@adonisjs/ignitor');

hooks.before.httpServer(() => {
	const Validator = use('Validator');
	const Database = use('Database');

	const existsFn = async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			return;
		}

		const [ table, column ] = args;
		const row = await Database.table(table).where(column, value).first();
		if (!row) {
			throw message;
		}
	};
	const keyFn = async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			return;
		}

		const [ table, colum, vcolum, vvalue ] = args;
		const row = await Database.table(table).where(colum, value).where(vcolum, vvalue).first();
		if (!row) {
			throw message;
		}
	};
	const distinctFn = async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			return;
		}

		const [ table, column, column2, value2 ] = args;
		const row = await Database.table(table).where(column, value).where(column2, value2).first();
		if (row) {
			throw message;
		}
	};
	const hexdacimalFn = async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			return;
		}

		if (value.match(/\b[0-9A-Fa-f]{6}\b/g) === null) {
			throw message;
		}
	};

	const existsSplitFn = async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			return;
		}
		const [ table, column ] = args;
		value.map(async (data) => {
			const row = await Database.table(table).where(column, data).first();
			if (!row) {
				throw message;
			}
			return true;
		});
	};

	Validator.extend('exists', existsFn);
	Validator.extend('keyexists', keyFn);
	Validator.extend('distinct', distinctFn);
	Validator.extend('hexadecimal', hexdacimalFn);
	Validator.extend('existsSplit', existsSplitFn);
});
