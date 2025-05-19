const fs = require('fs');
const path = require('path');

const getRateLimits = () => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'rateLimit.json');
    try {
        if (!fs.existsSync(filePath)) {
            return {}
        } else {
            const rateLimit = JSON.parse(fs.readFileSync(filePath));
            return rateLimit
        }
    } catch (error) {
        console.error(error)
    }
}

const saveRateLimit = (updated) => {
    const dir = path.join(__dirname, '../data');
    const filePath = path.join(dir, 'rateLimit.json');
    try {
        const formatted = JSON.stringify(updated, null, 2);
        fs.writeFileSync(filePath, formatted, { encoding: 'utf-8' });

        console.log('Data saved')
    } catch (error) {
        console.error(error)
    }
}


module.exports = { getRateLimits, saveRateLimit }