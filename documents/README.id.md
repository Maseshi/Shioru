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
  <a title="CodeFactor" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="CodeFactor" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[EN](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Asisten server Anda yang baik akan membantu server Anda terlihat lebih hidup. Dia dapat melakukan banyak hal dimana Anda dapat menemukan informasi detail dari berbagai perintah dengan mengetik `/help` Anda dapat mengundang Shioru untuk bergabung dengan server Anda dari[di sini](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Fitur

- Bekerja pada [Discord.js](https://discord.js.org/) v14.
- Mampu menyesuaikan berbagai item yang diinginkan
- Musik dapat diputar dari [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) dan [SoundCloud](https://soundcloud.com/) dengan pemutaran otomatis.
- Mendukung banyak bahasa Anda dapat memeriksa bahasa yang didukung di file[bahasa](https://github.com/Maseshi/shioru/blob/main/source/languages)dari repositori ini.
- Sistem bertingkat (tingkat dan pengalaman)
- Dukungan untuk kustomisasi pemberitahuan server
- Anda dapat berbicara dengan mengetikkan `@Shioru` diikuti dengan pesan yang ingin Anda komunikasikan.
- Perintah aplikasi (/) dapat digunakan.

dan masih banyak fitur menarik lainnya...

## Tingkatkan Terjemahan

Anda dapat membantu kami menerjemahkan bahasa yang ada atau bahasa yang saat ini tidak tersedia di [Crowdin](https://crowdin.com/project/shioru-bot).

## Prasyarat

- [Node.js](https://nodejs.org/) v18.0.0 atau lebih tinggi
- [Firebase](https://firebase.google.com/) v9.0.0 atau lebih tinggi
- [Git](https://git-scm.com/downloads)

## Panduan Pengaturan Cepat

### Memulai

- Pergi ke [Portal Pengembang Perselisihan](https://discord.com/developers/applications)
- Klik **"Aplikasi Baru"** dan beri nama bot Anda dan terima aturan kebijakan Discord.
- Buka halaman **"Bot"** dan aktifkan semua opsi di bagian **Intent Gateway Privileged** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Undang bot Anda ke server dengan masuk ke halaman **OAuth2 > Generator URL** pilih `bot` dan `aplikasi.perintah` pilih `Administrator` lalu salin tautan dan tempel di alamat browser Anda. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Siapkan bot

- Luncurkan terminal dan jalankan perintah berikut.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm instal --save
```

- Anda dapat memodifikasi beberapa data di **config** di `./source/config.js`

### Siapkan Firebase

- Buka https://firebase.google.com/ dan mulai menyiapkan proyek.
- Tambahkan proyek baru dan ikuti langkah-langkahnya.
- Tambahkan aplikasi pertama Anda dengan **Situs web** Beri nama aplikasi Anda secara opsional **"Siapkan juga Firebase Hosting untuk aplikasi ini"** dan daftarkan aplikasi. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase akan memberi Anda informasi tentang konfigurasi. Terapkan nilai-nilai ini ke file `.env.example`
- Buka **buat > [basis data waktu nyata](https://console.firebase.google.com/u/0/project/_/database/data)** untuk membuat basis data penyimpanan.

### mengembangkan

- Ganti nama file `.env.example` menjadi `.env` dan masukkan semua nilai yang diperlukan.
- Buka terminal dan jalankan perintah `npm run dev` untuk pengembangan dan `npm start` untuk produksi > **Catatan**: Saat dalam mode pengembangan Beberapa fitur mungkin tidak berfungsi.

## Pemecahan Masalah Cepat

- Jika Anda tidak dapat menginstal package **sodium** , instal **libsodium-wrappers** sebagai gantinya.
```bat
npm uninstall sodium
npm install libsodium-wrappers@latest --save
```
- Jika Anda tidak dapat memutar musik atau perintah pemutaran musik tidak berfungsi, instal [ffmpeg](https://ffmpeg.org/download.html) **(disarankan)** atau instal paket **ffmpeg-static** dan coba lagi.
```bat
npm instal ffmpeg-static@latest --save
```

## kredit

Terima kasih kepada semua pencipta asli yang mengizinkan penggunaan karya-karya Anda yang luar biasa ini.

Gambar avatar oleh: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## menemukan masalah

Jika Anda menemui masalah dari pekerjaan Anda saat ini Anda dapat memberi tahu kami melalui tab [edisi](https://github.com/Maseshi/Shioru/issues) repositori ini.
