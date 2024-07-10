const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options();
if (process.env.FIREFOX_PATH) {
  options.setBinary(process.env.FIREFOX_PATH);
}

let serviceBuilder = new firefox.ServiceBuilder('/usr/local/bin/geckodriver');

console.log('Firefox Path:', process.env.FIREFOX_PATH);
console.log('Geckodriver Path:', serviceBuilder.getExecutablePath());

(async function example() {
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  try {
    // Your test code here
  } finally {
    await driver.quit();
  }
})();