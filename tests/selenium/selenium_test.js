const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

console.log('Firefox Path:', process.env.FIREFOX_PATH);
console.log('Geckodriver Path:', serviceBuilder.getExecutablePath());

let options = new firefox.Options();
if (process.env.FIREFOX_PATH) {
  options.setBinary(process.env.FIREFOX_PATH);
}

let serviceBuilder = new firefox.ServiceBuilder('/usr/local/bin/geckodriver');
.setStdio('inherit'); // This will print the geckodriver logs to the console.

(async function example() {
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  try {
    // Your test code here
  } finally {
    await driver.quit();
  }
})();