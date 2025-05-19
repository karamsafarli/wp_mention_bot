const { Poll } = require('whatsapp-web.js');
const { mentionGivenList } = require('../mention');
const { pubgList } = require('../../static/userList');
const { isUserBanned } = require('../../utils/banChecker');
const { isUserReachedLimit, increaseCmdCount } = require('../../utils/limitChecker');

const mentionAndPollPubg = async (message) => {
    try {
        if (isUserBanned(message.author) || isUserReachedLimit(message.author, 'pubg')) return;
        const poll = new Poll('22:30 qanlı pubg', ['Hə 🤠', 'Yox 💅🏻'], { allowMultipleAnswers: false });
        await message.reply(poll)
        await mentionGivenList(message, pubgList)

        increaseCmdCount(message.author, 'pubg')
    } catch (error) {
        console.log(error)
    }
}


module.exports = { mentionAndPollPubg }