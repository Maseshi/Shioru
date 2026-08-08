const {
  Events,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas");
const {
  submitNotification,
  initializeData,
  updateGuildMemberCount,
} = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");
const { getGuildData } = require("../utils/cacheUtils");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    // Init Data & Notification
    const memberFetch = await member.user.fetch();
    const memberColor = memberFetch.accentColor;
    const memberTag = member.user.tag;
    const memberAvatar = member.user.displayAvatarURL();
    const guildMemberAddEmbed = new EmbedBuilder()
      .setTitle(memberTag)
      .setDescription(member.client.i18n.t("events.guildMemberAdd.greet"))
      .setTimestamp()
      .setColor(memberColor)
      .setThumbnail(memberAvatar)
      .setAuthor({
        icon_url:
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png",
        name: member.client.i18n.t("events.guildMemberAdd.welcome"),
      });

    const guildData =
      getGuildData(member.client, member.guild.id) ??
      (await initializeData(member.client, member.guild));
    void updateGuildMemberCount(member.guild).catch((error) =>
      member.client.logger.error(
        { err: error, guildId: member.guild.id },
        "Failed to update guild member count.",
      ),
    );
    await submitNotification(
      member.client,
      member.guild,
      Events.GuildMemberAdd,
      guildMemberAddEmbed,
    );

    // Anti-Bot
    if (member.user.bot) {
      if (guildData) {
        const antiBotData = guildData.antibot;

        if (!antiBotData) return;
        if (!antiBotData.enable) return;
        if (!antiBotData.all && antiBotData.bots.includes(member.user.id))
          return;

        member.kick({
          reason:
            "Was prevented from joining the guild by the anti-bot system.",
        });
      }
    }

    // Captcha
    if (guildData) {
      const captchaData = guildData.captcha;

      if (!captchaData) return;
      if (!captchaData.enable) return;

      const captchaGenerator = new CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({ text: captchaData.text, size: 60, color: "green" })
        .setDecoy({ opacity: 0.5 })
        .setTrace({ color: "green" });
      const buffer = captchaGenerator.generateSync();

      const captchaAttachment = new AttachmentBuilder(buffer, {
        name: "captcha.png",
      });

      const captchaEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setImage("attachment://captcha.png")
        .setTitle(
          member.client.i18n
            .t("events.guildMemberAdd.solve_the_captcha")
            .replace("%s", member.guild.name),
        )
        .setDescription(
          member.client.i18n.t("events.guildMemberAdd.use_button_below"),
        );
      const captchaButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("captcha-button")
          .setLabel("Answer")
          .setStyle(ButtonStyle.Primary),
      );
      const captchaModal = new ModalBuilder()
        .setTitle(
          member.client.i18n.t("events.guildMemberAdd.submit_answer_captcha"),
        )
        .setCustomId("captcha-modal");
      const captchaTextInput = new TextInputBuilder()
        .setCustomId("captcha-text-input")
        .setRequired(true)
        .setLabel(member.client.i18n.t("events.guildMemberAdd.your_answer"))
        .setPlaceholder(
          member.client.i18n.t("events.guildMemberAdd.submit_you_answer_guide"),
        )
        .setStyle(TextInputStyle.Short);

      const captchaFirst = new ActionRowBuilder().addComponents(
        captchaTextInput,
      );

      captchaModal.addComponents(captchaFirst);

      try {
        const guild = member.guild;
        const message = await member.send({
          embeds: [captchaEmbed],
          files: [captchaAttachment],
          components: [captchaButton],
        });
        const collector = message.createMessageComponentCollector({
          filter: (component) =>
            component.customId === "captcha-button" &&
            component.user.id === member.id,
          max: 1,
          time: 300000,
        });

        collector.on("collect", async (component) => {
          await component.showModal(captchaModal);
          const interaction = await component
            .awaitModalSubmit({
              filter: (modal) =>
                modal.customId === "captcha-modal" &&
                modal.user.id === member.id,
              time: 300000,
            })
            .catch(() => null);
          if (!interaction) return;

          const guildCaptchaData = getGuildData(
            member.client,
            member.guild.id,
          )?.captcha;

          if (!guildCaptchaData) return;

          const captchaAnswer =
            interaction.fields.getTextInputValue("captcha-text-input");

          if (captchaAnswer !== guildCaptchaData.text)
            return interaction.reply({
              content: member.client.i18n.t(
                "events.guildMemberAdd.wrong_answer",
              ),
              ephemeral: true,
            });

          try {
            const captchaRole = guildCaptchaData.role;
            const captchaGuild = await member.client.guilds.fetch(guild.id);
            const captchaUser = await captchaGuild.members.fetch(
              interaction.user.id,
            );
            const role = captchaGuild.roles.cache.get(captchaRole);

            await captchaUser.roles.add(role);
            await interaction.reply({
              content: member.client.i18n
                .t("events.guildMemberAdd.captcha_success")
                .replace("%s", captchaGuild.name),
              ephemeral: true,
            });
          } catch (error) {
            catchError(
              interaction.client,
              interaction,
              "guildMemberAdd",
              error,
              true,
            );
            await interaction.reply({
              content: member.client.i18n.t(
                "events.guildMemberAdd.captcha_error",
              ),
              ephemeral: true,
            });
          }
        });
      } catch (error) {
        catchError(member.client, member, "captcha", error, true);
      }
    }
  },
};
