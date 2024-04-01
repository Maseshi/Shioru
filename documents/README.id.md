<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <strong>
    <h1>Shioru</h2>
    <p>Asisten bawaan server Discord akan membantu Anda menjadikan server Anda tempat yang lebih baik</p>
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

[Ubah bahasa](https://github.com/Maseshi/Shioru/tree/main/documents)

Asisten peladen yang baik akan membantu peladen Anda terlihat lebih hidup. Dia dapat melakukan banyak hal, yang dapat Anda lihat secara detail dengan mengetik `/help`. Anda dapat mengundang Shioru ke server Anda dari [sini](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you).

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## Fitur-fitur

- Bekerja pada [Discord.js](https://discord.js.org/) v14.
- Mampu menyesuaikan berbagai item yang diinginkan
- Musik dapat diputar dari [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) dan [SoundCloud](https://soundcloud.com/) dengan pemutaran otomatis.
- Mendukung banyak bahasa Anda dapat memeriksa bahasa yang didukung di file[bahasa](https://github.com/Maseshi/shioru/blob/main/source/languages)dari repositori ini.
- Sistem bertingkat (tingkat dan pengalaman)
- Dukungan untuk kustomisasi pemberitahuan server
- Anda dapat berbicara dengan mengetikkan `@Shioru` diikuti dengan pesan yang ingin Anda komunikasikan.
- Perintah aplikasi (/) dapat digunakan.

dan banyak fitur menarik lainnya...

## Prasyarat

- [Node.js](https://nodejs.org/) v18.0.0 atau lebih tinggi
- [Python](https://www.python.org/downloads/) v2.0.0 atau lebih tinggi
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Panduan Pengaturan Cepat

Diuji pada sistem Mac, Linux, dan Windows.

### Tambahkan bot ke server

- Buka [Portal Pengembang Discord](https://discord.com/developers/applications)
- Klik **"Aplikasi Baru"** dan beri nama bot Anda dan setujui aturan kebijakan Discord
- Buka halaman **"Bot"** dan aktifkan semua opsi di bagian "Bot". **Maksud Gerbang Khusus** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Undang bot Anda ke server dengan membuka halaman **OAuth2 > URL Generator**, pilih `bot` dan `applications.commands` lalu pilih `. Administrator` lalu salin tautan dan tempelkan di alamat peramban Anda. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Siapkan bot

Karena kami menggunakan [natrium](https://www.npmjs.com/package/sodium) dalam penyandian dan pengodean, maka kami perlu menginstal komponen tambahan berikut ini:

```bat
@REM pada Windows
npm install -g windows-build-tools
```
```sh
# Di MacOS (Darwin)
brew install libtool autoconf automake
```
```sh
# Di Linux
sudo apt-get instal libtool-bin
```

- Luncurkan terminal dan jalankan perintah berikut.

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- Anda dapat memodifikasi beberapa data di **config** di `./source/config.js`

### Siapkan Firebase

- Buka https://firebase.google.com/ dan mulailah menyiapkan proyek Anda.
- Tambahkan proyek baru dan ikuti langkah-langkahnya.
- Tambahkan juga aplikasi pertama Anda. **Situs Web** Beri nama aplikasi Anda tanpa perlu memilih opsi **"Siapkan Firebase Hosting untuk aplikasi ini"** dan daftarkan aplikasi. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase akan memberi Anda informasi tentang konfigurasinya. Terapkan nilai-nilai ini pada berkas. `.env.example`
- Buka **Create > [Real-time database](https://console.firebase.google.com/u/0/project/_/database/data)** Untuk membuat database untuk menyimpan data.

### mengembangkan

- Ganti nama file `.env.example` menjadi `.env` dan masukkan semua nilai yang diperlukan.
- Buka terminal dan jalankan perintah `npm run dev` untuk pengembangan dan `npm start` untuk produksi. > **Catatan**: Saat Anda memasuki mode pengembangan. Beberapa fitur mungkin dinonaktifkan, seperti mengirim statistik, memperbarui data, dll.

## Pemecahan Masalah Cepat

- Jika Anda mengalami masalah selama instalasi komponen di mana pada terminal tertulis `gyp ERR! stack Error: not found: make` Masalah ini mungkin disebabkan oleh **Build tools** yang tidak terinstal dengan benar atau mungkin belum terinstal. Solusinya adalah mengunduh versi terbaru. [Node.js](https://nodejs.org/) dan periksa bagian ini dalam proses instalasi.

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- Jika Anda tidak dapat menginstal package **sodium** , instal **libsodium-wrappers** sebagai gantinya.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Jika Anda tidak dapat memutar musik atau perintah pemutaran musik tidak berfungsi, instal [FFmpeg](https://ffmpeg.org/download.html) **(Disarankan)** atau instal paket. **ffmpeg-static** dan coba lagi.
```bat
npm instal ffmpeg-static@latest --save
```

## Meningkatkan terjemahan

Anda dapat membantu kami menerjemahkan bahasa yang sudah ada atau bahasa yang saat ini belum tersedia di [Crowdin](https://crowdin.com/project/shioru).

## Kontributor

Terima kasih kepada semua pencipta asli yang telah mengizinkan penggunaan karya-karya yang luar biasa ini.

Gambar avatar oleh: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## menemukan masalah

Jika Anda mengalami masalah dalam pekerjaan Anda saat ini, Anda dapat memberi tahu kami melalui tab [masalah](https://github.com/Maseshi/Shioru/issues) pada repositori ini.
