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
const { getDatabase, ref, child, get } = require("firebase/database");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");

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

    await initializeData(member.client, member.guild);
    await submitNotification(
      member.client,
      member.guild,
      Events.GuildMemberAdd,
      guildMemberAddEmbed,
    );

    const guildRef = child(ref(getDatabase(), "guilds"), member.guild.id);
    const guildSnapshot = await get(guildRef);

    // Anti-Bot
    if (member.user.bot) {
      if (guildSnapshot.exists()) {
        const antiBotData = guildSnapshot.val().antibot;

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
    if (guildSnapshot.exists()) {
      const captchaData = guildSnapshot.val().captcha;

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
        const collector = message.createMessageComponentCollector();

        collector.on("collect", async (component) => {
          if (component.customId === "captcha-button")
            component.showModal(captchaModal);
        });

        member.client.on(Events.InteractionCreate, async (interaction) => {
          if (!interaction.isModalSubmit()) return;
          if (!interaction.customId === "captcha-modal") return;

          const guildRef = child(ref(getDatabase(), "guilds"), member.guild.id);
          const guildSnapshot = await get(guildRef);

          if (!guildSnapshot.exists()) return;

          const captchaData = guildSnapshot.val().captcha;

          const captchaAnswer =
            interaction.fields.getTextInputValue("captcha-text-input");

          if (captchaAnswer !== captchaData.text) {
            return await interaction.reply({
              content: member.client.i18n.t(
                "events.guildMemberAdd.wrong_answer",
              ),
              ephemeral: true,
            });
          } else {
            try {
              const captchaRole = captchaData.role;
              const captchaGuild = await member.client.guilds.fetch(guild.id);
              const captchaUser = await captchaGuild.members.fetch(
                interaction.user.id,
              );
              const role = await captchaGuild.roles.cache.get(captchaRole);

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
          }
        });
      } catch (error) {
        catchError(member.client, member, "captcha", error, true);
      }
    }
  },
};
