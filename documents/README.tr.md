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
  <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="Kod Faktörü" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="Kod Faktörü" />
  </a>
  <a title="top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

İyi sunucu asistanınız, sunucunuzun daha canlı görünmesine yardımcı olacaktır. `/help` yazarak farklı komutların detaylı bilgilerini bulabileceğiniz birçok şey yapabilir.Shioru'yu[buraya](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Özellikler

- [Discord.js](https://discord.js.org/) v14 üzerinde çalışır.
- İstenen çeşitli öğeleri özelleştirebilme
- Otomatik oynatma ile [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) ve [SoundCloud](https://soundcloud.com/) müzik çalınabilir.
- Birden çok dili destekleyin Desteklenen dilleri bu deponun[dil](https://github.com/Maseshi/shioru/blob/main/source/languages)dosyasından kontrol edebilirsiniz.
- Katman sistemi (seviye ve deneyim)
- Sunucu bildirimi özelleştirme desteği
- `@Shioru` yazarak ve ardından iletmek istediğiniz mesajı yazarak konuşabilirsiniz.
- Uygulama komutu (/) kullanılabilir.

ve diğer birçok ilginç özellik...

## Önkoşullar

- [Node.js](https://nodejs.org/) v18.0.0 veya üstü
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [git](https://git-scm.com/downloads)

## Hızlı Kurulum Kılavuzu

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- Discord Geliştirici Portalına Git
- **"New Application"** tıklayın ve botunuza bir isim verin ve Discord politika kurallarını kabul edin.
- Sayfa **"Bot"** gidin ve bölüm **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Sayfa **giderek botunuzu sunucuya davet edin OAuth2 > URL Oluşturucu** seçin `bot` ve `apps.commands` seçin `Yönetici` sonra bağlantıyı kopyalayın ve tarayıcınızın adresine yapıştırın. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### ตั้งค่าบอท

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

- Bir terminal başlatın ve aşağıdaki komutu çalıştırın.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- **config** bazı verileri `./source/config.js`değiştirebilirsiniz.

### Firebase'i kurun

- https://firebase.google.com/ adresine gidin ve projeyi kurmaya başlayın.
- Yeni bir proje ekleyin ve adımları izleyin.
- **Web Sitesi ile ilk uygulamanızı ekleyin** İsteğe bağlı olarak uygulamanızı adlandırın **"Bu uygulama için Firebase Barındırma'yı da kurun"** ve uygulamayı kaydedin. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase size yapılandırma hakkında bilgi verecektir. Bu değerleri `.env.example`dosyasına uygulayın
- Bir depolama veritabanı oluşturmak için ** > [gerçek zamanlı veritabanı oluştur](https://console.firebase.google.com/u/0/project/_/database/data)** seçeneğine gidin.

### geliştirmek

- `.env.example` dosyasını `.env` olarak yeniden adlandırın ve gerekli tüm değerleri ekleyin.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## Hızlı Sorun Giderme

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- **sodyum** paketini kuramazsanız, bunun yerine **libsodium-wrappers** kurun.
```bat
npm sodyum kaldır
npm kurulum libsodium-wrappers@latest --save
```
- Müziğinizi çalamıyorsanız veya müzik çalma komutları çalışmıyorsa, [ffmpeg](https://ffmpeg.org/download.html) **(önerilen)** kurun veya **ffmpeg-static** paketini kurun ve tekrar deneyin.
```bat
npm kurulum ffmpeg-static@latest --save
```

## Çeviriyi İyileştir

Mevcut bir dili veya şu anda [Crowdin](https://crowdin.com/project/shioru-bot)bulunmayan bir dili çevirmemize yardımcı olabilirsiniz.

## kredi

Bu harika çalışmalarınızın kullanılmasına izin verdiğiniz için tüm orijinal yaratıcılara teşekkür ederiz.

Avatar çizimi yapan: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## bir sorun bulundu

Herhangi bir sorunla karşılaşırsanız şu anki işinizden Bu deponun [sayı](https://github.com/Maseshi/Shioru/issues) sekmesinden bize bildirebilirsiniz.
