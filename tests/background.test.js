// Import or redefine the getBaseURL function here if necessary
// For the purpose of this example, we'll assume it's redefined here

function getBaseURL(url) {
    let urlObj = new URL(url);
    let baseURL = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    return baseURL;
}

describe('getBaseURL', () => {
  test('extracts base URL without path', () => {
    expect(getBaseURL('https://example.com')).toBe('https://example.com');
  });

  test('extracts base URL with path', () => {
    expect(getBaseURL('https://example.com/path/to/resource')).toBe('https://example.com/path/to/resource');
  });

  test('removes trailing slash', () => {
    expect(getBaseURL('https://example.com/')).toBe('https://example.com');
    expect(getBaseURL('https://example.com/path/to/resource/')).toBe('https://example.com/path/to/resource');
  });

  test('handles URLs with query parameters', () => {
    expect(getBaseURL('https://example.com?query=123')).toBe('https://example.com');
    expect(getBaseURL('https://example.com/path/to/resource?query=123')).toBe('https://example.com/path/to/resource');
  });

  test('handles URLs with fragments', () => {
    expect(getBaseURL('https://example.com#fragment')).toBe('https://example.com');
    expect(getBaseURL('https://example.com/path/to/resource#fragment')).toBe('https://example.com/path/to/resource');
  });
});