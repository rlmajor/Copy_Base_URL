// Function to extract the base URL from a given URL
const getBaseURL = (url) => {
    let urlObj = new URL(url);
    // Construct base URL including the path but excluding query and fragment
    let baseURL = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    // Remove trailing slash for cleaner URL if necessary
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    return baseURL;
}

// Assume `getBaseURL` function is correctly implemented
async function copyBaseURL(tab) {
  try {
    const baseURL = getBaseURL(tab.url);
    await navigator.clipboard.writeText(baseURL);
  } catch (error) {
    console.error('Failed to copy base URL:', error);
    throw error; // Ensure error is propagated if necessary
  }
}

// Create a context menu item for the page
browser.contextMenus.create({
  id: "copy-base-url",
  title: "Copy Base URL",
  contexts: ["all"]
});

// Add a listener for the context menu item click 
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-base-url") {
    copyBaseURL(tab);
  }
});

// Add a listener for the hotkey
browser.commands.onCommand.addListener((command) => {
  if (command === "copy-base-url") {
    // Get the currently active tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0) {
        copyBaseURL(tabs[0]);
      }
    });
  }
});

module.exports = { getBaseURL, copyBaseURL };