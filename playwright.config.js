const { devices } = require('@playwright/test');

module.exports = {
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        executablePath: process.env.FIREFOX_EXECUTABLE_PATH || undefined,
      },
    },
  ],
};
