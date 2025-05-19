const { getBanList, saveBanList } = require("../db/banlist")

const banUser = async (message) => {
    try {
        const { mentionedIds } = message;
        const banlist = getBanList();

        if (mentionedIds.length === 0) return;

        mentionedIds.forEach(id => {
            if (!banlist.includes(id)) {
                banlist.push(id)
            }
        });

       
        saveBanList(banlist)

    } catch (error) {
        console.error(error)
    }
}


const unbanUser = async (message) => {
    try {
        const { mentionedIds } = message;
        let banlist = getBanList();

        if (mentionedIds.length === 0) return;

        banlist = banlist.filter((userId) => !mentionedIds.includes(userId))


        saveBanList(banlist);

    } catch (error) {
        console.error(error)
    }
}

module.exports = { banUser, unbanUser }