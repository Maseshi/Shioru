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
  <a title="Trạng thái" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="đám đông" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[VI](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [GIÀ](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Đặc trưng

- Hoạt động trên [Discord.js](https://discord.js.org/) v14.
- Có thể tùy chỉnh nhiều mục mong muốn
- Có thể phát nhạc từ [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) và [SoundCloud](https://soundcloud.com/) với tính năng phát lại tự động.
- Hỗ trợ nhiều ngôn ngữ Bạn có thể kiểm tra các ngôn ngữ được hỗ trợ từ các tệp[ngôn ngữ](https://github.com/Maseshi/shioru/blob/main/source/languages)của kho lưu trữ này.
- Hệ thống bậc (trình độ và kinh nghiệm)
- Hỗ trợ tùy chỉnh thông báo máy chủ
- Bạn có thể nói chuyện bằng cách nhập `@Shioru` theo sau là tin nhắn bạn muốn liên lạc.
- Lệnh ứng dụng (/) có thể được sử dụng.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## Cải thiện bản dịch

và nhiều tính năng thú vị khác...

## điều kiện tiên quyết

- [Node.js](https://nodejs.org/) v18.0.0 trở lên
- [Firebase](https://firebase.google.com/) v9.0.0 trở lên
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Hướng dẫn cài đặt nhanh

### Bắt đầu

- Chuyển đến [Cổng thông tin dành cho nhà phát triển Discord](https://discord.com/developers/applications)
- Nhấp vào **"Ứng dụng mới"** và đặt tên cho bot của bạn và chấp nhận các quy tắc của chính sách Discord.
- ไปที่หน้า **"Bot"** และเปิดใช้งานตัวเลือกทั้งหมดในส่วน **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- เชิญบอทของคุณไปที่เซิร์ฟเวอร์โดยไปที่หน้า **OAuth2 > URL Generator** เลือก `bot` และ `applications.commands` เลือก `Administrator` จากนั้นคัดลอกลิงก์และวางในที่อยู่ของเบราว์เซอร์ของคุณ ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Thiết lập bot

- Khởi chạy một thiết bị đầu cuối và chạy lệnh sau.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm cài đặt --save
```

- Bạn có thể sửa đổi một số dữ liệu trong **config** at `./source/config.js`

### Thiết lập căn cứ hỏa lực

- Truy cập https://firebase.google.com/ và bắt đầu thiết lập dự án.
- Thêm một dự án mới và làm theo các bước.
- เพิ่มแอปพลิเคชันแรกของคุณด้วย **เว็บไซต์** ตั้งชื่อแอปของคุณโดยไม่จำเป็นต้องเลือกตัวเลือก **"ตั้งค่า Firebase Hosting สำหรับแอปนี้ด้วย"** และลงทะเบียนแอป ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase จะให้ข้อมูลเกี่ยวกับการกำหนดค่าแก่คุณ นำค่าเหล่านี้ไปใช้กับไฟล์ `.env.example`
- Đến **tạo > [cơ sở dữ liệu thời gian thực](https://console.firebase.google.com/u/0/project/_/database/data)** để tạo cơ sở dữ liệu lưu trữ.

### phát triển

- Đổi tên tệp `.env.example` thành `.env` và chèn tất cả các giá trị cần thiết.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Khắc phục sự cố nhanh

- Nếu bạn không thể cài đặt gói **sodium** , hãy cài đặt **libsodium-wrappers** để thay thế.
```bat
npm cài đặt ffmpeg-static@latest --save
```
- Nếu bạn không thể phát nhạc hoặc các lệnh phát lại nhạc không hoạt động, hãy cài đặt [ffmpeg](https://ffmpeg.org/download.html) **(recommended)** hoặc cài đặt gói **ffmpeg-static** và thử lại.
```bat
npm cài đặt ffmpeg-static@latest --save
```

## tín dụng

Bạn có thể giúp chúng tôi dịch một ngôn ngữ hiện có hoặc một ngôn ngữ hiện không khả dụng tại [Crowdin](https://crowdin.com/project/shioru-bot).

Cảm ơn tất cả những người sáng tạo ban đầu đã cho phép sử dụng những tác phẩm tuyệt vời này của bạn.

## tìm thấy một vấn đề

Avatar vẽ bởi: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)
