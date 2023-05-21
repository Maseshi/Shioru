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
  <a title="Trạng thái" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="đám đông" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[VI](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [GIÀ](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Trợ lý máy chủ tốt của bạn sẽ giúp máy chủ của bạn trông sinh động hơn. Cô ấy có thể làm nhiều việc mà bạn có thể tìm thấy thông tin chi tiết của các lệnh khác nhau bằng cách gõ `/help` Bạn có thể mời Shioru tham gia máy chủ của mình từ[tại đây](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Đặc trưng

- Hoạt động trên [Discord.js](https://discord.js.org/) v14.
- Có thể tùy chỉnh nhiều mục mong muốn
- Có thể phát nhạc từ [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) và [SoundCloud](https://soundcloud.com/) với tính năng phát lại tự động.
- Hỗ trợ nhiều ngôn ngữ Bạn có thể kiểm tra các ngôn ngữ được hỗ trợ từ các tệp[ngôn ngữ](https://github.com/Maseshi/shioru/blob/main/source/languages)của kho lưu trữ này.
- Hệ thống bậc (trình độ và kinh nghiệm)
- Hỗ trợ tùy chỉnh thông báo máy chủ
- Bạn có thể nói chuyện bằng cách nhập `@Shioru` theo sau là tin nhắn bạn muốn liên lạc.
- Lệnh ứng dụng (/) có thể được sử dụng.

và nhiều tính năng thú vị khác...

## Cải thiện bản dịch

Bạn có thể giúp chúng tôi dịch một ngôn ngữ hiện có hoặc một ngôn ngữ hiện không khả dụng tại [Crowdin](https://crowdin.com/project/shioru-bot).

## điều kiện tiên quyết

- [Node.js](https://nodejs.org/) v18.0.0 trở lên
- [Firebase](https://firebase.google.com/) v9.0.0 trở lên
- [Git](https://git-scm.com/downloads)

## Hướng dẫn cài đặt nhanh

### Bắt đầu

- Chuyển đến [Cổng thông tin dành cho nhà phát triển Discord](https://discord.com/developers/applications)
- Nhấp vào **"Ứng dụng mới"** và đặt tên cho bot của bạn và chấp nhận các quy tắc của chính sách Discord.
- Chuyển đến trang **"Bot"** và bật tất cả các tùy chọn trong phần **Mục đích cổng đặc quyền** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Mời bot của bạn vào máy chủ bằng cách truy cập trang **OAuth2 > Trình tạo URL** chọn `bot` và `ứng dụng.lệnh` chọn `Quản trị viên` sau đó sao chép liên kết và dán vào địa chỉ trình duyệt của bạn. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Thiết lập bot

- Khởi chạy một thiết bị đầu cuối và chạy lệnh sau.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm cài đặt --save
```

- Bạn có thể sửa đổi một số dữ liệu trong **config** at `./source/config.js`

### Thiết lập căn cứ hỏa lực

- Truy cập https://firebase.google.com/ và bắt đầu thiết lập dự án.
- Thêm một dự án mới và làm theo các bước.
- Thêm ứng dụng đầu tiên của bạn với **Trang web** Đặt tên cho ứng dụng của bạn tùy chọn **"Cũng thiết lập Dịch vụ lưu trữ Firebase cho ứng dụng này"** và đăng ký ứng dụng. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase sẽ cung cấp cho bạn thông tin về cấu hình. Áp dụng các giá trị này cho tệp `.env.example`
- Đến **tạo > [cơ sở dữ liệu thời gian thực](https://console.firebase.google.com/u/0/project/_/database/data)** để tạo cơ sở dữ liệu lưu trữ.

### phát triển

- Đổi tên tệp `.env.example` thành `.env` và chèn tất cả các giá trị cần thiết.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Khắc phục sự cố nhanh

- Nếu bạn không thể cài đặt gói **sodium** , hãy cài đặt **libsodium-wrappers** để thay thế.
```bat
npm gỡ cài đặt natri
npm cài đặt libsodium-wrappers@latest --save
```
- Nếu bạn không thể phát nhạc hoặc các lệnh phát lại nhạc không hoạt động, hãy cài đặt [ffmpeg](https://ffmpeg.org/download.html) **(recommended)** hoặc cài đặt gói **ffmpeg-static** và thử lại.
```bat
npm cài đặt ffmpeg-static@latest --save
```

## tín dụng

Cảm ơn tất cả những người sáng tạo ban đầu đã cho phép sử dụng những tác phẩm tuyệt vời này của bạn.

Avatar vẽ bởi: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## tìm thấy một vấn đề

Nếu bạn gặp bất kỳ vấn đề từ công việc hiện tại của bạn Bạn có thể cho chúng tôi biết thông qua tab [vấn đề](https://github.com/Maseshi/Shioru/issues) của kho lưu trữ này.
