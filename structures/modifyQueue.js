module.exports = async function (member) {
    let memberChannel = member.voice.channelID;
    let clientChannel = member.guild.voice.channelID;

    if (memberChannel !== clientChannel) {
        return;
    }
    
    return true;
};
