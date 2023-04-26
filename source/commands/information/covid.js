const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { get } = require("axios").default;

module.exports = {
    "enable": true,
    "name": "covid",
    "description": "Get covid statistics for a country",
    "category": "information",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ]
    },
    "usage": "covid <country(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "โควิด"
        },
        "description": module.exports.description,
        "description_localizations": {
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
        const inputCountry = interaction.options.getString("country");

        try {
            const response = await get("https://disease.sh/v3/covid-19/countries/" + inputCountry)

            if (response.status === 404) return await interaction.reply(interaction.client.translate.commands.covid.country_not_found);
            if (!response.data) return await interaction.reply(interaction.client.translate.commands.covid.backend_issue);

            const date = new Date(response.updated);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = "0" + date.getMinutes();
            const formattedTime = day + "/" + month + "/" + year + " " + interaction.client.translate.commands.covid.when + " " + hours + ':' + minutes.slice(-2);

            const clientFetch = await interaction.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const covidEmbed = new EmbedBuilder()
                .setTitle("🧫 Covid - %s".replace("%s", response.country))
                .setThumbnail(response.countryInfo.flag)
                .setColor(clientColor)
                .addFields(
                    [
                        { "name": interaction.client.translate.commands.covid.cases_total, "value": response.cases.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.cases_today, "value": response.todayCases.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.deaths_total, "value": response.deaths.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.deaths_today, "value": response.todayDeaths.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.recovered, "value": response.recovered.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.active, "value": response.active.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.critical_stage, "value": response.critical.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.cases_per_one_million, "value": response.casesPerOneMillion.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.tests, "value": response.tests.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.tests_per_one_million, "value": response.testsPerOneMillion.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.population, "value": response.population.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.one_case_per_people, "value": response.oneCasePerPeople.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.one_death_per_people, "value": response.oneDeathPerPeople.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.one_test_per_people, "value": response.oneTestPerPeople.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.active_per_one_million, "value": response.activePerOneMillion.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.recovered_per_one_million, "value": response.recoveredPerOneMillion.toLocaleString(), "inline": true },
                        { "name": interaction.client.translate.commands.covid.critical_per_one_million, "value": response.criticalPerOneMillion.toLocaleString(), "inline": true }
                    ]
                )
                .setFooter({ "text": interaction.client.translate.commands.covid.updated_on.replace("%s", formattedTime) });

            await interaction.reply({ "embeds": [covidEmbed] });
        } catch (error) {
            await interaction.reply(interaction.client.translate.commands.covid.country_not_found);
        }
    }
}