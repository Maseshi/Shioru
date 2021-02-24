module.exports.run = async function (client, message, args) {
	let embed = {
		"title": client.lang.command_information_about_embed_title,
		"description": client.lang.command_information_about_embed_description.replace("%packageName", client.user.username),
		"color": 14684245,
		"timestamp": client.config.update,
		"author": {
			"icon_url": client.user.avatarURL(),
			"name": client.user.username
		},
		"footer": {
			"icon_url": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
			"text": client.lang.command_information_about_embed_footer_text
		},
		"thumbnail": {
			"url": "https://lh3.googleusercontent.com/4SZ_rRrq7mNvqhR3hX7jkgGIHxsEbLqHmu7qaUaaER-H37ZRcA6NB7eLdZFpdZ1j78rq__t3hz85_xOlWW5iRa6UjJxnWMQRnqawOJ1qsxs1GkBD-bbo2eI4pn3gmfnpPOxb-AC4Pt4Dz9JAM1QWmx8EXTjbJmCu3wl1YaOQ_tRICwuIrt-2RUsBl7TlQ04LMKfcBzZWKWB_7osCogbuBOSmNHZv-Epd5CwqZZoon6IggRuBO5zz7oAkRxFSRGxn8Brqts24noy0h6gC3Wfx5iJLAEYfWFUeiehj2OKMI_MQhAFlIqjBRnh4YuG1Ph8rr_2aoUaBFZNWQYQeiLEHwk_XmDmKrZXcwmMCeEMbtELTiw4neCOrl4p7s400ExCO0J09W7zKGlCi4ORSO38dQsWopAermzMXZcXWdPLJbX3UN3u2zAILvNAhzAhK2mLL_Z7GCOE8FD2XJKwNhrDAphkNNCSPtB6G-uusipDDmGPT6mzIiSxfVjy9LQnqmMnqFoIgIWA7_OajTaN61ckYeuYxuFTAmtthYSrJpBugjmVUIYSRsCXbEbalxoHQHUMSjBv1OD_CkhHoZZ94JMZ1ydjtw9yR8OBGyRMlRWz4HVFDfydQ9dVO2OxUlT2byO6xblSttEReWoegEA64v38x9rnGoG5UEWwb_4U0S2weh2QZ7gZqMVjCCfayXigu=s625-no"
		}
	};
	message.channel.send({ embed });
};

module.exports.help = {
	"name": "about",
	"description": "See information about bots.",
	"usage": "about",
	"category": "information",
	"aliases": ["information", "botinfo", "botInfo", "เกี่ยวกับ", "เกี่ยวกับบอท", "เกี่ยวกับ bot"]
};