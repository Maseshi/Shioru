const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.BanMembers,
  ],
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Deal with offending guild members by banning them.")
    .setDescriptionLocalizations({
      th: "จัดการสมาชิกในกิลด์ที่ทำผิดด้วยการแบน",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("add")
        .setDescription("Ban members within the guild.")
        .setDescriptionLocalizations({ th: "แบนสมาชิกภายในกิลด์" })
        .addSubcommand((subcommand) =>
          subcommand
            .setName("user")
            .setDescription("Ban guild members")
            .setDescriptionLocalizations({ th: "แบนสมาชิกในกิลด์" })
            .addUserOption((option) =>
              option
                .setName("member")
                .setDescription("Members you want to ban.")
                .setDescriptionLocalizations({
                  th: "สมาชิกที่คุณต้องการแบน",
                })
                .setRequired(true),
            )
            .addIntegerOption((option) =>
              option
                .setName("days")
                .setDescription(
                  "The amount of days you wish to ban the member for.",
                )
                .setDescriptionLocalizations({
                  th: "จำนวนวันที่คุณต้องการแบนสมาชิก",
                })
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(7),
            )
            .addStringOption((option) =>
              option
                .setName("reason")
                .setDescription("The reason for the ban.")
                .setDescriptionLocalizations({
                  th: "เหตุผลในการแบน",
                })
                .setRequired(false),
            ),
        ),
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("remove")
        .setDescription("Unban banned members on the guild.")
        .setDescriptionLocalizations({
          th: "ปลดแบนสมาชิกที่ถูกแบนในกิลด์",
        })
        .addSubcommand((subcommand) =>
          subcommand
            .setName("all")
            .setDescription("Unban all members")
            .setDescriptionLocalizations({
              th: "ปลดแบนสมาชิกทั้งหมด",
            }),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("user")
            .setDescription("Unban guild members")
            .setDescriptionLocalizations({
              th: "ปลดแบนสมาชิกในกิลด์",
            })
            .addStringOption((option) =>
              option
                .setName("member")
                .setDescription("Members who want to unban.")
                .setDescriptionLocalizations({
                  th: "สมาชิกที่ต้องการปลดแบน",
                })
                .setRequired(true),
            )
            .addStringOption((option) =>
              option
                .setName("reason")
                .setDescription("The reason for the unban.")
                .setDescriptionLocalizations({
                  th: "เหตุผลสำหรับการปลดแบน",
                })
                .setRequired(false),
            ),
        ),
    ),
  async execute(interaction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const inputMember = interaction.options.getMember("member");
    const inputDays = interaction.options.getNumber("days") ?? 0;
    const inputReason =
      interaction.options.getString("reason") ??
      interaction.client.i18n.t("commands.ban.no_reason");

    switch (subcommandGroup) {
      case "add": {
        switch (subcommand) {
          case "user": {
            const member = await interaction.guild.members.fetch(
              inputMember.member.id,
            );
            const banned = await interaction.guild.bans.fetch(
              inputMember.member.id,
            );

            if (!member)
              return await interaction.editReply(
                interaction.client.i18n.t("commands.ban.user_not_found"),
              );
            if (!banned)
              return await interaction.reply(
                interaction.client.i18n.t("commands.ban.member_has_banned"),
              );

            const memberPosition = inputMember.roles.highest.position;
            const authorPosition = interaction.member.roles.highest.position;

            if (authorPosition < memberPosition)
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.ban.members_have_a_higher_role",
                ),
              );
            if (!inputMember.member.bannable)
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.ban.members_have_a_higher_role_than_me",
                ),
              );

            const ban = await interaction.guild.bans.create(member, {
              deleteMessageDays: inputDays,
              reason: inputReason,
            });
            const authorUsername = interaction.user.username;
            const memberAvatar = ban.user.avatarURL();
            const memberUsername = ban.user.username;

            let embedTitle = interaction.client.i18n.t(
              "commands.ban.banned_for_time",
              {
                user: memberUsername,
                days: inputDays,
              },
            );

            if (!inputDays)
              embedTitle = interaction.client.i18n.t(
                "commands.ban.permanently_banned",
                {
                  user: memberUsername,
                },
              );

            const banEmbed = new EmbedBuilder()
              .setTitle(embedTitle)
              .setDescription(
                interaction.client.i18n.t("commands.ban.reason_for_ban", {
                  user: authorUsername,
                  reason: inputReason,
                }),
              )
              .setColor(Colors.Orange)
              .setTimestamp()
              .setThumbnail(memberAvatar);

            await interaction.reply({ embeds: [banEmbed] });
            break;
          }
        }
        break;
      }
      case "remove": {
        switch (subcommand) {
          case "all": {
            const banned = await interaction.guild.bans.fetch();

            if (banned.length <= 0)
              return await interaction.reply(
                interaction.client.i18n.t("commands.ban.no_one_gets_banned"),
              );
            if (interaction.user.id !== interaction.ownerId)
              return await interaction.reply(
                interaction.client.i18n.t("commands.ban.is_only_owner"),
              );

            await interaction.reply(
              interaction.client.i18n.t("commands.ban.unbanning_everyone"),
            );

            const ids = banned.map((user) => user.user.id);

            for (const id in ids) {
              try {
                await interaction.guild.members.unban(id);
              } catch (error) {
                catchError(
                  interaction.client,
                  interaction,
                  module.exports.data.name,
                  error,
                );
              }
            }

            await interaction.editReply(
              interaction.client.i18n.t("commands.ban.unbanned_all", {
                count: ids.length,
              }),
            );
            break;
          }
          case "user": {
            const banned = await interaction.guild.bans.fetch(
              inputMember.member.id,
            );

            if (!banned)
              return await interaction.reply(
                interaction.client.i18n.t("commands.ban.this_user_not_banned"),
              );

            await interaction.guild.bans.remove(banned.member, {
              reason: inputReason,
            });

            const authorUsername = interaction.user.username;
            const memberUsername = banned.member.username;
            const memberAvatar = banned.member.avatarURL();

            const unbanEmbed = new EmbedBuilder()
              .setTitle(
                interaction.client.i18n.t(
                  "commands.ban.user_has_been_unbanned",
                  {
                    user: memberUsername,
                  },
                ),
              )
              .setDescription(
                interaction.client.i18n.t("commands.ban.reason_for_unban", {
                  user: authorUsername,
                  reason: inputReason,
                }),
              )
              .setColor(Colors.Green)
              .setTimestamp()
              .setThumbnail(memberAvatar);

            await interaction.reply({ embeds: [unbanEmbed] });
            break;
          }
        }
        break;
      }
    }
  },
};
