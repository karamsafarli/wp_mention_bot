const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { mentionMarket, mentionSmokers, displayMarketStats, displaySmokerStats } = require('./bots/groups/market')
const { mentionAndPollPubg } = require('./bots/groups/pubg');
const { DEVERS, ADNSU_KAKASH } = require('./static/groups');
const { resetLimitEveryOneMinute } = require('./utils/limitChecker');
const { banUser, unbanUser } = require('./bots/ban');
const { setModerator, unsetModerator } = require('./bots/mod');
const { isModerator } = require('./utils/isModerator');

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
    const chat = await message.getChat();

    if (chat.isGroup && chat.id._serialized === DEVERS) {
    // if (message.fromMe) {
        if (
            message.body?.toLowerCase()?.trim() === '@all' ||
            message.body?.toLowerCase()?.trim() === '!all' ||
            message.body?.toLowerCase()?.trim() === '!opsi' ||
            message.body?.toLowerCase()?.trim() === '!hami' ||
            message.body?.toLowerCase()?.trim() === '!market'
        ) {
            mentionMarket(message)
        }

        if (message.body?.toLowerCase()?.trim() === '!siqaret') {
            mentionSmokers(message)
        }

        if (message.body?.toLowerCase()?.trim() === '!marketstats') {
            displayMarketStats(message)
        }

        if (message.body?.toLowerCase()?.trim() === '!smokerstats') {
            displaySmokerStats(message)
        }
    }



    if (chat.isGroup && chat.id._serialized === ADNSU_KAKASH) {
    // if (message.fromMe) {
        if (message.body?.toLowerCase()?.trim() === '!pubg') {
            mentionAndPollPubg(message)
        }
    }



    // ADMIN

    if ((message.fromMe || isModerator(message?.author)) && message.body?.startsWith('!ban')) {
        banUser(message)
    }

    if ((message.fromMe || isModerator(message?.author)) && message.body?.startsWith('!unban')) {
        unbanUser(message)
    }

    if (message.fromMe && message.body?.startsWith('!setmod')) {
        setModerator(message)
    }

    if (message.fromMe && message.body?.startsWith('!unmod')) {
        unsetModerator(message)
    }



    // TESTING

    if (message.body === '!test' && message.fromMe) {
        console.log(message)
        await message.reply('Test working!')
    }

    if (message.body === '!groups' && message.fromMe) {
        const allGroups = [];
        console.log('here')
        client.getChats().then(chats => {
            chats.forEach(chat => {
                if (chat.isGroup) {
                    allGroups.push(chat);
                }
            });

            console.log(`You are in ${allGroups.length} group(s):`);
            allGroups.forEach(group => {
                console.log(`- ${group.name} (ID: ${group.id._serialized})`);
            });
        });
    }

});

client.initialize();

resetLimitEveryOneMinute();