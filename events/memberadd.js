const {ensureUserInDB} = require('../lib/database');

module.exports = {
	name: 'guildMemberAdd',
	execute(member, logger, client, db) {
		logger.info(`${member.user.tag} joined guild!`);
		// Send the message to a designated channel on a server:
		const findChannel = (member, channel) => member.guild.channels.cache.find(ch => ch.name === channel);
		const welcomeChannel = findChannel(member, 'welcome');
		const channels = {};
		channels[findChannel(member, 'devops')] = 'for all things DevOps/SRE';
		channels[findChannel(member, 'webdev')] = 'for anything web dev/design';
		channels[findChannel(member, 'golang')] = 'Golang stuff';
		channels[findChannel(member, 'programming')] = 'for anything that\'s general programming/competitive coding';
		channels[findChannel(member, 'interviews')] = 'Discuss regarding interview preparation or any help you might need for a particular interview';
		channels[findChannel(member, 'random')] = 'Anything and everything under the sun.';
		channels[findChannel(member, 'projects')] = 'Discuss your project or get ideas for new projects';
		const memberAddMessage = `Welcome to the server, ${member}
Check out these channels:
${Object.entries(channels).map(([key, value]) => {
		return key + ' - ' + value + '\n';
	}).join('')}
You can mute the channels you're not interested in, so you can focus on getting the best out of this Discord server.

Important channels:
${findChannel(member, 'announcements')} - For all the announcements pertaining to the entire group.

Share your GitHub id with the command - !githubID myGitHubID
Share your email address with the command - !emailID email@me.com`;

		// Do nothing if the channel wasn't found on this server
		if (!welcomeChannel) return;
		welcomeChannel.send(memberAddMessage);
		ensureUserInDB(member.id, db, logger)
			.then(() => {
				welcomeChannel.send(`${member}'s id stored in the database successfully.`);
			})
			.catch((error) => {
				logger.error(error);
				welcomeChannel.send(`Unable to store ${member}'s id in database. Contact the admins.`);
			});
	},
};
