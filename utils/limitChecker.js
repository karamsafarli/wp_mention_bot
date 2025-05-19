const { getRateLimits, saveRateLimit } = require('../db/rateLimit');
const { RATE_LIMITS } = require('../static/config');

const resetLimitEveryOneMinute = () => {
    setInterval(() => {
        saveRateLimit({})
    }, 1000 * 60)
}


const isUserReachedLimit = (user, cmd) => {
    const rateLimitList = getRateLimits();
    rateLimitList[user] = rateLimitList[user] || {}
    const userLimit = rateLimitList[user][cmd];
    if (!userLimit) return false;

    const limitCount = RATE_LIMITS[cmd] || 3;

    if (userLimit.count >= limitCount) {
        return true
    }


    return false
}


const increaseCmdCount = (user, cmd, by = 1) => {
    try {
        const rateLimitList = getRateLimits();

        rateLimitList[user] = rateLimitList[user] || {};
        rateLimitList[user][cmd] = rateLimitList[user][cmd] || { count: 0 };

        rateLimitList[user][cmd].count += by;

        saveRateLimit(rateLimitList)

    } catch (error) {
        console.error(error)
    }
}

module.exports = { resetLimitEveryOneMinute, isUserReachedLimit, increaseCmdCount }