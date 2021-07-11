const {asyncDbRun, ensureUserInDB} = require('../../lib/database');

const addGitHubID = async(message, db, logger, args) => {
	return new Promise(function(resolve, reject) {
		ensureUserInDB(message.author.id, db, logger)
			.then(() => {
				logger.info(`Update user entry: ${message.author.id} with GitHub ID: ${args[0]}`);
				asyncDbRun(db, 'UPDATE users SET github_id=$github_id WHERE id=$id;',{$github_id: args[0],$id: message.author.id})
					.then(() => {
						return resolve('updated github ID for user');
					})
					.catch(() => {
						return reject('unable to update github ID for user');
					});
			})
			.catch(() => {
				return reject('unable to update github ID for user');
			});
		
	});
};

module.exports = {
	name: 'githubid',
	description: 'Add your github ID to the database.',
	usage: '<githubID>',
	cooldown: 5,
	args: true,
	guildOnly: true,
	execute(message, db, logger, args) {
		addGitHubID(message, db, logger, args)
			.then(() => {
				message.reply('your GitHub id was successfully set.');
			});
	},
};
