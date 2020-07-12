module.exports = function (member) {
    let channel = member.voice.channel;
    let clientChannel = member.guild.me.voice.channel;

    if (channel !== clientChannel) {
        member.send("❎ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=");
    } else {
        return true;
    }
};