const asyncDbRun = async (db, query, params) => {
	return new Promise(function(resolve, reject) {
		db.run(query, params, function(err)  {
			if(err) {
				reject('Read error: ' + err.message);
			} else {
				if (this.changes || this.lastID) {
					resolve(true);
				} else {
					reject('SQL statement didn\'t execute successfully.');
				}
			}
		});
	});
};

const asyncDbGet = async (db, query, params) => {
	return new Promise(function(resolve, reject) {
		db.get(query, params, function(err, row)  {
			if(err) {
				reject('Read error: ' + err.message);
			} else {
				if (row !== undefined) {
					resolve(row);
				}
				reject('No results in on SQL statement execution');
			}
		});
	});
};

const ensureUserInDB = async(id, db, logger) => {
	return new Promise(function(resolve, reject) {
		logger.info('Check if user exists in database');
		asyncDbGet(db, 'SELECT * FROM users WHERE id = $id;', {$id: id})
			.then(
				(user) => {
					logger.info('user entry already exists in database');
					return resolve(user);
				},
				() => {
					logger.info('Insert user entry database');
					asyncDbRun(db, 'INSERT INTO users(id) VALUES($id);', {$id: id})
						.then(() => {
							return resolve('successfully inserted user entry');
						})
						.catch(() => {
							return reject('unable to ensure user entry in database');
						});
				}
			);
	});
};

module.exports = {
	asyncDbGet,
	asyncDbRun,
	ensureUserInDB
};
