module.exports = {
	name: 'ready',
	once: true,
	execute(logger, client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);
	},
};
