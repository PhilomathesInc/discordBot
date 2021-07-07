String.prototype.format = function() {
	var args = arguments;

	return this.replace(/\{(\d+)\}/g, function() {
		return args[arguments[1]];
	});
};

const memberAddMessage = `Welcome to the server, ${0}
Check out these channels:
#devops - for all things DevOps/SRE
#webdev - for anything web dev/design
#golang - Golang stuff
#programming - for anything that's general programming/competitive coding
#interviews - Discuss regarding interview preparation or any help you might need for a particular interview
#random - Anything and everything under the sun.
#projects - Discuss your project or get ideas for new projects

You can mute the channels you're not interested in, so you can focus on getting the best out of this Discord server.

Important channels:
#announcements - For all the announcements pertaining to the entire group.

Share your GitHub id with the command - !githubID myGitHubID
Share your email address with the command - !emailID email@me.com`;

module.exports = {
	name: 'guildMemberAdd',
	execute(member, logger, client, db) {
		logger.info(`${member.user.tag} joined guild!`);
		// Send the message to a designated channel on a server:
		const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
		// Do nothing if the channel wasn't found on this server
		if (!channel) return;
		channel.send(memberAddMessage.format(member));
		db.run('INSERT INTO users(id) VALUES(?);',member.id, (error) => {
			if (error) {
				channel.send(`Unable to store ${member}'s id in database. Contact the admins.`);
			}
		});
	},
};
