// Import the functions from your file, assuming they are exported
// For the sake of this example, let's assume you've modified your code to export these functions
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

// Mocking the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
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