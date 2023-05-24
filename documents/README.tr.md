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
  <a title="Status" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="Kod Faktörü" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="Kod Faktörü" />
  </a>
  <a title="top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[TR](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) |

İyi sunucu asistanınız, sunucunuzun daha canlı görünmesine yardımcı olacaktır. `/help` yazarak farklı komutların detaylı bilgilerini bulabileceğiniz birçok şey yapabilir.Shioru'yu[buraya](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

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

## Çeviriyi İyileştir

Mevcut bir dili veya şu anda [Crowdin](https://crowdin.com/project/shioru-bot)bulunmayan bir dili çevirmemize yardımcı olabilirsiniz.

## Önkoşullar

- [Node.js](https://nodejs.org/) v18.0.0 veya üstü
- [Firebase](https://firebase.google.com/) v9.0.0 veya üzeri
- [git](https://git-scm.com/downloads)

## Hızlı Kurulum Kılavuzu

### เริ่มต้นใช้งาน

- Discord Geliştirici Portalına Git
- **"New Application"** tıklayın ve botunuza bir isim verin ve Discord politika kurallarını kabul edin.
- Sayfa **"Bot"** gidin ve bölüm **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Sayfa **giderek botunuzu sunucuya davet edin OAuth2 > URL Oluşturucu** seçin `bot` ve `apps.commands` seçin `Yönetici` sonra bağlantıyı kopyalayın ve tarayıcınızın adresine yapıştırın. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### ตั้งค่าบอท

- Bir terminal başlatın ve aşağıdaki komutu çalıştırın.

```bash
git klonu https://github.com/Maseshi/Shioru.git
cd Shioru
npm kurulum -- kaydet
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
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Hızlı Sorun Giderme

- **sodyum** paketini kuramazsanız, bunun yerine **libsodium-wrappers** kurun.
```bat
npm sodyum kaldır
npm kurulum libsodium-wrappers@latest --save
```
- Müziğinizi çalamıyorsanız veya müzik çalma komutları çalışmıyorsa, [ffmpeg](https://ffmpeg.org/download.html) **(önerilen)** kurun veya **ffmpeg-static** paketini kurun ve tekrar deneyin.
```bat
npm kurulum ffmpeg-static@latest --save
```

## kredi

Bu harika çalışmalarınızın kullanılmasına izin verdiğiniz için tüm orijinal yaratıcılara teşekkür ederiz.

Avatar çizimi yapan: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## bir sorun bulundu

Herhangi bir sorunla karşılaşırsanız şu anki işinizden Bu deponun [sayı](https://github.com/Maseshi/Shioru/issues) sekmesinden bize bildirebilirsiniz.
