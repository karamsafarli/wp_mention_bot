const { marketList, smokerList } = require('../../static/userList');
const { getMarketStats, saveMarketStats, getSmokerStats, saveSmokerStats } = require('../../db/market');
const { isUserBanned } = require('../../utils/banChecker');
const { isUserReachedLimit, increaseCmdCount } = require('../../utils/limitChecker');

const mentionMarket = async (message) => {
    try {
        // const chat = await message.getChat();

        // let text = '';
        // let mentions = [];

        // for (let participant of chat.participants) {
        //     mentions.push(`${participant.id.user}@c.us`);
        //     text += `@${participant.id.user} `;
        // }

        if (isUserBanned(message.author) || isUserReachedLimit(message.author, 'market')) return;
        const marketStats = getMarketStats();
        const statAuthor = marketStats[message.author]
        if (statAuthor) {
            statAuthor.count = statAuthor.count + 1
        }

        else {
            marketStats[message.author] = { notifyName: message?._data?.notifyName, count: 1 }
        }

        saveMarketStats(marketStats)

        let text = '';
        let mentions = [];

        for (let participant of marketList) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        // await chat.sendMessage(text, { mentions });
        await message.reply(text, null, { mentions });

        increaseCmdCount(message.author, 'market')
    } catch (error) {
        console.log(error)
    }
}

const mentionSmokers = async (message) => {
    try {
        if (isUserBanned(message.author) || isUserReachedLimit(message.author, 'smoke')) return;

        const smokerStats = getSmokerStats();
        const statAuthor = smokerStats[message.author]
        if (statAuthor) {
            statAuthor.count = statAuthor.count + 1
        }

        else {
            smokerStats[message.author] = { notifyName: message?._data?.notifyName, count: 1 }
        }

        saveSmokerStats(smokerStats);

        let text = '';
        let mentions = [];

        for (let participant of smokerList) {
            mentions.push(`${participant}@c.us`);
            text += `@${participant} `;
        }

        await message.reply(text, null, { mentions });

        increaseCmdCount(message.author, 'smoke')
    } catch (error) {
        console.log(error)
    }
}

const displayMarketStats = async (message) => {
    const marketStats = getMarketStats();
    const stats = Object.values(marketStats);
    // const chat = await message.getChat();

    if (stats?.length === 0) {
        await message.reply('Hələ ki marketə gedən yoxdu')
        return
    }

    let statsMessage = ``;
    stats.forEach(stat => {
        statsMessage += `*${stat?.notifyName}* - ${stat?.count} dəfə \n`
    })

    await message.reply(statsMessage)
}

const displaySmokerStats = async (message) => {
    const smokerStats = getSmokerStats();
    const stats = Object.values(smokerStats);

    if (stats?.length === 0) {
        await message.reply('Hələ ki siqaretə çıxan yoxdu')
        return
    }

    let statsMessage = ``;
    stats.forEach(stat => {
        statsMessage += `*${stat?.notifyName}* - ${stat?.count} dəfə \n`
    })

    await message.reply(statsMessage)
}

module.exports = {
    mentionMarket,
    mentionSmokers,
    displayMarketStats,
    displaySmokerStats
}