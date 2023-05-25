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
  <a title="상태" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="크라우딘" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="탑.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

당신의 좋은 서버 도우미는 당신의 서버가 더 활기차게 보이도록 도와줄 것입니다. 그녀는 `/help` 여기[에서 서버에 가입하도록 Shioru를 초대할 수 있습니다](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## 특징

- [Discord.js](https://discord.js.org/) v14에서 작동합니다.
- 원하는 다양한 아이템 커스터마이징 가능
- 자동 재생 기능이 있는 [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) 및 [SoundCloud](https://soundcloud.com/) 에서 음악을 재생할 수 있습니다.
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- 계층 시스템 (레벨과 경험치)
- 서버 알림 사용자 정의 지원
- `@Shioru` 다음에 전달하고 싶은 메시지를 입력하여 대화할 수 있습니다.
- 응용 명령어(/)를 사용할 수 있습니다.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ปรับปรุงการแปล

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## 전제 조건

- [Node.js](https://nodejs.org/) v18.0.0 이상
- [Firebase](https://firebase.google.com/) v9.0.0 이상
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## 빠른 설정 가이드

### 시작하다

- Discord 개발자 포털로 이동
- **"새 애플리케이션"** 클릭하고 봇에 이름을 지정하고 Discord 정책 규칙을 수락합니다.
- 페이지 **"Bot"** 로 이동하여 섹션 **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- 페이지 **OAuth2 > URL 생성기** 선택 `봇` 및 `applications.commands` 선택 `관리자` 로 이동하여 봇을 서버에 초대한 다음 링크를 복사하여 브라우저 주소에 붙여넣습니다. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### 봇 설정

- 터미널을 실행하고 다음 명령을 실행합니다.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm 설치 --save
```

- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/configs/data.js`

### Firebase 설정

- https://firebase.google.com/으로 이동하여 프로젝트 설정을 시작합니다.
- 새 프로젝트를 추가하고 단계를 따릅니다.
- 웹사이트 **** 있는 첫 번째 애플리케이션을 추가합니다 **선택적으로 앱 이름** 지정합니다. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase에서 구성에 대한 정보를 제공합니다. 이 값을 파일 `.env.example`에 적용합니다.
- **create > [realtime database](https://console.firebase.google.com/u/0/project/_/database/data)** 로 이동하여 스토리지 데이터베이스를 생성합니다.

### 개발하다

- 파일 `.env.example` 의 이름을 `.env` 으로 바꾸고 필요한 모든 값을 삽입합니다.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## 빠른 문제 해결

- 패키지 **나트륨** 설치할 수 없는 경우 대신 **libsodium-wrappers** 을 설치하십시오.
```bat
npm 제거 나트륨
npm 설치 libsodium-wrappers@latest --save
```
- หากคุณไม่สามารถเล่นเพลงหรือคำสั่งเล่นเพลงไม่ทำงาน ให้ติดตั้ง [FFmpeg](https://ffmpeg.org/download.html) **(แนะนำ)** หรือติดตั้งแพ็คเกจ **ffmpeg-static** แล้วลองใหม่อีกครั้ง
```bat
npm 설치 ffmpeg-static@latest --저장
```

## 신용 거래

당신의 멋진 작품을 사용할 수 있도록 허락해주신 모든 오리지널 크리에이터들에게 감사드립니다.

아바타 작화: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## 문제를 발견

문제가 발생하면 현재 작업에서 이 저장소의 [issue](https://github.com/Maseshi/Shioru/issues) 탭을 통해 알려주실 수 있습니다.
