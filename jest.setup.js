// First, define the global.browser object with all necessary mocks
global.browser = {
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
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

// Then, you can manipulate or use the mocks as needed
const mockAddListener = jest.fn((callback) => callback);
global.browser.contextMenus.onClicked.addListener = mockAddListener;
global.browser.commands.onCommand.addListener = mockAddListener;

// Mocking navigator.clipboard for the entire test suite
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
  writable: true,
});