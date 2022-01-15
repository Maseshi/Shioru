module.exports.run = async (client, message, args) => {
	const inputMember = args[0];
	let inputDays = args[1];
	let inputReason = args.slice(2).join(" ");

	if (!inputMember) return message.reply(client.translate.commands.ban.empty);
	
	const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
	
	if (!member) return message.reply(client.translate.commands.ban.user_not_found);

	const banned = await message.guild.bans.fetch();
	
	if (banned.length > 0 && banned.map((user => user.user.id === member.user.id))) {
		return message.reply(client.translate.commands.ban.member_has_banned)
	}

	const memberPosition = member.roles.highest.position;
	const authorPosition = message.member.roles.highest.position;
	
	if (authorPosition < memberPosition) return message.reply(client.translate.commands.ban.members_have_a_higher_role);
	if (!member.bannable) return message.reply(client.translate.commands.ban.members_have_a_higher_role_than_me);
	if (!inputDays) inputDays = 0;
	if (!inputReason) inputReason = "";

	const ban = await message.guild.bans.create(member, {
		"days": inputDays,
		"reason": inputReason
	});
	const authorUsername = message.author.username;
	const memberAvatar = ban.user.avatarURL();
	const memberUsername = ban.user.username;
	const time = new Date();

	let embedTitle = client.translate.commands.ban.banned_for_time.replace("%s1", memberUsername).replace("%s2", inputDays);

	if (inputDays === 0) embedTitle = client.translate.commands.ban.permanently_banned.replace("%s", memberUsername);
	if (!inputReason) inputReason = client.translate.commands.ban.no_reason;

	message.channel.send({
		"embeds": [{
			"title": embedTitle,
			"description": client.translate.commands.ban.reason_for_ban.replace("%s1", authorUsername).replace("%s2", inputReason),
			"color": 16098851,
			"timestamp": time,
			"thumbnail": {
				"url": memberAvatar
			}
		}]
	});
};

module.exports.help = {
	"name": "ban",
	"description": "Ban a member",
	"usage": "ban <member: id, username, username&tag> (days) (reason)",
	"category": "guild",
	"aliases": ["b", "แบน"],
	"userPermission": ["BAN_MEMBERS"],
	"clientPermissions": ["SEND_MESSAGES", "BAN_MEMBERS"]
};