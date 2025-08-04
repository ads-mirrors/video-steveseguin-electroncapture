const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');

module.exports = async function (params) {
    console.log('afterSign hook triggered', params);
    
    // Only notarize the app on Mac OS only.
    if (params.electronPlatformName !== 'darwin') {
        console.log('Skipping notarization - not macOS');
        return;
    }

    // Same appId in electron-builder.
    let appId = 'ninja.vdo'

    let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    console.log(`Notarizing ${appId} found at ${appPath}`);

    try {
        await electron_notarize.notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: process.env.appleId,
            teamId: process.env.teamId,
            appleIdPassword: process.env.appleIdPassword,
        });
    } catch (error) {
        console.error(error);
    }

    console.log(`Done notarizing ${appId}`);
};
