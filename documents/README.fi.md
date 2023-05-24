<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Shioru</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Tila" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[FI](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

ผู้ช่วยเซิร์ฟเวอร์ที่ดีของคุณจะช่วยให้เซิร์ฟเวอร์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งต่างๆ ได้โดยพิมพ์ `/help` คุณสามารถเชิญ Shioru เข้าร่วมเซิร์ฟเวอร์ของคุณได้จาก[ที่นี่](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## ominaisuudet

- Toimii [Discord.js](https://discord.js.org/) v14:ssä.
- Pystyy räätälöimään erilaisia haluttuja kohteita
- Musiikkia voidaan toistaa [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) ja [SoundCloud](https://soundcloud.com/) automaattisella toistolla.
- Tukee useita kieliä Voit tarkistaa tuetut kielet tämän arkiston[kielitiedostosta](https://github.com/Maseshi/shioru/blob/main/source/languages).
- Tasojärjestelmä (taso ja kokemus)
- Palvelimen ilmoitusten mukauttamisen tuki
- Voit puhua kirjoittamalla `@Shioru` ja sen jälkeen viestin, jonka haluat kommunikoida.
- Sovelluskomentoa (/) voidaan käyttää.

ja monia muita mielenkiintoisia ominaisuuksia...

## Paranna käännöstä

Voit auttaa meitä kääntämään olemassa olevan kielen tai kielen, joka ei ole tällä hetkellä saatavilla osoitteessa [Crowdin](https://crowdin.com/project/shioru-bot).

## Edellytykset

- [Node.js](https://nodejs.org/) v18.0.0 tai uudempi
- [Firebase](https://firebase.google.com/) v9.0.0 tai uudempi
- [Git](https://git-scm.com/downloads)

## Pika-asennusopas

### Aloittaa

- Siirry [Discord-kehittäjäportaaliin](https://discord.com/developers/applications)
- Napsauta **"Uusi sovellus"** ja nimeä bottisi ja hyväksy Discord-käytäntösäännöt.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Asenna botti

- Käynnistä pääte ja suorita seuraava komento.

```bash
git-klooni https://github.com/Maseshi/Shioru.git
cd Shioru
npm asennus --tallenna
```

- Voit muokata joitain tietoja kohdassa **config** osoitteessa `./source/config.js`

### Ota Firebase käyttöön

- Siirry osoitteeseen https://firebase.google.com/ ja aloita projektin määrittäminen.
- Lisää uusi projekti ja seuraa ohjeita.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Siirry kohtaan **luo > [reaaliaikainen tietokanta](https://console.firebase.google.com/u/0/project/_/database/data)** luodaksesi tallennustietokanta.

### kehittää

- Nimeä tiedosto uudelleen `.env.example` muotoon `.env` ja lisää kaikki tarvittavat arvot.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Nopea vianetsintä

- Jos et voi asentaa pakettia **natrium** , asenna sen sijaan **libsodium-wrappers**.
```bat
npm poista natrium
npm asenna libsodium-wrappers@latest --save
```
- Jos et voi toistaa musiikkia tai musiikin toistokomennot eivät toimi, asenna [ffmpeg](https://ffmpeg.org/download.html) **(suositus)** tai asenna **ffmpeg-static** -paketti ja yritä uudelleen.
```bat
npm asentaa ffmpeg-static@latest --save
```

## luotto

Kiitos kaikille alkuperäisille tekijöille, jotka annoitte käyttää näitä upeita teoksianne.

Avatar piirtäjä: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## löysi ongelman

Jos kohtaat ongelmia nykyisestä työstäsi Voit ilmoittaa meille tämän arkiston [ongelma](https://github.com/Maseshi/Shioru/issues) -välilehden kautta.
