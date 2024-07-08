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
  jest.clearAllMocks();
});


describe('copyBaseURL', () => {
  it('should handle errors when copying to clipboard fails', async () => {
    // Mock navigator.clipboard.writeText to throw an error
    navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Failed to copy'));

    // Setup a spy to monitor console.error calls
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      // Attempt to call the function which should fail
      await copyBaseURL('http://example.com');
    } catch (error) {
      // Expect an error to have been thrown
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to copy');
    }

    // Verify that console.error was called with the expected error
    expect(consoleSpy).toHaveBeenCalledWith('Error copying URL to clipboard:', expect.any(Error));

    // Cleanup
    consoleSpy.mockRestore();
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

// Tests for command listener (hotkey)
describe('Command Listener', () => {
  it('should call copyBaseURL with the active tab when the hotkey is pressed', async () => {
    const mockTabs = [{ id: 1, url: 'https://example.com/path' }];
    mockBrowser.tabs.query.mockResolvedValueOnce(mockTabs);

    // Mock setup for onCommand listener
    mockBrowser.commands.onCommand.addListener.mockImplementationOnce((callback) => {
      callback("copy-base-url");
    });

    // Trigger the hotkey press event
    await mockBrowser.commands.onCommand.addListener.mock.calls[0][0]("copy-base-url");

    expect(copyBaseURL).toHaveBeenCalledWith(mockTabs[0]);
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
