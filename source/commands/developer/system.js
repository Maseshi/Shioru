const {
  version,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { get } = require("systeminformation");
const packages = require("../../../package.json");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("system")
    .setDescription("Manage the operation of home systems")
    .setDescriptionLocalizations({ th: "จัดการการทำงานของระบบภายในบ้าน" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("information")
        .setDescription("Get system operating status and more")
        .setDescriptionLocalizations({ th: "รับสถานะการทำงานของระบบและอื่น" }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reboot")
        .setDescription("Restart to working again")
        .setDescriptionLocalizations({ th: "เริ่มต้นการทำงานใหม่" }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shutdown")
        .setDescription("Stop to working")
        .setDescriptionLocalizations({ th: "หยุดการทำงาน" }),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const teamOwner = interaction.client.configs.team.owner;
    const teamDev = interaction.client.configs.team.developer;

    switch (subcommand) {
      case "information": {
        await interaction.reply(
          interaction.client.i18n.t("commands.system.loading"),
        );

        const data = await get({
          time: "uptime",
          system: "manufacturer, model",
          bios: "vendor, version, releaseDate",
          cpu: "manufacturer, brand, speed, cores, physicalCores",
          cpuTemperature: "main",
          mem: "total, used",
          graphics: "controllers, displays",
          osInfo: "platform, arch",
          vboxInfo: "id, name, running, runningSince, guestOS, memory, cpus",
        });

        // Uptime
        const serverSeconds = data.time.uptime;
        const serverDays = Math.floor(serverSeconds / (3600 * 24));
        const serverHours = Math.floor((serverSeconds % (3600 * 24)) / 3600);

        // System
        const systemManufacturer = data.system.manufacturer;
        const systemModel = data.system.model;

        // BIOS
        const biosVendor = data.bios.vendor;
        const biosVersion = data.bios.version;
        const biosReleaseDate = data.bios.releaseDate;

        // CPU
        const cpuManufacturer = data.cpu.manufacturer;
        const cpuBrand = data.cpu.brand;
        const cpuSpeed = data.cpu.speed;
        const cpuCores = data.cpu.cores;
        const cpuPhysicalCores = data.cpu.physicalCores;

        // CPU Temperature
        const cpuTempMain = data.cpuTemperature.main;

        // Memory
        const memUsed = (data.mem.used / 1024 / 1024).toFixed(2);
        const memTotal = (data.mem.total / 1024 / 1024).toFixed(2);

        // Graphics Controllers
        let gpuMain = "";
        const gpuControllers = data.graphics.controllers;
        if (gpuControllers.length) {
          for (const gpuController of gpuControllers) {
            const gpuMainModel = gpuController.model;
            const gpuMainFanSpeed = gpuController.fanSpeed;
            const gpuMainMemoryTotal = gpuController.memoryTotal;
            const gpuMainMemoryUsed = gpuController.memoryUsed;
            const gpuMainTemperatureGpu = gpuController.temperatureGpu;

            gpuMain +=
              "```" +
              `${gpuMainModel}, ` +
              (gpuMainMemoryUsed
                ? gpuMainMemoryTotal
                  ? `${gpuMainMemoryUsed}/${gpuMainMemoryTotal}MB`
                  : ""
                : "") +
              (gpuMainFanSpeed ? gpuMainFanSpeed + " " : "") +
              (gpuMainTemperatureGpu ?? "") +
              "```";
          }
        }

        // Graphics Displays
        let gpuSecond = "";
        const gpuDisplays = data.graphics.displays;
        for (const gpuDisplay of gpuDisplays) {
          const gpuSecondModel = gpuDisplay.model;
          const gpuSecondMain = gpuDisplay.main;

          gpuSecond +=
            "```" +
            `${gpuSecondModel}, ` +
            (gpuSecondMain
              ? interaction.client.i18n.t("commands.system.main")
              : "") +
            "```";
        }

        // Operating System
        const osPlatform = data.osInfo.platform;
        const osArch = data.osInfo.arch;

        const clientAvatar = interaction.client.user.displayAvatarURL();
        const clientUsername = interaction.client.user.username;
        const systemEmbed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setAuthor({ iconURL: clientAvatar, name: clientUsername })
          .setTitle(interaction.client.i18n.t("commands.system.info_title"))
          .setDescription(
            interaction.client.i18n.t("commands.system.info_description"),
          )
          .addFields([
            {
              name: "• Package",
              value: "```" + `v${packages.version}` + "```",
              inline: true,
            },
            {
              name: "• Discord.js",
              value: "```" + `v${version}` + "```",
              inline: true,
            },
            {
              name: "• Node.js",
              value: "```" + process.version + "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t("commands.system.info_uptime"),
              value:
                "```" +
                interaction.client.i18n.t("commands.system.info_uptime_info", {
                  day: serverDays,
                  hours: serverHours,
                }) +
                "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t("commands.system.info_system"),
              value:
                "```" +
                (systemManufacturer
                  ? `${systemManufacturer} ${systemModel}`
                  : interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
            {
              name: "• BIOS",
              value:
                "```" +
                (biosVendor
                  ? `${biosVendor} ${biosVersion}, ${biosReleaseDate}`
                  : interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
            {
              name: "• CPU",
              value:
                "```" +
                (cpuManufacturer
                  ? `${cpuManufacturer} ${cpuBrand}, ${cpuSpeed}GHz ${cpuCores} Cores ${cpuPhysicalCores} Trades`
                  : interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t(
                "commands.system.info_temperature",
              ),
              value:
                "```" +
                (cpuTempMain ??
                  interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t(
                "commands.system.info_memory_used",
              ),
              value:
                "```" +
                (memUsed && memTotal
                  ? `${memUsed} / ${memTotal}MB`
                  : interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t(
                "commands.system.info_gpu_control",
              ),
              value:
                gpuMain ||
                "```" +
                  interaction.client.i18n.t("commands.system.unknown") +
                  "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t(
                "commands.system.info_gpu_display",
              ),
              value:
                gpuSecond ||
                "```" +
                  interaction.client.i18n.t("commands.system.unknown") +
                  "```",
              inline: true,
            },
            {
              name: interaction.client.i18n.t("commands.system.info_platform"),
              value:
                "```" +
                (osPlatform
                  ? `${osPlatform} ${osArch}`
                  : interaction.client.i18n.t("commands.system.unknown")) +
                "```",
              inline: true,
            },
          ]);

        await interaction.editReply({ content: null, embeds: [systemEmbed] });
        break;
      }
      case "reboot": {
        if (
          interaction.user.id !== teamOwner &&
          !teamDev.includes(interaction.user.id)
        )
          return await interaction.reply(
            interaction.client.i18n.t("commands.system.not_owner"),
          );

        await interaction.reply(
          interaction.client.i18n.t("commands.system.rebooting"),
        );
        await interaction.client.destroy();
        await interaction.client.login(interaction.client.configs.token);
        await interaction.editReply(
          interaction.client.i18n.t("commands.system.now_reboot"),
        );
        break;
      }
      case "shutdown": {
        if (interaction.user.id !== teamOwner)
          return await interaction.reply(
            interaction.client.i18n.t("commands.system.not_owner"),
          );

        await interaction.reply(
          interaction.client.i18n.t("commands.system.shutting_down"),
        );
        await interaction.client.destroy();
        await interaction.editReply(
          interaction.client.i18n.t("commands.system.now_shutdown"),
        );

        process.exit();
        break;
      }
    }
  },
};
