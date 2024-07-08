Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn()
  },
  writable: true
});

// Mock the `browser` object and its methods used in your code 
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
};

const { getBaseURL, copyBaseURL } = require('../background.js');

// Ensure navigator.clipboard.writeText is mocked
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

beforeEach(() => {
  // Reset mocks to clear previous test state
  jest.clearAllMocks();

  // Setup or reconfigure mocks here if necessary
  // For example, if using navigator.clipboard.writeText in the function:
  navigator.clipboard = {
    writeText: jest.fn().mockResolvedValue(true), // Mock clipboard API as resolved
  };
});

// Test to ensure copyBaseURL correctly interacts with the clipboard
test('should copy the base URL to the clipboard', async () => {
  // Call the function under test
  await copyBaseURL('https://example.com');

  // Assert that the clipboard API was called with the correct URL
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com');
});// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test for copyBaseURL
describe('copyBaseURL', () => {
  it('should copy the base URL to the clipboard', async () => {
    const tab = { url: 'https://example.com/path?query=123' };
    await copyBaseURL(tab);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/path');
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
});

describe('copyBaseURL', () => {
  it('should copy the base URL to the clipboard', async () => {
    const tab = { url: 'https://example.com/path?query=123' };
    await copyBaseURL(tab);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/path');
  });
});

// Additional imports for mocking
jest.mock('../background.js', () => ({
  getBaseURL: jest.requireActual('../background.js').getBaseURL,
  copyBaseURL: jest.fn(),
}));

// Test for context menu creation
describe('Context Menu Creation', () => {
  it('should create a context menu item with correct properties', () => {
    expect(browser.contextMenus.create).toHaveBeenCalledWith({
      id: "copy-base-url",
      title: "Copy Base URL",
      contexts: ["all"]
    });
  });
});

// Test for context menu click listener
describe('Context Menu Click Listener', () => {
  it('should call copyBaseURL when context menu item is clicked', () => {
    const mockTab = { id: 1, url: 'https://example.com/path' };
    // Simulate clicking the context menu item
    const onClickedCallback = browser.contextMenus.onClicked.addListener.mock.calls[0][0];
    onClickedCallback({ menuItemId: "copy-base-url" }, mockTab);
    expect(copyBaseURL).toHaveBeenCalledWith(mockTab);
  });
});

// Test for command listener (hotkey)
describe('Command Listener', () => {
  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    const mockTabs = [{ id: 1, url: 'https://example.com/path' }];
    browser.tabs.query.mockResolvedValue(mockTabs);
    // Simulate pressing the hotkey
    const onCommandCallback = browser.commands.onCommand.addListener.mock.calls[0][0];
    await onCommandCallback("copy-base-url");
    expect(copyBaseURL).toHaveBeenCalledWith(mockTabs[0]);
  });
});

// Test for error handling in copyBaseURL
describe('copyBaseURL Error Handling', () => {
  it('should handle errors when copying to clipboard fails', async () => {
    navigator.clipboard.writeText.mockImplementationOnce(() => Promise.reject(new Error('Failed to copy')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const tab = { url: 'https://example.com/path?query=123' };
    await copyBaseURL(tab);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to copy base URL:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

// Test for URL with trailing slash
describe('getBaseURL with Trailing Slash', () => {
  it('should remove trailing slash from the base URL', () => {
    expect(getBaseURL('https://example.com/path/')).toBe('https://example.com/path');
  });
});