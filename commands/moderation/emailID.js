const {asyncDbRun, ensureUserInDB} = require('../../lib/database');

const addEmailID = async(message, db, logger, args) => {
	return new Promise(function(resolve, reject) {
		ensureUserInDB(message.author.id, db, logger, args)
			.then(() => {
				logger.info(`Update user entry: ${message.author.id} with Email ID: ${args[0]}`);
				asyncDbRun(db, 'UPDATE users SET email_id=$email_id WHERE id=$id;',{$email_id: args[0],$id: message.author.id})
					.then(() => {
						return resolve('updated email ID for user');
					})
					.catch(() => {
						return reject('unable to update email ID for user');
					});
			})
			.catch(() => {
				return reject('unable to update email ID for user');
			});
		
	});
};

module.exports = {
	name: 'emailid',
	description: 'Add your Email ID to the database.',
	usage: '<emailid>',
	cooldown: 5,
	args: true,
	guildOnly: true,
	execute(message, db, logger, args) {
		addEmailID(message, db, logger, args)
			.then(() => {
				message.reply('your Email id was successfully set.');
			});
	},
};
