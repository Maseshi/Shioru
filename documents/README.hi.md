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
  <a title="दर्जा" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="भीड़" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="कोडफैक्टर" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="कोडफैक्टर" />
  </a>
  <a title="टॉप.जी" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

[एन](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [वें](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [जेए](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## विशेषताएँ

- [Discord.js](https://discord.js.org/) v14 पर काम करता है।
- वांछित वस्तुओं की एक किस्म को अनुकूलित करने में सक्षम
- स्वचालित प्लेबैक के साथ [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) और [SoundCloud](https://soundcloud.com/) से संगीत चलाया जा सकता है।
- कई भाषाओं का समर्थन करें आप इस रिपॉजिटरी की[भाषा फाइल](https://github.com/Maseshi/shioru/blob/main/source/languages)में समर्थित भाषाओं की जांच कर सकते हैं।
- टियर सिस्टम (स्तर और अनुभव)
- सर्वर अधिसूचना अनुकूलन के लिए समर्थन
- आप जिस संदेश से संवाद करना चाहते हैं उसके बाद `@Shioru` टाइप करके बात कर सकते हैं।
- एप्लिकेशन कमांड (/) का उपयोग किया जा सकता है।

आपका अच्छा सर्वर सहायक आपके सर्वर को अधिक जीवंत दिखने में मदद करेगा। वह बहुत कुछ कर सकती है जिसके लिए आप `/help` टाइप करके विभिन्न कमांड की विस्तृत जानकारी प्राप्त कर सकते हैं।आप शिओरू को[यहाँ](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## आवश्यक शर्तें

- [Node.js](https://nodejs.org/) v18.0.0 या अधिक
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [गिट](https://www.ffmpeg.org/download.html)
- [गिट](https://git-scm.com/downloads)

## त्वरित सेटअप गाइड

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- [डिसॉर्डर डेवलपर पोर्टल](https://discord.com/developers/applications)पर जाएं
- **"नया एप्लिकेशन"** पर क्लिक करें और अपने बॉट को नाम दें और डिस्कॉर्ड नीति नियमों को स्वीकार करें।
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### एक बॉट सेट करें

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

- एक टर्मिनल लॉन्च करें और निम्न कमांड चलाएँ।

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- आप **कॉन्फ़िगरेशन** में `./source/config.js`में कुछ डेटा संशोधित कर सकते हैं

### फायरबेस सेट करें

- https://firebase.google.com/ पर जाएं और प्रोजेक्ट सेट करना शुरू करें।
- एक नई परियोजना जोड़ें और चरणों का पालन करें।
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- स्टोरेज डेटाबेस बनाने के लिए **पर जाएं > [रीयलटाइम डेटाबेस](https://console.firebase.google.com/u/0/project/_/database/data)** बनाएं।

### विकास करना

- फ़ाइल `.env.example` से `.env` का नाम बदलें और सभी आवश्यक मान डालें।
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## त्वरित समस्या निवारण

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- यदि आप पैकेज **सोडियम** स्थापित नहीं कर सकते हैं, तो इसके बजाय **लिबसोडियम-रैपर** स्थापित करें।

```bat
npm ffmpeg-स्थिर @ नवीनतम स्थापित करें --save
```

- यदि आप अपना संगीत नहीं चला सकते हैं या संगीत प्लेबैक आदेश काम नहीं करते हैं, तो [ffmpeg](https://ffmpeg.org/download.html) **(अनुशंसित)** स्थापित करें या **ffmpeg-स्थैतिक** पैकेज स्थापित करें और पुनः प्रयास करें।

```bat
npm ffmpeg-स्थिर @ नवीनतम स्थापित करें --save
```

## अनुवाद में सुधार करें

और कई अन्य रोचक विशेषताएं...

## श्रेय

आप किसी मौजूदा भाषा या ऐसी भाषा का अनुवाद करने में हमारी मदद कर सकते हैं जो वर्तमान में [Crowdin](https://crowdin.com/project/shioru-bot)पर उपलब्ध नहीं है।

अपने इन अद्भुत कार्यों के उपयोग की अनुमति देने के लिए सभी मूल रचनाकारों को धन्यवाद।

## एक समस्या मिली

अवतार आरेखण द्वारा: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
