const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();


client.on('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (message.content === prefix + 'ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
	else if (message.content === prefix + 'beep') {
		message.channel.send('Boop.');
	}
	else if (message.content === prefix + 'serverinfo') {
		message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount + '\nDate created:' + message.guild.createdAt + '\nRegion:' + message.guild.region);
	}
	else if (message.content === prefix + 'userinfo') {
		message.channel.send('Your username:' + message.author.username + '\nYour ID:' + message.author.id + '\nAvatar:' + message.author.avatarURL);
	}
	else if (command === 'info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	}
	else if (command === 'kick') {
		// grab the "first" mentioned user from the message
		// this will return a `User` object, just like `message.author`
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	}
	else if (command === 'avatar') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL}`;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
	}
	else if (command === 'prune') {
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}
		else if (amount <= 1 || amount > 100) {
			return message.reply('you need to input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('there was an error trying to prune messages in this channel!');
		});
	}
});

client.on('guildDelete', guild => {
	console.log(`I have left ${guild.name} at ${new Date()}`);
});

client.on('guildCreate', guild => {
	// Send message at the default channel, somehow doesn't work rip
	client.channels.get('369872628913274883').send(`I have joined ${guild.name} at ${new Date()}`);
});
client.on('guildMemberAdd', member => {
	let guild = member.guild;
	// client.emit("guildMemberAdd", message.member), will test this in the future, for the below btw
	client.channels.get('369872628913274883').send(`Please welcome ${member.user} to the server!`);
});
client.on('guildMemberRemove', member => {
	let guild = member.guild;
	client.channels.get('369872628913274883').send(`${member.username} just left the server. Goodbye...`);
});
client.on('guildBanAdd', (guild, user) => {
	client.channel.get('369872628913274883').send(`${user.username} was banned!`);
});
client.on('guildBanRemove', (guild, user) => {
	client.channel.get('369872628913274883').send(`${user.username} was unbanned!`);
});
client.login(token);
