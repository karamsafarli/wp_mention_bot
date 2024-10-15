const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('disconnected', (reason) => {
    console.error('Client was disconnected', reason);
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});




client.on('message_create', async (message) => {

    if (message.body === '@all') {
        const chat = await message.getChat();

        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
        console.log(`Mentioned ${mentions.length} users`)
    }

});

client.initialize();

