const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
} = require("discord.js");
const {
  getDatabase,
  ref,
  child,
  get,
  update,
  remove,
} = require("firebase/database");
const { embedBuilder } = require("../../utils/clientUtils");
const { dataStructures } = require("../../utils/databaseUtils");
const { newLines } = require("../../utils/miscUtils");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription("Set up the notifications you want.")
    .setDescriptionLocalizations({ th: "ตั้งค่าการแจ้งเตือนที่คุณต้องการ" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("See a list of currently supported notifications.")
        .setDescriptionLocalizations({
          th: "ดูรายการแจ้งเตือนที่รองรับในขณะนี้",
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable notifications based on desired events.")
        .setDescriptionLocalizations({
          th: "เปิดใช้งานการแจ้งเตือนตามเหตุการณ์ที่ต้องการ",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of notifications you want to enable.")
            .setDescriptionLocalizations({
              th: "ประเภทของการแจ้งเตือนที่คุณต้องการสำรวจข้อมูล",
            })
            .setRequired(true),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel that you want to be notified about.")
            .setDescriptionLocalizations({
              th: "ช่องที่ต้องการจะให้แจ้งเตือน.",
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Temporarily turn off specific notifications.")
        .setDescriptionLocalizations({
          th: "ปิดการแจ้งเตือนที่ต้องการชั่วคราว",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription(
              "The type of notifications you want to temporarily turn off",
            )
            .setDescriptionLocalizations({
              th: "ประเภทของการแจ้งเตือนที่ต้องการปิดชั่วคราว",
            })
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("See the configuration of notifications on this guild.")
        .setDescriptionLocalizations({
          th: "ดูการกำหนดค่าของการแจ้งเตือนบนกิลด์นี้",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of notification you want to explore.")
            .setDescriptionLocalizations({
              th: "ประเภทของการแจ้งเตือนที่คุณต้องการสำรวจข้อมูล",
            }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("The type of notification you want to set.")
        .setDescriptionLocalizations({
          th: "ประเภทของการแจ้งเตือนที่คุณต้องการตั้งค่า",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of notification you want to set.")
            .setDescriptionLocalizations({
              th: "ประเภทของการแจ้งเตือนที่คุณต้องการตั้งค่า",
            })
            .setRequired(true),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel that you want to be notified about.")
            .setDescriptionLocalizations({
              th: "ช่องที่ต้องการจะให้แจ้งเตือน.",
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option
            .setName("enable")
            .setDescription("Want to activate it immediately after setup?")
            .setDescriptionLocalizations({
              th: "ต้องการที่จะเปิดใช้งานทันทีหลังจากตั้งค่าหรือไม่",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("Content or message of the notification")
            .setDescriptionLocalizations({
              th: "เนื้อหาหรือข้อความของการแจ้งเตือน",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_name")
            .setDescription("The name of the author of the embedded text.")
            .setDescriptionLocalizations({
              th: "ชื่อของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_icon_url")
            .setDescription("Author icon in embedded text")
            .setDescriptionLocalizations({
              th: "ไอคอนของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_url")
            .setDescription("Author links in embedded text")
            .setDescriptionLocalizations({
              th: "ลิงค์ของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_color")
            .setDescription("Embedded text border color")
            .setDescriptionLocalizations({ th: "สีของขอบข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_title")
            .setDescription("Topic of embedded message")
            .setDescriptionLocalizations({ th: "หัวข้อของข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_url")
            .setDescription(
              "The link to be attached to the topic of the embedded message.",
            )
            .setDescriptionLocalizations({
              th: "ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_description")
            .setDescription("Description in embedded text")
            .setDescriptionLocalizations({ th: "คำอธิบายในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_thumbnail")
            .setDescription(
              "Link to thumbnail in upper right corner in embedded text",
            )
            .setDescriptionLocalizations({
              th: "ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_first_field_name")
            .setDescription("The name of the field in the embedded text.")
            .setDescriptionLocalizations({ th: "ชื่อของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_first_field_value")
            .setDescription("Field values in embedded text")
            .setDescriptionLocalizations({ th: "ค่าของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addBooleanOption((option) =>
          option
            .setName("embed_first_field_inline")
            .setDescription(
              "Organized as a single line in a field of embedded text.",
            )
            .setDescriptionLocalizations({
              th: "จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_second_field_name")
            .setDescription("The name of the field in the embedded text.")
            .setDescriptionLocalizations({ th: "ชื่อของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_second_field_value")
            .setDescription("Field values in embedded text")
            .setDescriptionLocalizations({ th: "ค่าของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addBooleanOption((option) =>
          option
            .setName("embed_second_field_inline")
            .setDescription(
              "Organized as a single line in a field of embedded text.",
            )
            .setDescriptionLocalizations({
              th: "จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_image")
            .setDescription("Links to accompanying images in embedded text")
            .setDescriptionLocalizations({
              th: "ลิงค์รูปภาพประกอบในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_timestamp")
            .setDescription(
              'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"',
            )
            .setDescriptionLocalizations({
              th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_footer_text")
            .setDescription("Embedded footer text")
            .setDescriptionLocalizations({
              th: "ข้อความส่วนท้ายของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_footer_icon_url")
            .setDescription("Icon link in footer of embedded message")
            .setDescriptionLocalizations({
              th: "ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง",
            }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription(
          "Edit notification information for events that have been set.",
        )
        .setDescriptionLocalizations({
          th: "แก้ไขข้อมูลของการแจ้งเตือนในเหตุการณ์ที่ได้ตั้งค่าไว้",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription(
              "The type of event for which data needs to be edited.",
            )
            .setDescriptionLocalizations({
              th: "ประเภทของเหตุการณ์ที่ต้องการจะแก้ไขข้อมูล",
            })
            .setRequired(true),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel that you want to be notified about.")
            .setDescriptionLocalizations({
              th: "ช่องที่ต้องการจะให้แจ้งเตือน.",
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option
            .setName("enable")
            .setDescription("Want to activate it immediately after setup?")
            .setDescriptionLocalizations({
              th: "ต้องการที่จะเปิดใช้งานทันทีหลังจากตั้งค่าหรือไม่",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("Content or message of the notification")
            .setDescriptionLocalizations({
              th: "เนื้อหาหรือข้อความของการแจ้งเตือน",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_name")
            .setDescription("The name of the author of the embedded text.")
            .setDescriptionLocalizations({
              th: "ชื่อของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_icon_url")
            .setDescription("Author icon in embedded text")
            .setDescriptionLocalizations({
              th: "ไอคอนของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_author_url")
            .setDescription("Author links in embedded text")
            .setDescriptionLocalizations({
              th: "ลิงค์ของผู้เขียนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_color")
            .setDescription("Embedded text border color")
            .setDescriptionLocalizations({ th: "สีของขอบข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_title")
            .setDescription("Topic of embedded message")
            .setDescriptionLocalizations({ th: "หัวข้อของข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_url")
            .setDescription(
              "The link to be attached to the topic of the embedded message.",
            )
            .setDescriptionLocalizations({
              th: "ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_description")
            .setDescription("Description in embedded text")
            .setDescriptionLocalizations({ th: "คำอธิบายในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_thumbnail")
            .setDescription(
              "Link to thumbnail in upper right corner in embedded text",
            )
            .setDescriptionLocalizations({
              th: "ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_first_field_name")
            .setDescription("The name of the field in the embedded text.")
            .setDescriptionLocalizations({ th: "ชื่อของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_first_field_value")
            .setDescription("Field values in embedded text")
            .setDescriptionLocalizations({ th: "ค่าของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addBooleanOption((option) =>
          option
            .setName("embed_first_field_inline")
            .setDescription(
              "Organized as a single line in a field of embedded text.",
            )
            .setDescriptionLocalizations({
              th: "จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_second_field_name")
            .setDescription("The name of the field in the embedded text.")
            .setDescriptionLocalizations({ th: "ชื่อของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_second_field_value")
            .setDescription("Field values in embedded text")
            .setDescriptionLocalizations({ th: "ค่าของฟิลด์ในข้อความแบบฝัง" }),
        )
        .addBooleanOption((option) =>
          option
            .setName("embed_second_field_inline")
            .setDescription(
              "Organized as a single line in a field of embedded text.",
            )
            .setDescriptionLocalizations({
              th: "จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_image")
            .setDescription("Links to accompanying images in embedded text")
            .setDescriptionLocalizations({
              th: "ลิงค์รูปภาพประกอบในข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_timestamp")
            .setDescription(
              'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"',
            )
            .setDescriptionLocalizations({
              th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_footer_text")
            .setDescription("Embedded footer text")
            .setDescriptionLocalizations({
              th: "ข้อความส่วนท้ายของข้อความแบบฝัง",
            }),
        )
        .addStringOption((option) =>
          option
            .setName("embed_footer_icon_url")
            .setDescription("Icon link in footer of embedded message")
            .setDescriptionLocalizations({
              th: "ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง",
            }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("The type of notification you want to remove.")
        .setDescriptionLocalizations({
          th: "ประเภทของการแจ้งเตือนที่คุณต้องการลบ",
        })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of notification you want to remove.")
            .setDescriptionLocalizations({
              th: "ประเภทของการแจ้งเตือนที่คุณต้องการลบ",
            })
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputType = interaction.options.getString("type");
    const inputChannel = interaction.options.getChannel("channel") ?? null;
    const inputEnable = interaction.options.getBoolean("enable") ?? false;
    const inputContent = interaction.options.getString("content") ?? "";
    const inputAuthorName =
      interaction.options.getString("embed_author_name") ?? "";
    const inputAuthorURL =
      interaction.options.getString("embed_author_url") ?? "";
    const inputAuthorIconURL =
      interaction.options.getString("embed_author_icon_url") ?? "";
    const inputColor = interaction.options.getString("embed_color") ?? "";
    const inputTitle = interaction.options.getString("embed_title") ?? "";
    const inputURL = interaction.options.getString("embed_url") ?? "";
    const inputDescription =
      interaction.options.getString("embed_description") ?? "";
    const inputThumbnail =
      interaction.options.getString("embed_thumbnail") ?? "";
    const inputFirstFieldName =
      interaction.options.getString("embed_first_field_name") ?? "";
    const inputFirstFieldValue =
      interaction.options.getString("embed_first_field_value") ?? "";
    const inputFirstFieldInline =
      interaction.options.getBoolean("embed_first_field_inline") ?? "";
    const inputSecondFieldName =
      interaction.options.getString("embed_second_field_name") ?? "";
    const inputSecondFieldValue =
      interaction.options.getString("embed_second_field_value") ?? "";
    const inputSecondFieldInline =
      interaction.options.getBoolean("embed_second_field_inline") ?? "";
    const inputImage = interaction.options.getString("embed_image") ?? "";
    const inputTimestamp =
      interaction.options.getString("embed_timestamp") ?? null;
    const inputFooterText =
      interaction.options.getString("embed_footer_text") ?? "";
    const inputFooterIconURL =
      interaction.options.getString("embed_footer_icon_url") ?? "";

    const notificationRef = child(
      child(ref(getDatabase(), "guilds"), interaction.guild.id),
      "notification",
    );
    const notificationSnapshot = await get(notificationRef);

    const notification = interaction.client.configs.notification;

    switch (subcommand) {
      case "list": {
        await interaction.reply(
          interaction.client.i18n.t("commands.notify.list_notification_type", {
            list: notification.join(", "),
          }),
        );
        break;
      }
      case "enable": {
        if (notificationSnapshot.exists()) {
          const notificationData = notificationSnapshot.val();

          if (!notification.includes(inputType))
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.notification_type_not_found",
                { list: notification.join(", ") },
              ),
            );
          if (!inputChannel) {
            if (!notificationData || !notificationData[inputType])
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.notify.require_channel_input",
                ),
              );
            if (!notificationData[inputType].channelId)
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.notify.can_not_settings_by_no_channel",
                ),
              );
            if (notificationData[inputType].enable)
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.notify.channel_type_currently_enabled",
                ),
              );
          } else {
            await update(child(notificationRef, inputType), {
              channelId: inputChannel.id,
            });
          }

          await update(child(notificationRef, inputType), {
            enable: true,
            toggledAt: new Date(),
          });
          await interaction.reply(
            interaction.client.i18n.t(
              "commands.notify.notification_will_send_to_channel",
              {
                type: inputType,
                channel_id: inputChannel
                  ? inputChannel.id
                  : notificationData[inputType].channelId,
              },
            ),
          );
        }
        break;
      }
      case "disable": {
        if (!notification.includes(inputType))
          return await interaction.reply(
            interaction.client.i18n.t(
              "commands.notify.notification_type_not_found",
              { list: notification.join(", ") },
            ),
          );
        if (notificationSnapshot.exists()) {
          const notificationData = notificationSnapshot.val();

          if (!notificationData)
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.require_channel_input",
              ),
            );
          if (!notificationData[inputType])
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.can_not_settings_by_no_channel",
              ),
            );
          if (!notificationData[inputType].enable)
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.channel_type_currently_disabled",
              ),
            );
        }

        await update(child(notificationRef, inputType), {
          enable: false,
          toggledAt: new Date(),
        });
        await interaction.reply(
          interaction.client.i18n.t(
            "commands.notify.temporarily_disable_notification",
            { type: inputType },
          ),
        );
        break;
      }
      case "get": {
        if (notificationSnapshot.exists()) {
          const notificationData = notificationSnapshot.val();

          if (!notificationData)
            return await interaction.reply(
              interaction.client.i18n.t("commands.notify.settings_is_none"),
            );

          const getEmbed = new EmbedBuilder()
            .setTitle(interaction.client.i18n.t("commands.notify.title"))
            .setColor(Colors.Blue)
            .setTimestamp();
          const previewEmbed = new EmbedBuilder();

          if (inputType) {
            if (!notification.includes(inputType))
              return await interaction.reply(
                interaction.client.i18n.t(
                  "commands.notify.notification_type_not_found",
                  { list: notification.join(", ") },
                ),
              );

            const notifyData = notificationData[inputType];
            const enable = notifyData.enable;
            const channelId = notifyData.channelId;
            const enabledAt = notifyData.enabledAt;
            const content = notifyData.content;
            const embed = notifyData.embed;
            const toggledAt = embed.toggledAt;
            const createBy = embed.createBy;
            const editor = embed.editor;

            if (embed) {
              const authorName = embed.author.name;
              const authorURL = embed.author.url;
              const authorIconURL = embed.author.iconURL;
              const color = embed.color;
              const title = embed.title;
              const url = embed.url;
              const description = embed.description;
              const thumbnail = embed.thumbnail;
              const timestamp = embed.timestamp;
              const image = embed.image;
              const firstFelidName = embed.felids[0].name;
              const firstFelidValue = embed.felids[0].value;
              const firstFelidInline = embed.felids[0].inline;
              const secondFelidName = embed.felids[1].name;
              const secondFelidValue = embed.felids[1].value;
              const secondFelidInline = embed.felids[1].inline;
              const footerText = embed.footer.text;
              const footerIconURL = embed.footer.iconURL;

              if (authorName)
                previewEmbed.setAuthor({
                  name: authorName ?? "",
                  url: authorURL ?? "",
                  iconURL: authorIconURL ?? "",
                });
              if (color) previewEmbed.setColor(color);
              if (title) previewEmbed.setTitle(title);
              if (url) previewEmbed.setURL(url);
              if (description) previewEmbed.setDescription(description);
              if (thumbnail) previewEmbed.setThumbnail(thumbnail);
              if (timestamp)
                previewEmbed.setTimestamp(
                  timestamp ? new Date(timestamp) : null,
                );
              if (image) previewEmbed.setImage(image);
              if (embed.felids) {
                if (embed.felids[0] && firstFelidName)
                  previewEmbed.addFields({
                    name: firstFelidName ?? "",
                    value: firstFelidValue ?? "",
                    inline: firstFelidInline ?? false,
                  });
                if (embed.felids[1] && secondFelidName)
                  previewEmbed.addFields({
                    name: secondFelidName ?? "",
                    value: secondFelidValue ?? "",
                    inline: secondFelidInline ?? false,
                  });
              }
              if (footerText)
                previewEmbed.setFooter({
                  text: footerText,
                  iconURL: footerIconURL,
                });
            }

            getEmbed.setDescription(
              newLines(
                interaction.client.i18n.t("commands.notify.description", {
                  command: `</${interaction.commandId}: ${interaction.commandName}>`,
                }),
                "",
                newLines(
                  ...[
                    `**\`${inputType}\`:**`,
                    interaction.client.i18n.t("commands.notify.enable_info", {
                      enable: enable
                        ? interaction.client.i18n.t("commands.notify.yes")
                        : interaction.client.i18n.t("commands.notify.no"),
                    }),
                    enable
                      ? interaction.client.i18n.t(
                          "commands.notify.enable_at_info",
                          {
                            date:
                              new Date(enabledAt).toLocaleString(
                                interaction.client.i18n.language,
                              ) ||
                              interaction.client.i18n.t(
                                "commands.notify.unknown",
                              ),
                          },
                        )
                      : null,
                    interaction.client.i18n.t("commands.notify.channel_info", {
                      channel_id: channelId || "0",
                    }),
                    interaction.client.i18n.t("commands.notify.content_info", {
                      content:
                        content ||
                        interaction.client.i18n.t("commands.notify.none"),
                    }),
                    interaction.client.i18n.t("commands.notify.embed_info", {
                      embed:
                        previewEmbed.length >= 1
                          ? interaction.client.i18n.t("commands.notify.own")
                          : interaction.client.i18n.t("commands.notify.none"),
                    }),
                    previewEmbed.length >= 1
                      ? (interaction.client.i18n.t(
                          "commands.notify.toggled_at_info",
                          {
                            toggled_info:
                              toggledAt ||
                              interaction.client.i18n.t(
                                "commands.notify.unknown",
                              ),
                          },
                        ),
                        interaction.client.i18n.t(
                          "commands.notify.created_by_info",
                          {
                            created_by:
                              createBy ||
                              interaction.client.i18n.t(
                                "commands.notify.unknown",
                              ),
                          },
                        ),
                        editor
                          ? interaction.client.i18n.t(
                              "commands.notify.editor_info",
                              {
                                editor: newLines(
                                  ...editor.map((data) => data.userId),
                                ),
                              },
                            )
                          : null)
                      : null,
                  ].filter((value) => value != null),
                ),
              ),
            );
          } else {
            const notifyInfo = [];

            for (const index in notification) {
              const eventName = notification[index];
              const eventValue = notificationData[eventName];

              notifyInfo.push(
                `${eventName}: <#${eventValue.channelId ?? "0"}>`,
              );
            }

            getEmbed.setDescription(
              newLines(
                interaction.client.i18n.t("commands.notify.description", {
                  command: `</${interaction.commandId}: ${interaction.commandName}>`,
                }),
                "",
                newLines(...notifyInfo),
              ),
            );
          }

          await interaction.reply({ embeds: [getEmbed] });
          if (previewEmbed.length >= 1)
            await interaction.followUp({
              content: interaction.client.i18n.t(
                "commands.notify.preview_embed",
              ),
              embeds: [previewEmbed],
            });
        }
        break;
      }
      case "edit":
      case "set": {
        const requireInputEmbedOptions = [
          inputAuthorName,
          inputTitle,
          inputDescription,
          inputThumbnail,
          inputFirstFieldName,
          inputSecondFieldName,
          inputImage,
          inputFooterText,
        ];
        const requireEmbedOptions = requireInputEmbedOptions.filter(
          (variable) => variable,
        );
        const notify = dataStructures(interaction.client, "notification");

        if (notificationSnapshot.exists()) {
          const notificationData = notificationSnapshot.val();

          if (subcommand === "edit" && !notificationData)
            return await interaction.reply(
              interaction.client.i18n.t("commands.notify.settings_is_none"),
            );
          if (!notification.includes(inputType))
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.notification_type_not_found",
                { list: notification.join(", ") },
              ),
            );
          if (subcommand === "edit" && !notificationData[inputType])
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.can_not_edit_empty_data",
                { type: inputType },
              ),
            );
          if (!inputContent && requireEmbedOptions.length <= 0) {
            return await interaction.reply(
              interaction.client.i18n.t("commands.notify.require_some_data"),
            );
          } else {
            const embed = embedBuilder(
              interaction.client,
              inputAuthorName,
              inputAuthorURL,
              inputAuthorIconURL,
              inputColor,
              inputTitle,
              inputURL,
              inputDescription,
              inputThumbnail,
              inputFirstFieldName,
              inputFirstFieldValue,
              inputFirstFieldInline,
              inputSecondFieldName,
              inputSecondFieldValue,
              inputSecondFieldInline,
              inputImage,
              inputTimestamp,
              inputFooterText,
              inputFooterIconURL,
            );

            if (embed.error) return await interaction.reply(embed.data);

            notify.enable = inputEnable
              ? inputEnable
              : notificationData
                ? notificationData[inputType].enable
                : notify.enable;
            notify.channelId = inputChannel.id;
            notify.toggledAt = inputEnable ? new Date() : null;

            if (inputContent) notify.content = inputContent;
            if (requireEmbedOptions.length >= 1) {
              notify.embed.createdAt = new Date();
              notify.embed.createdBy = interaction.user.id;
              notify.embed.editor.push({
                userId: interaction.user.id,
                editedAt: new Date(),
              });
              notify.embed.author.name = inputAuthorName;
              notify.embed.author.url = inputAuthorURL;
              notify.embed.author.iconURL = inputAuthorIconURL;
              notify.embed.color = inputColor;
              notify.embed.title = inputTitle;
              notify.embed.url = inputURL;
              notify.embed.description = inputDescription;
              notify.embed.thumbnail = inputThumbnail;
              notify.embed.timestamp = new Date(inputTimestamp);
              notify.embed.image = inputImage;
              notify.embed.felids[0].name = inputFirstFieldName;
              notify.embed.felids[0].value = inputFirstFieldValue;
              notify.embed.felids[0].inline = inputFirstFieldInline
                ? inputFirstFieldInline
                : notificationData
                  ? notificationData[inputType].embed.felids[0].inline
                  : notify.embed.felids[0].inline;
              notify.embed.felids[1].name = inputSecondFieldName;
              notify.embed.felids[1].value = inputSecondFieldValue;
              notify.embed.felids[1].inline = inputSecondFieldInline
                ? inputSecondFieldInline
                : notificationData
                  ? notificationData[inputType].embed.felids[1].inline
                  : notify.embed.felids[1].inline;
              notify.embed.footer.text = inputFooterText;
              notify.embed.footer.iconURL = inputFooterIconURL;
            } else {
              if (!inputContent) delete notify.content;
              if (requireEmbedOptions.length <= 0) delete notify.embed;
            }
          }
          if (subcommand === "edit") {
            await update(
              child(notificationRef, inputType),
              Object.entries(notify).reduce(
                (array, [key, value]) =>
                  value == null ? array : ((array[key] = value), array),
                {},
              ),
            );
          } else {
            await update(child(notificationRef, inputType), notify);
          }

          await interaction.reply(
            interaction.client.i18n.t(
              "commands.notify.edited_notification_data",
              { type: inputType, channel_id: inputChannel.id },
            ),
          );
        }
        break;
      }
      case "remove": {
        if (notificationSnapshot.exists()) {
          const notificationData = notificationSnapshot.val();

          if (!notificationData)
            return await interaction.reply(
              interaction.client.i18n.t("commands.notify.settings_is_none"),
            );
          if (!notification.includes(inputType))
            return await interaction.reply(
              interaction.client.i18n.t(
                "commands.notify.notification_type_not_found",
                { list: notification.join(", ") },
              ),
            );

          await remove(child(notificationRef, inputType));
          await interaction.reply(
            interaction.client.i18n.t(
              "commands.notify.unregistered_notification",
              { type: inputType },
            ),
          );
        }
        break;
      }
    }
  },
};
