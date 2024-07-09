const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options();
if (process.env.FIREFOX_PATH) {
  options.setBinary(process.env.FIREFOX_PATH);
}

(async function example() {
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  try {
    // Your test code here
  } finally {
    await driver.quit();
  }
})();