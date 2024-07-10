/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./background.js":
/*!***********************!*\
  !*** ./background.js ***!
  \***********************/
/***/ ((module) => {

eval("// Function to extract the base URL from a given URL\r\nconst getBaseURL = (url) => {\r\n    let urlObj = new URL(url);\r\n    // Construct base URL including the path but excluding query and fragment\r\n    let baseURL = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;\r\n    // Remove trailing slash for cleaner URL if necessary\r\n    if (baseURL.endsWith('/')) {\r\n      baseURL = baseURL.slice(0, -1);\r\n    }\r\n    return baseURL;\r\n}\r\n\r\nasync function copyBaseURL(url) {\r\n  try {\r\n    await navigator.clipboard.writeText(url);\r\n  } catch (error) {\r\n    console.error('Error copying URL to clipboard:', error);\r\n    throw error; // Rethrow or handle as needed\r\n  }\r\n}\r\n\r\n// Create a context menu item for the page\r\nbrowser.contextMenus.create({\r\n  id: \"copy-base-url\",\r\n  title: \"Copy Base URL\",\r\n  contexts: [\"all\"]\r\n});\r\n\r\n// Add a listener for the context menu item click \r\nbrowser.contextMenus.onClicked.addListener((info, tab) => {\r\n  if (info.menuItemId === \"copy-base-url\") {\r\n    copyBaseURL(tab);\r\n  }\r\n});\r\n\r\n// Add a listener for the hotkey\r\nbrowser.commands.onCommand.addListener((command) => {\r\n  if (command === \"copy-base-url\") {\r\n    // Get the currently active tab\r\n    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {\r\n      if (tabs.length > 0) {\r\n        copyBaseURL(tabs[0]);\r\n      }\r\n    });\r\n  }\r\n});\r\n\r\n// Define createContextMenu function outside of any other function to ensure it is in the correct scope\r\nfunction createContextMenu() {\r\n  browser.contextMenus.create({\r\n    id: \"copy-base-url\",\r\n    title: \"Copy Base URL\",\r\n    contexts: [\"all\"],\r\n  });\r\n}\r\n\r\n// Correctly export the functions\r\nmodule.exports = { getBaseURL, copyBaseURL, createContextMenu };\n\n//# sourceURL=webpack://project-name/./background.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./background.js");
/******/ 	
/******/ })()
;