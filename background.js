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

async function copyBaseURL(url) {
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    console.error('Error copying URL to clipboard:', error);
    throw error; // Rethrow or handle as needed
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

// Define createContextMenu function outside of any other function to ensure it is in the correct scope
function createContextMenu() {
  browser.contextMenus.create({
    id: "copy-base-url",
    title: "Copy Base URL",
    contexts: ["all"],
  });
}

// Correctly export the functions
module.exports = { getBaseURL, copyBaseURL, createContextMenu };

browser.runtime.onInstalled.addListener(function(details){
  if(details.reason === "install"){
      console.log("This is a first install!");
      browser.tabs.create({url: "post_install.html"});
  }else if(details.reason === "update"){
      var thisVersion = browser.runtime.getManifest().version;
      console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});