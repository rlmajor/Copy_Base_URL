// Function to extract the base URL from a given URL
const getBaseURL = (url) => {
    let urlObj = new URL(url);
    let baseURL = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    return baseURL;
}

async function copyBaseURL(url) {
  try {
    await navigator.clipboard.writeText(getBaseURL(url));
  } catch (error) {
    console.error('Error copying URL to clipboard:', error);
    throw error;
  }
}

function createContextMenu() {
  browser.contextMenus.create({
    id: "copy-base-url",
    title: "Copy Base URL",
    contexts: ["all"],
  });
}

function setupCommandListener() {
  browser.commands.onCommand.addListener((command) => {
    if (command === "copy-base-url") {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs.length > 0) {
          copyBaseURL(tabs[0].url); // Ensure to pass the URL of the tab, not the tab object itself
        }
      });
    }
  });
}

// Correctly export the functions
module.exports = { getBaseURL, copyBaseURL, createContextMenu, setupCommandListener };