const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    "name": "covid",
    "description": "Get covid statistics for a country",
    "category": "utility",
    "permissions": {
        "client": ["SEND_MESSAGES", "EMBED_LINKS"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "covid <country>",
    "aliases": ["โควิด"],
    async execute(client, message, args) {
        const inputCountry = args[0];

        if (!inputCountry) return message.reply(client.translate.commands.covid.what_country);

        const response = await fetch("https://disease.sh/v3/covid-19/countries/" + inputCountry)

        if (response.status === 404) return message.reply(client.translate.commands.covid.country_not_found);
        if (!response.ok) return message.reply(client.translate.commands.covid.backend_issue);

        const data = await response.json();

        const date = new Date(data.updated);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = day + "/" + month + "/" + year + " " + client.translate.commands.covid.when + " " + hours + ':' + minutes.slice(-2);

        const clientFetch = await client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const covidEmbed = new EmbedBuilder()
            .setTitle("🧫 Covid - %s".replace("%s", data.country))
            .setThumbnail(data.countryInfo.flag)
            .setColor(clientColor)
            .addFields(
                [
                    { "name": client.translate.commands.covid.cases_total, "value": data.cases.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.cases_today, "value": data.todayCases.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.deaths_total, "value": data.deaths.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.deaths_today, "value": data.todayDeaths.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.recovered, "value": data.recovered.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.active, "value": data.active.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.critical_stage, "value": data.critical.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.cases_per_one_million, "value": data.casesPerOneMillion.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.tests, "value": data.tests.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.tests_per_one_million, "value": data.testsPerOneMillion.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.population, "value": data.population.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.one_case_per_people, "value": data.oneCasePerPeople.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.one_death_per_people, "value": data.oneDeathPerPeople.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.one_test_per_people, "value": data.oneTestPerPeople.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.active_per_one_million, "value": data.activePerOneMillion.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.recovered_per_one_million, "value": data.recoveredPerOneMillion.toLocaleString(), "inline": true },
                    { "name": client.translate.commands.covid.critical_per_one_million, "value": data.criticalPerOneMillion.toLocaleString(), "inline": true }
                ]
            )
            .setFooter({ "text": client.translate.commands.covid.updated_on.replace("%s", formattedTime) });

        message.channel.send({ "embeds": [covidEmbed] });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "covid",
            "th": "โควิด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Get covid statistics for a country",
            "th": "สำหรวจสถิติโควิดในประเทศที่ต้องการ"
        },
        "options": [
            {
                "type": 3,
                "name": "country",
                "name_localizations": {
                    "th": "ประเทศ"
                },
                "description": "Countries you want to explore statistics on COVID-19",
                "description_localizations": {
                    "th": "ประเทศที่คุณต้องการจะสำรวจสถิติเกี่ยวกับเชื้อไวรัสโควิด 19"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputCountry = interaction.options.get("country").value;

        const response = await fetch("https://disease.sh/v3/covid-19/countries/" + inputCountry)

        if (response.status === 404) return await interaction.editReply(interaction.client.translate.commands.covid.country_not_found);
        if (!response.ok) return await interaction.editReply(interaction.client.translate.commands.covid.backend_issue);

        const data = await response.json();

        const date = new Date(data.updated);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = day + "/" + month + "/" + year + " " + interaction.client.translate.commands.covid.when + " " + hours + ':' + minutes.slice(-2);

        const clientFetch = await interaction.client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const covidEmbed = new EmbedBuilder()
            .setTitle("🧫 Covid - %s".replace("%s", data.country))
            .setThumbnail(data.countryInfo.flag)
            .setColor(clientColor)
            .addFields(
                [
                    { "name": interaction.client.translate.commands.covid.cases_total, "value": data.cases.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.cases_today, "value": data.todayCases.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.deaths_total, "value": data.deaths.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.deaths_today, "value": data.todayDeaths.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.recovered, "value": data.recovered.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.active, "value": data.active.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.critical_stage, "value": data.critical.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.cases_per_one_million, "value": data.casesPerOneMillion.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.tests, "value": data.tests.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.tests_per_one_million, "value": data.testsPerOneMillion.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.population, "value": data.population.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.one_case_per_people, "value": data.oneCasePerPeople.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.one_death_per_people, "value": data.oneDeathPerPeople.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.one_test_per_people, "value": data.oneTestPerPeople.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.active_per_one_million, "value": data.activePerOneMillion.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.recovered_per_one_million, "value": data.recoveredPerOneMillion.toLocaleString(), "inline": true },
                    { "name": interaction.client.translate.commands.covid.critical_per_one_million, "value": data.criticalPerOneMillion.toLocaleString(), "inline": true }
                ]
            )
            .setFooter({ "text": interaction.client.translate.commands.covid.updated_on.replace("%s", formattedTime) });

        await interaction.editReply({ "embeds": [covidEmbed] });
    }
};