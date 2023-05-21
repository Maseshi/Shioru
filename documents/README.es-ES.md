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
  <a title="Estado" target="_blank" href="https://shioru.statuspage.io/">
    <img src="https://img.shields.io/badge/dynamic/json?logo=google-cloud&logoColor=white&label=status&query=status.indicator&url=https%3A%2F%2Fq60yrzp0cbgg.statuspage.io%2Fapi%2Fv2%2Fstatus.json" />
  </a>
  <a title="Crowdin" target="_blank" href="https://crowdin.com/project/shioru-bot">
    <img src="https://badges.crowdin.net/shioru-bot/localized.svg">
  </a>
  <a title="Factor de código" target="_blank" href="https://www.codefactor.io/repository/github/maseshi/shioru">
    <img src="https://www.codefactor.io/repository/github/maseshi/shioru/badge" alt="Factor de código" />
  </a>
  <a title="Top.gg" target="_blank" href="https://top.gg/bot/704706906505347183">
    <img src="https://top.gg/api/widget/upvotes/704706906505347183.svg">
  </a>
</div>

[ES](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [J](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Su buen asistente de servidor ayudará a que su servidor se vea más animado. Ella puede hacer muchas cosas de las cuales puedes encontrar información detallada de diferentes comandos escribiendo `/help` Puedes invitar a Shioru a unirse a tu servidor desde[aquí](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Características

- Funciona en [Discord.js](https://discord.js.org/) v14.
- Capaz de personalizar una variedad de elementos deseados
- La música se puede reproducir desde [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) y [SoundCloud](https://soundcloud.com/) con reproducción automática.
- Admite varios idiomas Puede consultar los idiomas admitidos desde[archivos de idioma](https://github.com/Maseshi/shioru/blob/main/source/languages)de este repositorio.
- sistema de niveles (nivel y experiencia)
- Soporte para la personalización de notificaciones del servidor
- Puede hablar escribiendo `@Shioru` seguido del mensaje que desea comunicar.
- Se puede utilizar el comando de aplicación (/).

y muchas otras características interesantes...

## Mejorar Traducir

Puede ayudarnos a traducir un idioma existente o un idioma que no está disponible actualmente en [Crowdin](https://crowdin.com/project/shioru-bot).

## requisitos previos

- [Node.js](https://nodejs.org/) v18.0.0 o superior
- [Firebase](https://firebase.google.com/) v9.0.0 o superior
- [Git](https://git-scm.com/downloads)

## Guía de configuración rápida

### Empezar

- Ir a [Portal de desarrolladores de Discord](https://discord.com/developers/applications)
- Haga clic en **"Nueva aplicación"** y asigne un nombre a su bot y acepte las reglas de la política de Discord.
- Vaya a la página **"Bot"** y habilite todas las opciones en la sección **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Invite a su bot al servidor yendo a la página **OAuth2 > Generador de URL** seleccione `bot` y `aplicaciones.comandos` seleccione `Administrador` luego copie el enlace y péguelo en la dirección de su navegador. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### configurar un bot

- Inicie una terminal y ejecute el siguiente comando.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Puede modificar algunos datos en **config** en `./source/config.js`

### Configurar base de fuego

- Vaya a https://firebase.google.com/ y comience a configurar el proyecto.
- Agrega un nuevo proyecto y sigue los pasos.
- Agregue su primera aplicación con **Sitio web** Asigne un nombre opcional a su aplicación **"Configure también Firebase Hosting para esta aplicación"** y registre la aplicación. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Firebase le proporcionará información sobre la configuración. Aplicar estos valores al archivo `.env.example`
- Vaya a **crear > [base de datos en tiempo real](https://console.firebase.google.com/u/0/project/_/database/data)** para crear una base de datos de almacenamiento.

### desarrollar

- Cambie el nombre del archivo `.env.example` a `.env` e inserte todos los valores necesarios.
- Vaya a la terminal y ejecute los comandos `npm run dev` para desarrollo y `npm start` para producción > **Nota**: en modo de desarrollo Es posible que algunas características no funcionen.

## Solución rápida de problemas

- Si no puede instalar el paquete **sodio** , instale **libsodium-wrappers** en su lugar.
```bat
npm desinstalar sodio
npm instalar libsodium-wrappers@latest --save
```
- Si no puede reproducir su música o los comandos de reproducción de música no funcionan, instale [ffmpeg](https://ffmpeg.org/download.html) **(recomendado)** o instale el paquete **ffmpeg-static** y vuelva a intentarlo.
```bat
npm install ffmpeg-static@latest --save
```

## crédito

Gracias a todos los creadores originales por permitir el uso de estas maravillosas obras suyas.

Dibujo de avatar por: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## encontró un problema

Si encuentra algún problema de tu trabajo actual Puedes hacérnoslo saber a través de la pestaña [número](https://github.com/Maseshi/Shioru/issues) de este repositorio.
