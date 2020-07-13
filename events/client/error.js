module.exports = function (error) {
	message.channel.send(client.lang.event_client_error + error);
	console.error(error);
};