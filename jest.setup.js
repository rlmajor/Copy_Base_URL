// jest.setup.js
global.browser = {
    contextMenus: {
      create: jest.fn(),
    },
    commands: {
      onCommand: {
        addListener: jest.fn(),
      },
    },
    tabs: {
      query: jest.fn(),
    },
    // Add other browser API mocks as needed
  };

  module.exports = {
    setupFiles: ["jest.setup.js"],
  };