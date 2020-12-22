module.exports = async function (member) {
    let memberChannel = member.voice.channel;
    let clientChannel = member.guild.me.voice.channel;

    if (memberChannel !== clientChannel) {
        member.send("❎ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=");
        return;
    }
    
    return true;
};
