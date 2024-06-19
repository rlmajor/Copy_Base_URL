// Function to extract the base URL from a given URL
function getBaseURL(url) {
    let urlObj = new URL(url);
    // Construct base URL including the path but excluding query and fragment
    let baseURL = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    // Remove trailing slash for cleaner URL if necessary
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    return baseURL;
  }
  
  // Function to copy the base URL to the clipboard quickly 
  function copyBaseURL(tab) {
    let baseURL = getBaseURL(tab.url);
    // Use the clipboard API to copy the base URL to the clipboard
    navigator.clipboard.writeText(baseURL).then(() => {
      console.log('Base URL copied to clipboard:', baseURL);
    }).catch(err => {
      console.error('Failed to copy base URL:', err);
    });
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
  