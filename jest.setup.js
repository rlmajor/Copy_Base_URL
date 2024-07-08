Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: jest.fn(),
    },
    writable: true,
  });

  const mockAddListener = jest.fn((callback) => callback);
  global.browser.contextMenus.onClicked.addListener = mockAddListener;
  global.browser.commands.onCommand.addListener = mockAddListener;
  
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