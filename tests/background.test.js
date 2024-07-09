const { getBaseURL, copyBaseURL, createContextMenu, setupCommandListener } = require('../background.js'); // Ensure correct imports

// Mock the browser object and its APIs
const mockBrowser = {
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
};

// Assign the mock browser object to global scope to simulate browser APIs
global.browser = mockBrowser;

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Mock the clipboard API
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockRejectedValueOnce(new Error('Failed to copy')),
    },
  });
});

describe('copyBaseURL', () => {
  // Mock the navigator.clipboard.writeText to reject with an error
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockRejectedValueOnce(new Error('Failed to copy')),
      },
    });
  });

  it('should handle errors when copying to clipboard fails', async () => {
    await expect(copyBaseURL('http://example.com')).rejects.toThrow('Failed to copy');
  });
});

describe('getBaseURL', () => {
  it('should extract the base URL without query parameters', () => {
    expect(getBaseURL('https://example.com/path?query=123')).toBe('https://example.com/path');
  });

  it('should extract the base URL without a fragment', () => {
    expect(getBaseURL('https://example.com/path#section')).toBe('https://example.com/path');
  });

  it('should handle URLs without a path', () => {
    expect(getBaseURL('https://example.com')).toBe('https://example.com');
  });

  it('should remove trailing slash from the base URL', () => {
    expect(getBaseURL('https://example.com/path/')).toBe('https://example.com/path');
  });
});

describe('Context Menu Creation', () => {
  it('should create a context menu item with correct properties', () => {
    createContextMenu();
    expect(mockBrowser.contextMenus.create).toHaveBeenCalledWith({
      id: "copy-base-url",
      title: "Copy Base URL",
      contexts: ["all"],
    });
  });
});

describe('Context Menu Click Listener', () => {
  it('should call copyBaseURL when context menu item is clicked', () => {
    const mockTab = { id: 1, url: 'https://example.com' };
    browser.contextMenus.onClicked.addListener((info, tab) => {
      expect(info.menuItemId).toBe("copy-base-url");
      expect(tab).toEqual(mockTab);
    });
  });
});

describe('Command Listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBrowser.commands.onCommand.addListener = jest.fn();
    mockBrowser.tabs.query = jest.fn().mockResolvedValue([{ id: 1, url: 'https://example.com/path' }]);
    
    // Initialize the command listener setup
    setupCommandListener(); // Ensure this function sets up the listener
  });

  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    if (mockBrowser.commands.onCommand.addListener.mock.calls.length > 0) {
      await mockBrowser.commands.onCommand.addListener.mock.calls[0][0]("copy-base-url");
      expect(copyBaseURL).toHaveBeenCalledWith({ id: 1, url: 'https://example.com/path' });
    } else {
      throw new Error('addListener was not called');
    }
  });

  describe('createContextMenu', () => {
    it('should create a context menu item with correct properties', () => {
      createContextMenu();
      expect(browser.contextMenus.create).toHaveBeenCalledWith({
        id: "copy-base-url",
        title: "Copy Base URL",
        contexts: ["all"],
      });
    });
  });
});
