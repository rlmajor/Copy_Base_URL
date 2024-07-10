const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options();
if (process.env.FIREFOX_PATH) {
  options.setBinary(process.env.FIREFOX_PATH);
}

// Configure Firefox to run in headless mode
options.addArguments("--headless");
options.addArguments('disable-gpu');

// Load the .xpi extension if the XPI_PATH environment variable is set
if (process.env.XPI_PATH) {
  options.addExtensions(process.env.XPI_PATH);
}

let serviceBuilder = new firefox.ServiceBuilder('/usr/local/bin/geckodriver')
  .setStdio('inherit'); // This will print the Geckodriver logs to the console.

console.log('Firefox Path:', process.env.FIREFOX_PATH);
console.log('Geckodriver Path:', '/usr/local/bin/geckodriver');
console.log('XPI Path:', process.env.XPI_PATH); // Log the path to the .xpi file for debugging

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