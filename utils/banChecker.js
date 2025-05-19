const { getBanList } = require("../db/banlist")


const isUserBanned = (user) => {
    try {
        const banList = getBanList();

        return banList.includes(user)
    } catch (error) {
        console.error(error)
    }
}

module.exports = { isUserBanned }