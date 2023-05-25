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

Seu bom assistente de servidor ajudará seu servidor a parecer mais animado. Ela pode fazer muitas coisas que você pode encontrar informações detalhadas de diferentes comandos digitando `/help` Você pode convidar Shioru para se juntar ao seu servidor de[aqui](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

<div align="center">
  <a href="https://github.com/Maseshi/Shioru/tree/main/documents">
    </img>
  </a>
</div>

## Características

- Funciona em [Discord.js](https://discord.js.org/) v14.
- Capaz de personalizar uma variedade de itens desejados
- A música pode ser reproduzida de [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) e [SoundCloud](https://soundcloud.com/) com reprodução automática.
- รองรับหลายภาษา ซึ่งคุณสามารถตรวจสอบภาษาที่รองรับได้จาก[ไฟล์ภาษา](https://github.com/Maseshi/Shioru/blob/main/source/configs/languages.json)ของที่เก็บนี้
- Sistema de camadas (nível e experiência)
- Suporte para personalização de notificação do servidor
- Você pode falar digitando `@Shioru` seguido da mensagem que deseja comunicar.
- O comando de aplicativo (/) pode ser usado.

และคุณสมบัติที่น่าสนใจอื่นๆ อีกมากมาย...

## ปรับปรุงการแปล

คุณสามารถช่วยเราแปลภาษาที่มีอยู่หรือภาษาที่ยังไม่พร้อมใช้งานในขณะนี้ได้ที่ [Crowdin](https://crowdin.com/project/shioru).

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18.0.0 ou superior
- [Firebase](https://firebase.google.com/) v9.0.0 ou superior
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [Git](https://git-scm.com/downloads)

## Guia de configuração rápida

### iniciar

- Ir para [Discord Developer Portal](https://discord.com/developers/applications)
- Clique em **"Novo aplicativo"** , nomeie seu bot e aceite as regras da política do Discord.
- Vá para a página **"Bot"** e habilite todas as opções na seção **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Convide seu bot para o servidor acessando a página **OAuth2 > URL Generator** selecione `bot` e `applications.commands` selecione `Administrador` depois copie o link e cole-o no endereço do seu navegador. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Configurar um bot

- Inicie um terminal e execute o seguinte comando.

```sh
# On Linux or Darwin operating systems, you may need to run this command.
sudo apt-get install autoconf automake g++ libtool build-essential
```

```bat
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- คุณสามารถแก้ไขข้อมูลบางอย่างใน **config** ที่ `./source/configs/data.js`

### Configurar o Firebase

- Acesse https://firebase.google.com/ e comece a configurar o projeto.
- Adicione um novo projeto e siga as etapas.
- Adicione seu primeiro aplicativo com **Site** Nomeie seu aplicativo opcionalmente **"Também configure o Firebase Hosting para este aplicativo"** e registre o aplicativo. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- O Firebase fornecerá informações sobre a configuração. Aplique esses valores ao arquivo `.env.example`
- Vá para **criar > [banco de dados em tempo real](https://console.firebase.google.com/u/0/project/_/database/data)** para criar um banco de dados de armazenamento.

### desenvolver

- Renomeie o arquivo `.env.example` para `.env` e insira todos os valores necessários.
- ไปที่เทอร์มินัลแล้วรันคำสั่ง `npm run dev` สำหรับการพัฒนาและ `npm start` สำหรับการใช้งานจริง > **หมายเหตุ**: เมื่ออยู่ในโหมดพัฒนา คุณสมบัตบางอย่างอาจไม่ทำงาน

## Solução rápida de problemas

- Se você não conseguir instalar o pacote **sódio** , instale **libsodium-wrappers** em vez disso.
```bat
npm desinstalar sódio
npm instalar libsodium-wrappers@latest --save
```
- หากคุณไม่สามารถเล่นเพลงหรือคำสั่งเล่นเพลงไม่ทำงาน ให้ติดตั้ง [FFmpeg](https://ffmpeg.org/download.html) **(แนะนำ)** หรือติดตั้งแพ็คเกจ **ffmpeg-static** แล้วลองใหม่อีกครั้ง
```bat
npm install ffmpeg-static@latest --save
```

## crédito

Obrigado a todos os criadores originais por permitirem o uso dessas suas maravilhosas obras.

Desenho de avatar por: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## encontrou um problema

Se você encontrar quaisquer problemas do seu trabalho atual Você pode nos informar através da guia [edição](https://github.com/Maseshi/Shioru/issues) deste repositório.
