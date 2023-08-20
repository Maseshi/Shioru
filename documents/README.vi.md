<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <strong>
    <h1>Shioru</h2>
    <p>Trợ lý trong máy chủ Discord của bạn sẽ giúp máy chủ của bạn trở thành một nơi tốt hơn để ở lại.</p>
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
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[Thay đổi ngôn ngữ](https://github.com/Maseshi/Shioru/tree/main/documents)

Trợ lý máy chủ giỏi của bạn sẽ giúp máy chủ của bạn trông sinh động hơn. Cô ấy có thể làm một số việc, bạn có thể xem thông tin chi tiết cho các lệnh bằng cách gõ `/help`.

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Tính năng nổi bật

- Dựa trên [Discord.js](https://discord.js.org/) v14
- Một loạt các tùy chỉnh có thể được thực hiện.
- Có thể phát nhạc từ [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) và [SoundCloud](https://soundcloud.com/), với tính năng phát lại tự động.
- Hỗ trợ nhiều ngôn ngữ, bạn có thể kiểm tra ngôn ngữ được hỗ trợ từ [tệp ngôn ngữ](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json) của repository này.
- Hệ thống cấp bậc (cấp độ và kinh nghiệm)
- Hỗ trợ tùy chỉnh thông báo máy chủ
- Bạn có thể trò chuyện bằng cách gõ `@Shioru` theo sau là tin nhắn bạn muốn gửi.
- Có thể sử dụng các lệnh ứng dụng (/)

Và nhiều tính năng thú vị khác...

## Điều kiện tiên quyết

- [Node.js](https://nodejs.org/) v18.0.0 hoặc cao hơn
- [Python](https://www.python.org/downloads/) v2.0.0 hoặc cao hơn
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Hướng dẫn cài đặt nhanh

Đã thử nghiệm trên các hệ thống Mac, Linux và Windows

### Thêm bot vào máy chủ.   

- Đi đến trang [Discord Developer Portal](https://discord.com/developers/applications)
- Nhấn **"New Application"** và đặt tên cho bot của bạn và chấp nhận các quy tắc chính sách Discord.
- Đến trang **"Bot"** và bật tất cả các tùy chọn trong phần **Privileged Gateway Intents**.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Mời bot của bạn vào máy chủ bằng cách đi đến trang **OAuth2 > URL Generator**, lựa chọn `bot` và `applications.commands` và lựa chọn `Administrator`.
Sau đó sao chép liên kết và dán nó vào địa chỉ trình duyệt của bạn.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Thiết lập bot

- Vì chúng ta sử dụng [sodium](https://www.npmjs.com/package/sodium) để mã hóa và giải mã, chúng ta cần cài đặt các thành phần bổ sung sau:

```bat
@REM Trên Windows
npm install -g windows-build-tools
```
```sh
# Trên MacOS (Darwin)
brew install libtool autoconf automake
```
```sh
# Trên Linux
sudo apt-get install libtool-bin
```

- Khởi chạy terminal và chạy những lệnh sau.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- Bạn có thể sửa một số dữ liệu trong **config** ở `./source/configs/data.js`.

### Cài đặt Firebase

- Đi đến https://firebase.google.com/ và bắt đầu thiết lập dự án.
- Thêm một dự án mới và thực hiện các bước.
- Thêm ứng dụng đầu tiên của bạn là **Website**, đặt tên ứng dụng của bạn mà không chọn **"Also set up Firebase Hosting for this app."** và đăng kí ứng dụng.
  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase sẽ cung cấp cho bạn thông tin về cấu hình. Áp dụng các giá trị này cho tập tin `.env.example`.
- Đi đến **Build > [Realtime Database](https://console.firebase.google.com/u/0/project/_/database/data)** để tạo cơ sở dữ liệu để lưu trữ dữ liệu.

### Phát triển

- Đổi tên tập tin `.env.example` thành `.env` và thêm tất cả giá trị.
- Đi đến terminal và chạy `npm run dev` cho chế độ phát triển (development) và `npm start` cho chế độ cung cấp (production).
  > **LƯU Ý**: Khi bạn vào chế độ phát triển (development), một số tính năng có thể bị tắt, chẳng hạn như gửi thống kê, cập nhật dữ liệu, v.v.

## Xử lý sự cố nhanh

- Nếu bạn gặp sự cố trong quá trình cài đặt thành phần mà trên terminal cho biết `gyp ERR! stack Error: not found: make`. Sự cố này có thể do **build tool** không được cài đặt đúng cách hoặc chúng có thể chưa được cài đặt. Giải pháp là tải xuống phiên bản mới nhất của [Node.js](https://nodejs.org/) và đánh dấu vào phần này trong quá trình cài đặt.

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Nếu bạn không thế cài đặt gói **sodium**, cài đặt **libsodium-wrappers** thay thế.

```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```

- Nếu bạn không thể phát nhạc hoặc lệnh phát lại nhạc không hoạt động, hãy cài đặt [FFmpeg](https://ffmpeg.org/download.html) **(được khuyến nghị)** hoặc cài đặt gói **ffmpeg-static**. và thử lại

```bat
npm install ffmpeg-static@latest --save
```

## Cải thiện bản dịch

Bạn có thể giúp chúng tôi dịch các ngôn ngữ hiện có hoặc ngôn ngữ hiện không có sẵn trên [Crowdin](https://crowdin.com/project/shioru).

## Credits

Cảm ơn tất cả nhà sáng tạo gốc vì đã cho phép chúng tôi sử dụng những tác phẩm tuyệt vời này của bạn.

Bức vẽ cá nhân bởi: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## Tìm thấy vấn đề

Nếu bạn gặp bất kỳ vấn đề nào từ công việc hiện tại của mình, bạn có thể cho chúng tôi biết thông qua tab [issue](https://github.com/Maseshi/Shioru/issues) của repo này.
