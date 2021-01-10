const createIsCool = require('iscool');

const isCool = createIsCool({
	customBlacklist: [
		'jew',
		'gay',
        'hitler',
        'stalin'
	]
});

module.exports = (message) => {
    if (!isCool(message.content.toLocaleLowerCase())) {
        message.delete().then(() => message.channel.send(`${message.author}, please refrain from using inappropriate words.`));
    }
};