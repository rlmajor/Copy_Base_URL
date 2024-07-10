const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options();
if (process.env.FIREFOX_PATH) {
  options.setBinary(process.env.FIREFOX_PATH);
}

// Explicitly setting the path to Geckodriver
let serviceBuilder = new firefox.ServiceBuilder('/usr/local/bin/geckodriver');

console.log('Firefox Path:', process.env.FIREFOX_PATH);
console.log('Geckodriver Path:', '/usr/local/bin/geckodriver');

(async function example() {
  let driver = await new Builder()
	.forBrowser('firefox')
	.setFirefoxOptions(options)
	.setFirefoxService(serviceBuilder) // Ensure the serviceBuilder is correctly utilized
	.build();
  try {
	// Your test code here
  } finally {
	await driver.quit();
  }
})();