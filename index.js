const fs = require('fs');
const {resolve} = require('path');

const { sync } = require('./lib/github');
const keepAlive = require('./lib/server');

const Discord = require('discord.js');
const pino = require('pino');
const sqlite3 = require('sqlite3').verbose();

const logPath = './discordBot.log';
const logRepoPath = 'discordBot.log';

const owner = 'PhilomathesInc';
const repo = 'octokit-testing';
const branch = 'main';

const dbPath = resolve('./database/data.db');
const dbRepoPath = 'data.db';
const db = new sqlite3.Database(dbPath);

const logger = pino(
	{ level: process.env.LOG_LEVEL || 'info' },
	pino.destination(logPath)
);

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, logger, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, logger, client, db));
	}
}

keepAlive();
// sync(logger, owner, repo, branch, {dbPath, dbRepoPath, logPath, logRepoPath});

client.login(process.env.DISCORD_BOT_TOKEN);
