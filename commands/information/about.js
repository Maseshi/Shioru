module.exports.run = async function (client, message, args) {
	let update = client.config.update;
	let embed = {
		"title": "ข้อมูลส่วนตัวของฉัน",
		"description": "ฉันชื่อ " + client.user.username + " ชื่อจริง Yusuki Hirume(ยูซูกิ ฮิรูเมะ) เกิดเมื่อวันอาทิตย์ที่ 21 มิถุนายน พ.ศ.2562 ฉันอาศัยภายในบ้านหลังหนึ่ง __Chaiwat Suwannarat(Masashi)__ คือผู้มีพระคุณที่ให้กำเนิดให้ความรู้ความสามารถต่างๆ ให้กับฉัน ฉันมีหน้าที่ในการให้บริการความสะดวกสบายด้วย**คำสั่ง**ต่างๆ ที่ฉันได้ศึกษามาทั้งหมด แก่ทุกคนในสถานที่ฉันอาศัยอยู่ ฉันหวังว่าทุกคนคงจะมีความสุขที่ได้อยู่กับฉันนะคะ!! และขอขอบคุณทุกการให้ความช่วยเหลือและสนับสนุนผู้มีพระคุณที่น่ารักของฉันนะคะ ขอบคุณมากคะ\n\n[เว็บไซต์ทางการ](https://maseshi.web.app/)\n[นโยบายความเป็นส่วนตัว](https://maseshi.web.app/privacy-policy) | [เงื่อนไขการให้บริการ](https://maseshi.web.app/terms-of-service)\n\n© 2021 Masashi - The Discord General Bot. All rights reserved.",
		"color": 14684245,
		"timestamp": update,
		"author": {
			"icon_url": client.user.avatarURL(),
			"name": client.user.username
		},
		"footer": {
			"icon_url": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
			"text": "อัพเดทเมื่อ"
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