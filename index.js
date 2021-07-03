const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db');


client.once('ready', () => {
	console.log('Ready');
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(ch => ch.name === 'testing1');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	db.run('INSERT INTO users(id) VALUES(?);',member.id, (error) => {
		if (error) {
			channel.send(`Unable to store ${member}'s id in database. Contact the admins.`);
		}
	});
	// Send the message, mentioning the member
	channel.send(`Welcome to the server, ${member}
Top things to do here:
#random - Anything and everything under the sun.
#announcements - Messages regarding group calls
#interviews - Discuss regarding interview preparation or any help you might need for a particular interview
#projects - Discuss your project or get ideas for new projects`);

	const ghIDPrefix = '!githubID';
	const emailIDPrefix = '!emailID';
	const ghIDFilter = m => m.content.includes(ghIDPrefix);
	const emailIDFilter = m => m.content.includes(emailIDPrefix);
	channel.send(`Share your GitHub id with the command - !githubID myGitHubID
Share your email address with the command - !emailID email@me.com`).then(() => {
		channel.awaitMessages(ghIDFilter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				db.run(
					'UPDATE users SET github_id=? WHERE id=?;',
					collected.first().content.slice(ghIDPrefix.length + 1),
					collected.first().author.id
				);
				channel.send(`${member}, your GitHub id was successfully set.`);
			})
			.catch(() => {
				console.log('User didn\'t respond with github id.');
			});
		channel.awaitMessages(emailIDFilter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				db.run(
					'UPDATE users SET email_id=? WHERE id=?;',
					collected.first().content.slice(emailIDPrefix.length + 1),
					collected.first().author.id
				);
				channel.send(`${member}, your email id was successfully set.`);
			})
			.catch(() => {
				console.log('User didn\'t respond with email id.');
			});
	});	
});

client.on('message', message => {
	if (message.content === '!ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
