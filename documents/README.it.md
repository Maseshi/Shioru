<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/apple-icon.png" width="100" style="border-radius: 100%;" />
  <strong>
    <h1>Shioru</h1>
    <p>เลขาส่วนตัวใน Discord ที่จะช่วยทำให้กิลด์ของคุณน่าอยู่ยิ่งขึ้น</p>
  </strong>
  <img src="https://img.shields.io/badge/discord.js-14-blue?logo=discord&logoColor=white
  " />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru?logo=github
  " />
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json&query=status.indicator&logo=google-cloud&logoColor=white&label=status&link=https%3A%2F%2Fshioru.statuspage.io%2F
  " />
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="Codice Fattore" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="Codice Fattore" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

เลขาส่วนตัวที่ดีที่สุดของคุณจะช่วยให้กิลด์ของคุณดูมีชีวิตชีวามากขึ้น เธอสามารถทำสิ่งต่าง ๆ ได้หลายอย่างซึ่งคุณสามารถดูรายละเอียดข้อมูลของคำสั่งทั้งหมด ได้ง่าย ๆ โดยพิมพ์ `/help`

<div align="center">
  <a href="https://shiorus.web.app/invite">
    <img src="https://img.shields.io/badge/Invite_Bot-_?style=for-the-badge&logo=discord&logoColor=white&color=blue
    " />
  </a>
</div>

## ✨ คุณสมบัติเด่น

