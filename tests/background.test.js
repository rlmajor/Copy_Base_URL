// Mock navigator.clipboard.writeText and browser APIs used in background.js
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(true), // Mock resolved value for success case
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

const { getBaseURL, copyBaseURL } = require('../background.js');

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Mock navigator.clipboard.writeText to reject
  navigator.clipboard.writeText.mockRejectedValue(new Error('Failed to copy'));
});

// Tests for copyBaseURL function
describe('copyBaseURL', () => {
  it('should copy the base URL to the clipboard', async () => {
    const tab = { url: 'https://example.com/path?query=123' };
    await copyBaseURL(tab);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/path');
  });

  it('should handle errors when copying to clipboard fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const tab = { url: 'https://example.com/path?query=123' };
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

    // Simulate clicking the context menu item
    const onClickedCallback = browser.contextMenus.onClicked.addListener.mock.calls[0][0];
    onClickedCallback({ menuItemId: "copy-base-url" }, mockTab);

    expect(copyBaseURL).toHaveBeenCalledWith(mockTab);
  });
});

// Tests for command listener (hotkey)
describe('Command Listener', () => {
  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    const mockTabs = [{ id: 1, url: 'https://example.com/path' }];
    browser.tabs.query.mockResolvedValue(mockTabs);

    const onCommandCallback = browser.commands.onCommand.addListener.mock.calls[0][0];
    await onCommandCallback("copy-base-url");

    expect(copyBaseURL).toHaveBeenCalledWith(mockTabs[0]);
  });
});
