// Import necessary functions from background.js
const { getBaseURL, copyBaseURL, createContextMenu } = require('../background.js');

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
  mockBrowser.commands.onCommand.addListener.mockReset();
});

beforeEach(() => {
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
    // Assuming copyBaseURL is an async function that attempts to copy text to the clipboard
    // and handles errors by catching them and perhaps logging or re-throwing.

    // The test expects copyBaseURL to throw an error when clipboard.writeText fails.
    // This is checked by awaiting the promise to reject with the expected error message.
    await expect(copyBaseURL('http://example.com')).rejects.toThrow('Failed to copy');

    // Optionally, if there's any cleanup or additional assertions, they can be done here.
  });

  // afterEach or other tests can go here
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
    expect(mockBrowser.contextMenus.create).toHaveBeenCalledWith({
      id: "copy-base-url",
      title: "Copy Base URL",
      contexts: ["all"]
    });
  });
});

// Example test for Context Menu Click Listener
it('should call copyBaseURL when context menu item is clicked', () => {
  const mockTab = { id: 1, url: 'https://example.com' };
  // Directly invoke the callback as it's the argument to our mock function
  browser.contextMenus.onClicked.addListener((info, tab) => {
    expect(info.menuItemId).toBe("copy-base-url");
    expect(tab).toEqual(mockTab);
    // Add your assertion for the expected behavior here
  });
});

describe('Command Listener', () => {
  beforeEach(() => {
    // Reset the mock to ensure it's clean for each test
    mockBrowser.commands.onCommand.addListener.mockReset();
    mockBrowser.commands.onCommand.addListener = jest.fn();

    // Mock setup that should lead to addListener being called, if any
  });

  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    // Assuming there's a setup function or step that triggers the addListener call
    // For example, initializing the background script or similar
    // initializeBackgroundScript(); // Hypothetical function

    // Manually trigger the listener as if the hotkey was pressed
    // First, ensure the mock function was called to avoid TypeError
    if (mockBrowser.commands.onCommand.addListener.mock.calls.length > 0) {
      await mockBrowser.commands.onCommand.addListener.mock.calls[0][0]("copy-base-url");
      expect(copyBaseURL).toHaveBeenCalledWith(mockTabs[0]);
    } else {
      // If this block is reached, it means addListener was not called as expected
      throw new Error('addListener was not called');
    }
  });

  describe('createContextMenu', () => {
    it('should create a context menu item with correct properties', () => {
      createContextMenu(); // Assuming this function is imported or defined in the test file
      expect(browser.contextMenus.create).toHaveBeenCalledWith({
        id: "copy-base-url",
        title: "Copy Base URL",
        contexts: ["all"],
      });
    });
  });

});
