module.exports.run = async (client, message, args) => {
	const inputMember = args[0];
	let inputReason = args.slice(1).join(" ");

	if (!inputMember) return message.reply(client.translate.commands.kick.empty);
	
	const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
	
	if (!member) return message.reply(client.translate.commands.kick.can_not_find_user);

	const memberPosition = member.roles.highest.position;
	const authorPosition = message.member.roles.highest.position;
	
	if (authorPosition < memberPosition) return message.reply(client.translate.commands.kick.members_have_a_higher_role);
	if (!member.kickable) return message.reply(client.translate.commands.kick.members_have_a_higher_role_than_me);
	if (!inputReason) inputReason = "";

	const kicked = await member.kick({
		"reason": inputReason
	});
	const authorUsername = message.author.username;
	const memberAvatar = kicked.user.avatarURL();
	const memberUsername = kicked.user.username;
	const time = new Date();

	if (!inputReason) inputReason = client.translate.commands.kick.no_reason;

	message.channel.send({
		"embeds": [{
			"title": client.translate.commands.kick.kicked_out.replace("%s", memberUsername),
			"description": client.translate.commands.kick.reason_for_kick.replace("%s1", authorUsername).replace("%s2", inputReason),
			"color": 16098851,
			"timestamp": time,
			"thumbnail": {
				"url": memberAvatar
			}
		}]
	});
};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "kick <member: id, username, username&tag> (reason)",
	"category": "guild",
	"aliases": ["k", "เตะ"],
	"userPermission": ["KICK_MEMBERS"],
	"clientPermissions": ["SEND_MESSAGES", "KICK_MEMBERS"]
};