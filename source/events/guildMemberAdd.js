const {
    Events,
    EmbedBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const { CaptchaGenerator } = require("captcha-canvas")
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");

module.exports = {
    "name": Events.GuildMemberAdd,
    "once": false,
    async execute(member) {
        if (member.user.bot) return;
        if (member.client.mode === "start") {
            settingsData(member.client, member.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), member.guild.id);
        const channelRef = child(guildRef, "notification/guildMemberAdd");
        const channelSnapshot = member.client.api.guilds[member.guild.id].notification.guildMemberAdd;
        const captchaSnapshot = member.client.api.guilds[member.guild.id].captcha;

        if (typeof channelSnapshot === "boolean") {
            const notification = member.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const memberFetch = await member.user.fetch();
            const memberColor = memberFetch.accentColor;
            const memberTag = member.user.tag;
            const memberAvatar = member.user.displayAvatarURL();
            const guildMemberAddEmbed = new EmbedBuilder()
                .setTitle(memberTag)
                .setDescription(member.client.translate.events.guildMemberAdd.greet)
                .setTimestamp()
                .setColor(memberColor)
                .setThumbnail(memberAvatar)
                .setAuthor({ "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png", "name": member.client.translate.events.guildMemberAdd.welcome });

            if (notification) notification.send({ "embeds": [guildMemberAddEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(member));
        }
        if (captchaSnapshot && captchaSnapshot.enable) {
            const textSnapshot = captchaSnapshot.text;

            const captcha = new CaptchaGenerator()
                .setDimension(150, 450)
                .setCaptcha({ "text": textSnapshot, "size": 60, "color": "green" })
                .setDecoy({ "opacity": 0.5 })
                .setTrace({ "color": "green" });
            const buffer = captcha.generateSync();

            const captchaAttachment = new AttachmentBuilder(buffer, { "name": "captcha.png" });

            const captchaEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setImage("attachment://captcha.png")
                .setTitle(member.client.translate.events.guildMemberAdd.solve_the_captcha.replace("%s", member.guild.name))
                .setDescription(member.client.translate.events.guildMemberAdd.use_button_below);
            const captchaButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("captcha-button")
                        .setLabel("Answer")
                        .setStyle(ButtonStyle.Primary)
                );
            const captchaModal = new ModalBuilder()
                .setTitle(member.client.translate.events.guildMemberAdd.submit_answer_captcha)
                .setCustomId("captcha-modal");
            const captchaTextInput = new TextInputBuilder()
                .setCustomId("captcha-text-input")
                .setRequired(true)
                .setLabel(member.client.translate.events.guildMemberAdd.your_answer)
                .setPlaceholder(member.client.translate.events.guildMemberAdd.submit_you_answer_guide)
                .setStyle(TextInputStyle.Short);

            const captchaFirst = new ActionRowBuilder().addComponents(captchaTextInput);

            captchaModal.addComponents(captchaFirst);

            try {
                const guild = member.guild;
                const message = await member.send({ "embeds": [captchaEmbed], "files": [captchaAttachment], "components": [captchaButton] });
                const collector = message.createMessageComponentCollector();

                collector.on("collect", async (component) => {
                    if (component.customId === "captcha-button") component.showModal(captchaModal);
                });

                member.client.on(Events.InteractionCreate, async (interaction) => {
                    if (!interaction.isModalSubmit()) return;
                    if (!interaction.customId === "captcha-modal") return;

                    const captchaSnapshot = member.client.api.guilds[guild.id].captcha;
                    const captchaAnswer = interaction.fields.getTextInputValue("captcha-text-input");

                    if (captchaAnswer !== captchaSnapshot.text) {
                        return await interaction.reply({ "content": member.client.translate.events.guildMemberAdd.wrong_answer, "ephemeral": true });
                    } else {
                        try {
                            const captchaRole = captchaSnapshot.role;
                            const captchaGuild = await member.client.guilds.fetch(guild.id);
                            const captchaUser = await captchaGuild.members.fetch(interaction.user.id);
                            const role = await captchaGuild.roles.cache.get(captchaRole);

                            await captchaUser.roles.add(role);
                            await interaction.reply({ "content": member.client.translate.events.guildMemberAdd.captcha_success.replace("%s", captchaGuild.name), "ephemeral": true })
                        } catch (error) {
                            catchError(interaction.client, interaction, "guildMemberAdd", error, true)
                            await interaction.reply({ "content": member.client.translate.events.guildMemberAdd.captcha_error, "ephemeral": true });
                        }
                    }
                });
            } catch (error) {
                catchError(member.client, member, "guildMemberAdd", error, true)
            }
        }
    }
};