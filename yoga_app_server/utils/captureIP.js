const os = require("os");

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const addresses = interfaces[interfaceName];
        for (const address of addresses) {
            if (address.family === "IPv4" && !address.internal) {
                return address.address;
            }
        }
    }
    return "localhost";
}

module.exports = getLocalIPAddress;
