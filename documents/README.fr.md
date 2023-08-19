<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <strong>
    <h1>Shioru</h2>
    <p>ผู้ช่วยภายในเซิร์ฟเวอร์ Discord จะช่วยทำให้เซิร์ฟเวอร์ของคุณน่าอยู่ขึ้น</p>
  </strong>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru" />
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru" />
  <a title="Statut" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFacteur" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFacteur" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

Votre bon assistant de serveur aidera votre serveur à paraître plus vivant. Elle peut faire beaucoup de choses dont vous pouvez trouver des informations détaillées sur différentes commandes en tapant `/help` Vous pouvez inviter Shioru à rejoindre votre serveur à partir de[ici](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Caractéristiques

- Fonctionne sur [Discord.js](https://discord.js.org/) v14.
- Capable de personnaliser une variété d'articles souhaités
- La musique peut être lue à partir de [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) et [SoundCloud](https://soundcloud.com/) avec lecture automatique.
- Prise en charge de plusieurs langues Vous pouvez vérifier les langues prises en charge à partir des fichiers[langue](https://github.com/Maseshi/shioru/blob/main/source/languages)de ce référentiel.
- Système de niveaux (niveau et expérience)
- Prise en charge de la personnalisation des notifications du serveur
- Vous pouvez parler en tapant `@Shioru` suivi du message que vous souhaitez communiquer.
- La commande d'application (/) peut être utilisée.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Conditions préalables

- [Node.js](https://nodejs.org/) v18.0.0 ou supérieur
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Gite](https://git-scm.com/downloads)

## Guide d'installation rapide

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Aller à [Discord Developer Portal](https://discord.com/developers/applications)
- Cliquez sur **"Nouvelle application"** et donnez un nom à votre bot et acceptez les règles de la politique Discord.
- Allez à la page **"Bot"** et activez toutes les options dans la section **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invitez votre bot sur le serveur en vous rendant sur la page **OAuth2 > Générateur d'URL** sélectionnez `bot` et `applications.commands` sélectionnez `Administrator` puis copiez le lien et collez-le dans l'adresse de votre navigateur. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Configurer un bot

เนื่องจากเราใช้ [sodium](https://www.npmjs.com/package/sodium) ในการเข้ารหัสและถอดรหัส เราจึงจำเป็นต้องติดตั้งส่วนประกอบเพิ่มเติมต่อไปนี้:

```bat
@REM บน Windows
npm install -g windows-build-tools
```
```sh
# บน MacOS (Darwin)
brew install libtool autoconf automake
```
```sh
# บน Linux
sudo apt-get install libtool-bin
```

- Lancez un terminal et exécutez la commande suivante.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- Vous pouvez modifier certaines données dans **config** à `./source/config.js`

### Configurer Firebase

- Accédez à https://firebase.google.com/ et commencez à configurer le projet.
- Ajoutez un nouveau projet et suivez les étapes.
- Ajoutez votre première application avec **Site Web** Nommez éventuellement votre application **"Configurez également l'hébergement Firebase pour cette application"** et enregistrez l'application. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase vous fournira des informations sur la configuration. Appliquer ces valeurs au fichier `.env.example`
- Allez à **créer > [base de données temps réel](https://console.firebase.google.com/u/0/project/_/database/data)** pour créer une base de données de stockage.

### développer

- Renommez le fichier `.env.example` en `.env` et insérez toutes les valeurs nécessaires.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Dépannage rapide

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Si vous ne pouvez pas installer le package **sodium** , installez **libsodium-wrappers** à la place.
```bat
npm installer ffmpeg-static@latest --save
```
- Si vous ne pouvez pas lire votre musique ou si les commandes de lecture de musique ne fonctionnent pas, installez [ffmpeg](https://ffmpeg.org/download.html) **(recommandé)** ou installez le package **ffmpeg-static** et réessayez.
```bat
npm installer ffmpeg-static@latest --save
```

## Améliorer Traduire

Vous pouvez nous aider à traduire une langue existante ou une langue qui n'est pas disponible actuellement chez [Crowdin](https://crowdin.com/project/shioru-bot).

## crédit

Merci à tous les créateurs originaux d'avoir permis l'utilisation de ces merveilleuses œuvres.

Dessin d'avatar par : [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## trouvé un problème

Si vous rencontrez des problèmes de votre travail actuel Vous pouvez nous le faire savoir via l'onglet [numéro](https://github.com/Maseshi/Shioru/issues) de ce référentiel.
