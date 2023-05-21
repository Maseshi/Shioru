<div align="center">
  <img src="https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/icons/favicon-circle.png" width="100" />
  <h1>
    <strong>Σιόρου</strong>
  </h1>
  <img src="https://img.shields.io/badge/discord.js-v14-7354F6?logo=discord&logoColor=white" />
  <img src="https://img.shields.io/github/stars/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/v/release/Maseshi/Shioru">
  <img src="https://img.shields.io/github/license/Maseshi/Shioru.svg?logo=github" />
  <img src="https://img.shields.io/github/last-commit/Maseshi/Shioru">
  <a title="Κατάσταση" target="_blank" href="https://shioru.statuspage.io/">
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

[EL](https://github.com/Maseshi/Shioru/blob/main/documents/README.en.md) | [TH](https://github.com/Maseshi/Shioru/blob/main/documents/README.th.md) | [JA](https://github.com/Maseshi/Shioru/blob/main/documents/README.ja.md)

Ο καλός βοηθός διακομιστή σας θα βοηθήσει τον διακομιστή σας να φαίνεται πιο ζωντανός. Μπορεί να κάνει πολλά πράγματα για τα οποία μπορείτε να βρείτε λεπτομερείς πληροφορίες για διαφορετικές εντολές πληκτρολογώντας `/help` Μπορείτε να προσκαλέσετε τη Shioru να συμμετάσχει στον διακομιστή σας από[εδώ](https://discord.com/api/oauth2/authorize?client_id=704706906505347183&permissions=8&scope=applications.commands%20bot&redirect_uri=https%3A%2F%2Fshiorus.web.app%2Fthanks-you)

## Χαρακτηριστικά

- Λειτουργεί σε [Discord.js](https://discord.js.org/) v14.
- Δυνατότητα προσαρμογής μιας ποικιλίας επιθυμητών αντικειμένων
- Μπορεί να αναπαραχθεί μουσική από [YouTube](https://www.youtube.com/), [Spotify](https://www.spotify.com/) και [SoundCloud](https://soundcloud.com/) με αυτόματη αναπαραγωγή.
- Υποστήριξη πολλαπλών γλωσσών Μπορείτε να ελέγξετε τις υποστηριζόμενες γλώσσες από αρχεία[γλώσσας](https://github.com/Maseshi/shioru/blob/main/source/languages)αυτού του αποθετηρίου.
- Σύστημα βαθμίδων (επίπεδο και εμπειρία)
- Υποστήριξη για προσαρμογή ειδοποιήσεων διακομιστή
- Μπορείτε να μιλήσετε πληκτρολογώντας `@Shioru` ακολουθούμενο από το μήνυμα που θέλετε να επικοινωνήσετε.
- Μπορεί να χρησιμοποιηθεί η εντολή εφαρμογής (/).

και πολλά άλλα ενδιαφέροντα χαρακτηριστικά...

## Βελτιώστε τη Μετάφραση

Μπορείτε να μας βοηθήσετε να μεταφράσουμε μια υπάρχουσα γλώσσα ή μια γλώσσα που δεν είναι προς το παρόν διαθέσιμη στο [Crowdin](https://crowdin.com/project/shioru-bot).

## Προαπαιτούμενα

- [Node.js](https://nodejs.org/) v18.0.0 ή νεότερη έκδοση
- [Firebase](https://firebase.google.com/) v9.0.0 ή νεότερη έκδοση
- [Git](https://git-scm.com/downloads)

## Οδηγός γρήγορης εγκατάστασης

### Ξεκίνα

- Μεταβείτε στο [Discord Developer Portal](https://discord.com/developers/applications)
- Κάντε κλικ στο **"Νέα εφαρμογή"** και ονομάστε το bot σας και αποδεχτείτε τους κανόνες της πολιτικής Discord.
- Μεταβείτε στη σελίδα **"Bot"** και ενεργοποιήστε όλες τις επιλογές στην ενότητα **Privileged Gateway Intent** ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-privileged-gateway-intents.png)
- Προσκαλέστε το bot σας στον διακομιστή μεταβαίνοντας στη σελίδα **OAuth2 > Δημιουργία URL** επιλέξτε `bot` και `applications.commands` επιλέξτε `Διαχειριστής` , στη συνέχεια αντιγράψτε τον σύνδεσμο και επικολλήστε τον στη διεύθυνση του προγράμματος περιήγησής σας. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/discord-developer-portal-scopes.png)

### Ρυθμίστε ένα bot

- Εκκινήστε ένα τερματικό και εκτελέστε την ακόλουθη εντολή.

```bash
git clone https://github.com/Maseshi/Shioru.git
cd Shioru
npm install --save
```

- Μπορείτε να τροποποιήσετε ορισμένα δεδομένα σε **config** at `./source/config.js`

### Ρυθμίστε το Firebase

- Μεταβείτε στη διεύθυνση https://firebase.google.com/ και ξεκινήστε τη ρύθμιση του έργου.
- Προσθέστε ένα νέο έργο και ακολουθήστε τα βήματα.
- Προσθέστε την πρώτη σας εφαρμογή με **Ιστότοπο** Ονομάστε την εφαρμογή σας προαιρετικά **"Επίσης, ρυθμίστε το Firebase Hosting για αυτήν την εφαρμογή"** και καταχωρήστε την εφαρμογή. ![](https://raw.githubusercontent.com/Maseshi/Shioru/main/assets/images/firebase-setup-web-application.png)
- Το Firebase θα σας παρέχει πληροφορίες σχετικά με τη διαμόρφωση. Εφαρμόστε αυτές τις τιμές στο αρχείο `.env.example`
- Μεταβείτε στο **δημιουργία > [βάσης δεδομένων σε πραγματικό χρόνο](https://console.firebase.google.com/u/0/project/_/database/data)** για να δημιουργήσετε μια βάση δεδομένων αποθήκευσης.

### αναπτύσσω

- Μετονομάστε το αρχείο `.env.example` σε `.env` και εισαγάγετε όλες τις απαραίτητες τιμές.
- Μεταβείτε στο τερματικό και εκτελέστε τις εντολές `npm run dev` για ανάπτυξη και `npm start` για παραγωγή > **Σημείωση**: Όταν βρίσκεται σε λειτουργία ανάπτυξης Ορισμένες λειτουργίες ενδέχεται να μην λειτουργούν.

## Γρήγορη αντιμετώπιση προβλημάτων

- Εάν δεν μπορείτε να εγκαταστήσετε το πακέτο **sodium** , εγκαταστήστε **libsodium-wrappers**.
```bat
npm απεγκατάσταση νατρίου
npm εγκατάσταση libsodium-wrappers@latest --save
```
- Εάν δεν μπορείτε να αναπαράγετε τη μουσική σας ή οι εντολές αναπαραγωγής μουσικής δεν λειτουργούν, εγκαταστήστε το [ffmpeg](https://ffmpeg.org/download.html) **(συνιστάται)** ή εγκαταστήστε το πακέτο **ffmpeg-static** και δοκιμάστε ξανά.
```bat
npm εγκατάσταση ffmpeg-static@latest --save
```

## πίστωση

Ευχαριστούμε όλους τους πρωτότυπους δημιουργούς που επέτρεψαν τη χρήση αυτών των υπέροχων έργων σας.

Σχέδιο Avatar από: [夏月 まりな (NATSUKI MARINA)](https://www.pixiv.net/en/users/482462)/[お着替え中](https://www.pixiv.net/en/artworks/76075098)

## βρήκε πρόβλημα

Εάν αντιμετωπίσετε προβλήματα από την τρέχουσα εργασία σας Μπορείτε να μας ενημερώσετε μέσω της καρτέλας [τεύχος](https://github.com/Maseshi/Shioru/issues) αυτού του αποθετηρίου.
