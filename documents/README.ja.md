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
  <a title="クラウディン" target="_blank" href="https://crowdin.com/project/shioru">
    <img src="https://badges.crowdin.net/shioru/localized.svg" />
  </a>
  <a title="コードファクター" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="コードファクター" />
  </a>
  <a title="トップ.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg" />
  </a>
</div>

[เปลี่ยนภาษา](https://github.com/Maseshi/Shioru/tree/main/documents)

優れたサーバー アシスタントは、サーバーをより活発に見せるのに役立ちます。 彼女ができることはたくさんあり、詳細なコマンドは `/help` を入力して見つけることができます [ここ](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you">
    <img src="https://img.shields.io/badge/Invite_Bot-1967D2?logo=discord&logoColor=white&style=for-the-badge" />
  </a>
</div>

## 特徴

- [Discord.js](https://discord.js.org/) v14 で動作します。
- ご希望の様々なアイテムをカスタマイズ可能
- 両方から音楽を再生できます [YouTube](https://www.youtube.com/)、[Spotify](https://www.spotify.com/)、[SoundCloud](https://soundcloud.com/)の再生システムを搭載。 音楽は自動的に再開します
- 複数の言語をサポート 対応言語は当リポジトリの【言語ファイル】(https://github.com/Maseshi/shioru/blob/main/source/languages)から確認できます。
- ティアシステム (レベルと経験)
- サーバー通知のカスタマイズのサポート
- `@Shioru`の後に伝えたいメッセージを入力すると、チャットできます。
- アプリケーションコマンド (/) が使用できます。

他にもたくさんの興味深い機能があります...

## 前提条件

- [Node.js](https://nodejs.org/) v18.0.0 以降
- [Python](https://www.python.org/downloads/) v2.0.0 หรือมากกว่า
- [Firebase](https://firebase.google.com/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## クイックセットアップガイド

ทดสอบแล้วบนระบบ Mac, Linux และ Windows

### เพิ่มบอทไปยังเซิร์ฟเวอร์

- [Discord Developer Portal](https://discord.com/developers/applications) に移動します。
- **"New Application"**をクリックしてボットに名前を付け、Discord ポリシー ルールに同意します。
- **"Bot"** ページに移動し、**Privileged Gateway Intent** セクションのすべてのオプションを有効にします。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- **OAuth2 > URL Generator** ページに移動し、`bot` と `applications.commands` を選択し、`Administrator` を選択してから、リンクをコピーしてブラウザのアドレスに貼り付けて、ボットをサーバーに招待します。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### ボットを設定する

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

- ターミナルを起動し、次のコマンドを実行します。

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install
```

- `./source/config.js` の **config** で一部の情報を編集できます。

### Firebase をセットアップする

- https://firebase.google.com/ にアクセスして、プロジェクトのセットアップを開始します。
- 新しいプロジェクトを追加し、手順に従います。
- 最初のアプリケーションを **ウェブサイト** に追加し、オプション **「このアプリの Firebase Hosting もセットアップする」** を選択せず​​にアプリに名前を付けて、アプリを登録します。 ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase は構成に関する情報を提供します。 これらの値をファイルに適用します。 `.env.example`
- **[作成] > [リアルタイム データベース](https://console.firebase.google.com/u/0/project/_/database/data)** に移動して、ストレージ データベースを作成します。

### 発展させる

- ファイルの名前を変更します `.env.example` を `.env` として、必要なすべての値を挿入します。
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่อคุณเข้าสู่โหมดการพัฒนา คุณลักษณะบางอย่างอาจถูกปิดใช้งาน เช่น การส่งสถิติ การอัปเดตข้อมูล เป็นต้น

## クイックトラブルシューティング

- หากคุณพบปัญหาระหว่างการติดตั้งคอมโพเนนต์ซึ่งบนเทอร์มินัลระบุว่า `gyp ERR! stack Error: not found: make` ปัญหานี้อาจเกิดจาก **Build tools** ติดตั้งไม่ถูกต้องหรืออาจยังไม่ได้ติดตั้ง วิธีแก้ไขคือดาวน์โหลดเวอร์ชันล่าสุดของ [Node.js](https://nodejs.org/) และทำเครื่องหมายที่ส่วนนี้ภายในขั้นตอนการติดตั้ง

  ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/node-js-tools-for-native-modules.png)

- **sodium** パッケージをインストールできない場合は、代わりに **libsodium-wrappers** をインストールしてください。

```bat
npm アンインストールナトリウム
npm インストール libsodium-wrappers@latest --save
```

- 音楽を再生できない、または音楽再生コマンドが機能しない場合は、[ffmpeg](https://ffmpeg.org/download.html) **(推奨)** をインストールするか、パッケージをインストールしてください。 **ffmpeg-static** して再試行してください。

```bat
npm install ffmpeg-static@latest --save
```

## 翻訳を改善する

既存の言語または現在 [Crowdin](https://crowdin.com/project/shioru-bot). で利用できない言語の翻訳にご協力ください。

## クレジット

これらの素晴らしい作品の使用を許可してくれたすべてのオリジナル クリエイターに感謝します。

アバターペイント: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## 問題が見つかりました

問題が発生した場合 現在の仕事から タブからお知らせください。 [issue](https://github.com/Maseshi/Shioru/issues) のリポジトリです。
