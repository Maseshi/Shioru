const { PermissionsBitField } = require("discord.js");
const { readdirSync, readFileSync, unlinkSync } = require("node:fs");

module.exports = {
    "enable": true,
    "name": "logs",
    "description": "Manage logs files saved in the system.",
    "category": "developer",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "logs <options: get(type), read<file>, delete<file>> (type: catch, debug, error, process) (file)",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Manage logs files saved in the system.",
            "th": "จัดการล็อกไฟล์ที่บันทึกไว้ในระบบ"
        },
        "options": [
            {
                "type": 1,
                "name": "get",
                "name_localizations": {
                    "th": "รับ"
                },
                "description": "Get the information contained in the folder.",
                "description_localizations": {
                    "th": "รับข้อมูลที่มีอยู่ในโฟลเดอร์"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "type",
                        "name_localizations": {
                            "th": "ประเภท"
                        },
                        "description": "type of log file",
                        "description_localizations": {
                            "th": "ประเภทของไฟล์ล็อก"
                        },
                        "choices": [
                            {
                                "name": "catch",
                                "value": "catch"
                            },
                            {
                                "name": "debug",
                                "value": "debug"
                            },
                            {
                                "name": "error",
                                "value": "error"
                            },
                            {
                                "name": "process",
                                "value": "process"
                            }
                        ],
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "read",
                "name_localizations": {
                    "th": "อ่าน"
                },
                "description": "Read the desired log file.",
                "description_localizations": {
                    "th": "อ่านไฟล์ล็อกที่ต้องการ"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "filename",
                        "name_localizations": {
                            "th": "ชื่อไฟล์"
                        },
                        "description": "The name of the file to read details within the file.",
                        "description_localizations": {
                            "th": "ชื่อของไฟล์ที่ต้องการอ่านรายละเอียดภายในไฟล์"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "delete",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "Remove unwanted log files from the folder.",
                "description_localizations": {
                    "th": "ลบไฟล์ล็อกที่ไม่ต้องการออกจากโฟลเดอร์"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "filename",
                        "name_localizations": {
                            "th": "ชื่อไฟล์"
                        },
                        "description": "The name of the file to be deleted from the folder.",
                        "description_localizations": {
                            "th": "ชื่อของไฟล์ที่ต้องการจะลบออกจากโฟลเดอร์"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const folderPath = "./source/logs/";

        if (interaction.options.getSubcommand() === "get") {
            const inputType = interaction.options.getString("type");

            try {
                const logs = readdirSync(folderPath).filter(files => files.endsWith(".log"));
                const listFilename = logs.filter(log => log.includes(inputType));

                if (listFilename) {
                    return await interaction.editReply(interaction.client.translate.commands.logs.found_file.replace("%s1", listFilename.length).replace("%s2", listFilename.join(" \n")));
                } else {
                    return await interaction.editReply(interaction.client.translate.commands.logs.file_not_found.replace("%s", inputType));
                }
            } catch (error) {
                return await interaction.editReply(interaction.client.translate.commands.logs.folder_empty);
            }
        }
        if (interaction.options.getSubcommand() === "read") {
            const inputFilename = interaction.options.getString("filename");

            try {
                const fileString = readFileSync(folderPath + inputFilename, "utf8");

                return await interaction.editReply("```JavaScript\n%s\n```".replace("%s", fileString));
            } catch {
                try {
                    const fileString = readFileSync(folderPath + inputFilename + ".log", "utf8");

                    return await interaction.editReply("```JavaScript\n%s\n```".replace("%s", fileString));
                } catch (error) {
                    return await interaction.editReply(interaction.client.translate.commands.logs.can_not_read_file.replace("%s", error));
                }
            }
        }
        if (interaction.options.getSubcommand() === "delete") {
            const inputFilename = interaction.options.getString("filename");

            if (interaction.user.id !== interaction.client.config.owner) return interaction.editReply(interaction.client.translate.commands.logs.owner_only);

            try {
                unlinkSync(folderPath + inputFilename);

                return await interaction.editReply(interaction.client.translate.commands.logs.file_has_been_deleted.replace("%s", inputFilename));
            } catch {
                try {
                    unlinkSync(folderPath + inputFilename + ".log");

                    return await interaction.editReply(interaction.client.translate.commands.logs.file_has_been_deleted.replace("%s", inputFilename));
                } catch (error) {
                    return await interaction.editReply(interaction.client.translate.commands.logs.can_not_delete_file.replace("%s", error));
                }
            }
        }
    }
}