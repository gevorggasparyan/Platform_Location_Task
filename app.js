const fs = require('fs');

class AdvertisingPlatform {
    constructor(name) {
        this.name = name;
        this.locations = new Set();
    }

    addLocation(location) {
        this.locations.add(location);
    }

    matchesLocation(location) {
        for (let storedLocation of this.locations) {
            if (location.startsWith(storedLocation)) {
                return true;
            }
        }
        return false;
    }
}

class AdvertisingService {
    constructor(filename) {
        this.platforms = new Map();
        this.buildAdvertisingPlatforms(filename);
    }

    buildAdvertisingPlatforms(filename) {
        const data = fs.readFileSync(filename, 'utf8').split('\n').filter(line => line.trim().length > 0);
        data.forEach(line => {
            const [platformName, locations] = line.split(':');
            const platform = new AdvertisingPlatform(platformName.trim());
            locations.split(',').forEach(location => {
                const trimmedLocation = location.trim();
                platform.addLocation(trimmedLocation);
            });
            this.platforms.set(platformName.trim(), platform);
        });
    }

    findPlatformsByLocation(location) {
        const results = [];
        for (let [platformName, platform] of this.platforms.entries()) {
            if (platform.matchesLocation(location)) {
                results.push(platformName);
            }
        }
        return results;
    }
}

const filename = 'basic.txt';
const service = new AdvertisingService(filename);

// Тестирование поиска
console.log(service.findPlatformsByLocation('/ru/msk'));
console.log(service.findPlatformsByLocation('/ru/svrd/ekb'));
console.log(service.findPlatformsByLocation('/be/msk'));