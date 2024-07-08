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