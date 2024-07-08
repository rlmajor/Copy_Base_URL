// Import necessary functions from background.js
const { getBaseURL, copyBaseURL, createContextMenu } = require('../background.js');

// Mock navigator.clipboard.writeText and browser APIs used in background.js
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockImplementation(() => {
      throw new Error('Failed to copy');
    }),
  },
  writable: true,
});

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
};

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Tests for copyBaseURL function
describe('copyBaseURL', () => {
  it('should copy the base URL to the clipboard', async () => {
    const tab = { url: 'https://example.com/path?query=123' };

    // Mock navigator.clipboard.writeText to resolve (success scenario)
    navigator.clipboard.writeText.mockResolvedValueOnce();

    await copyBaseURL(tab);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/path');
  });

  it('should handle errors when copying to clipboard fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const tab = { url: 'https://example.com/path?query=123' };

    // Mock navigator.clipboard.writeText to reject (error scenario)
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Failed to copy'));

    await copyBaseURL(tab);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy base URL:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

// Tests for getBaseURL function
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

// Tests for context menu creation
describe('Context Menu Creation', () => {
  it('should create a context menu item with correct properties', () => {
    // Call your function that creates context menu item here if applicable
    createContextMenu();
    expect(browser.contextMenus.create).toHaveBeenCalledWith({
      id: "copy-base-url",
      title: "Copy Base URL",
      contexts: ["all"]
    });
  });
});

// Tests for context menu click listener
describe('Context Menu Click Listener', () => {
  it('should call copyBaseURL when context menu item is clicked', () => {
    const mockTab = { id: 1, url: 'https://example.com/path' };

    // Mock setup for onClicked listener
    browser.contextMenus.onClicked.addListener.mockImplementationOnce((callback) => {
      callback({ menuItemId: "copy-base-url" }, mockTab);
    });

    // Trigger the click event
    const onClickedCallback = browser.contextMenus.onClicked.addListener.mock.calls[0][0];
    onClickedCallback({ menuItemId: "copy-base-url" }, mockTab);

    expect(copyBaseURL).toHaveBeenCalledWith(mockTab);
  });
});

// Tests for command listener (hotkey)
describe('Command Listener', () => {
  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    const mockTabs = [{ id: 1, url: 'https://example.com/path' }];
    browser.tabs.query.mockResolvedValueOnce(mockTabs);

    // Mock setup for onCommand listener
    browser.commands.onCommand.addListener.mockImplementationOnce((callback) => {
      callback("copy-base-url");
    });

    // Trigger the hotkey press event
    await browser.commands.onCommand.addListener.mock.calls[0][0]("copy-base-url");

    expect(copyBaseURL).toHaveBeenCalledWith(mockTabs[0]);
  });
});
