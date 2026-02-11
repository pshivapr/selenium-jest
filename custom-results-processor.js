const fs = require('fs');
const path = require('path');

module.exports = function (testResults) {
    if (testResults.numFailedTests > 0) {
        testResults.testResults.forEach(suiteResult => {
            suiteResult.testResults.forEach(result => {
                if (result.status === 'failed') {
                    const testName = result.fullName || result.title;
                    const sanitizedName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

                    const screenshotsDir = path.resolve(process.cwd(), 'test-results/screenshots');
                    if (fs.existsSync(screenshotsDir)) {
                        const files = fs.readdirSync(screenshotsDir);
                        const matchingFile = files.find(file => file.includes(sanitizedName));

                        if (matchingFile) {
                            const screenshotPath = `screenshots/${matchingFile}`;

                            if (!result.failureMessages) {
                                result.failureMessages = [];
                            }

                            result.failureMessages.push(
                                `\n\n📸 Screenshot: <a href="${screenshotPath}" target="_blank"><img src="${screenshotPath}" style="max-width: 600px; border: 1px solid #ccc; margin-top: 10px;" /></a>\n`
                            );
                        }
                    }
                }
            });
        });
    }

    return testResults;
};