- Funziona su [Discord.js](https://discord.js.org/) v14.
- In grado di personalizzare una varietà di elementi desiderati
- La musica può essere riprodotta da [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) e [SoundCloud](https://soundcloud.com/) con riproduzione automatica.
- Supporta più lingue Puoi controllare le lingue supportate da[file di lingua](https://github.com/Maseshi/shioru/blob/main/source/languages)di questo repository.
- Sistema a livelli (livello ed esperienza)
- Supporto per la personalizzazione delle notifiche del server
- Puoi parlare digitando `@Shioru` seguito dal messaggio che vuoi comunicare.
- È possibile utilizzare il comando dell'applicazione (/).
- จำลองระบบฐานข้อมูลสำหรับทดสอบ
- รองรับการทำงานบน Shard

e molte altre caratteristiche interessanti...

## 🧩 ข้อกำหนดเบื้องต้น

- [Node.js](https://nodejs.org/) v20.6.0 หรือมากกว่า
- [Python](https://www.python.org/downloads/) v3.8.0 หรือมากกว่า
- [Java](https://www.oracle.com/java/technologies/downloads/) v11.0.0 หรือมากกว่า
- [Firebase Tools](https://firebase.google.com/docs/cli)
- [Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## ⌛ การติดตั้ง

### 1. ติดตั้ง **Build Tools**

ทำการติดตั้ง **Build tools** โดยรันคำสั่งดังต่อไปนี้ตามระบบปฏิบัติการของคุณ

- สำหรับระบบปฏิบัติการ Linux และ MacOS

  ```sh
  sudo apt update
  sudo apt install build-essential
  ```

- สำหรับระบบปฏิบัติการ Windows
  ```sh
  npm install --global --production --add-python-to-path windows-build-tools
  ```

> [!TIP] คุณสามารถข้ามขั้นตอนนี้โดยการติ๊กตัวเลือก **Automatically install the necessary tools.** ผ่านตัวติดตั้ง Node.js ดังภาพต่อไปนี้
>
> ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

### 2. โคลนบอทและติดตั้งส่วนประกอบ

- Avvia un terminale ed esegui il seguente comando.
  ```bat
  git clone https://github.com/Maseshi/Shioru.git
  cd Shioru
  npm install
  ```
- Rinominare il file `.env.example` in `.env` e inserire tutti i valori necessari.

> [!NOTE] คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ [./source/configs/data.js](../source/configs/data.js)

### 3. ตั้งค่าบอทและเชิญเข้าร่วม

- Vai a [Portale per sviluppatori Discord](https://discord.com/developers/applications)
- Fai clic su **"Nuova applicazione"** e dai un nome al tuo bot e accetta le regole della politica di Discord.
- Vai alla pagina **"Bot"** e abilita tutte le opzioni nella sezione **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในแถบที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 4. ตั้งค่าฐานข้อมูล

- Vai su https://firebase.google.com/ e inizia a configurare il progetto.
- Aggiungi un nuovo progetto e segui i passaggi.
- Aggiungi la tua prima applicazione con **Sito web** Assegna un nome facoltativo alla tua app **"Imposta anche Firebase Hosting per questa app"** e registra l'app. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env`
- Vai a **crea > [database in tempo reale](https://console.firebase.google.com/u/0/project/_/database/data)** per creare un database di archiviazione.

## 🪛 การพัฒนา

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดพัฒนา**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run dev`

> [!NOTE] เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## ☕ จำลอง

ทดสอบการใช้งานจริงด้วยการทำงานที่คล้ายกับการใช้งานจริง โดยระบบจะคำนวณการแยกเศษของการทำงานตามจำนวนของกิลด์โดยอัตโนมัติ

- เปิดเทอร์มินัลแล้วรัน `npm run emulators` เพื่อจำลองระบบฐานข้อมูลใน**โหมดจำลอง**
- เปิดเทอร์มินัลหน้าใหม่แล้วรันคำสั่ง `npm run serve`

> [!NOTE] คุณจะเข้าสู่โหมดการพัฒนาโดยอัตโนมัติเนื่องจากเป็นการจำลองการใช้งานจริง ทำให้คุณสมบัติบางอย่างอาจไม่ทำงาน

## 🍵 ใช้งานจริง

สำหรับการใช้งานจริงสามารถใช้คำสั่งหรือชุดคำสั่งที่เตรียมไว้ได้ตามปกติ ดังนี้:

- บน Linux หรือ MacOS

  ```sh
  # with command file (recommend)

  sh start.sh || sudo sh start.sh

  # or with call command

  npm start
  ```

- บน Windows

  ```bat
  @REM with command file (recommend)

  ./start.bat

  @REM or with call command

  npm start
  ```

### 🐳 ทำงานบน Docker

การดำเนินการนี้จำเป็นต้องมี [Docker](https://www.docker.com/products/docker-desktop/)

- ใช้คำสั่ง `npm run docker:build` แล้วรอให้ทำงานเสร็จทั้งหมด
- จากนั้นเปิดโปรแกรม Docker แล้วสั่งรันพร้อมกับใส่ข้อมูลสภาพแวดล้อมที่จำเป็น (env) หรือใช้คำสั่ง `npm run docker:run` แล้วรอจนบอททำงาน

> [!TIP] คุณสามารถตรวจสอบการทำงานได้โดยใช้คำสั่ง `docker ps -a`

## ⚡ แก้ไขปัญหาอย่างรวดเร็ว

- `gyp ERR! stack Error: not found: make`

  ปัญหานี้อาจเกิดจาก **Build Tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขปัญหานี้ให้ดูที่ส่วน[การติดตั้ง Build Tools](#1-ติดตั้ง-build-tools)

- `GrpcConnection RPC 'Write' stream 0x58a118ce error. Code: 14 Message: 14 UNAVAILABLE: No connection established. Last error: connect ECONNREFUSED 127.0.0.1:8080`

  เป็นไปได้ว่าคุณยังไม่ได้จำลองระบบฐานข้อมูลบนเครื่องในโหมดทดสอบ โดยคุณสามารถแก้ปัญหานี้ได้โดยปิดบอทแล้วรันคำสั่งดังนี้ในอีกหน้าหนึ่ง

  ```bat
  npm run emulators
  ```

## 🌐 ปรับปรุงการแปลภาษา

Puoi aiutarci a tradurre una lingua esistente o una lingua che non è attualmente disponibile su [Crowdin](https://crowdin.com/project/shioru-bot).

## ⚠️ พบปัญหา

หากคุณพบปัญหาใดๆ จากการทำงานปัจจุบันของคุณ คุณสามารถแจ้งให้เราทราบได้ผ่านแท็บ [issues](https://github.com/Maseshi/Shioru/issues) ของพื้นที่เก็บนี้ได้
