// Function to count occurrences of the asterisk symbol on the webpage
function countAsterisks() {
  const requiredSectionStart = "(This section is required.)";
  const requiredSectionEnd = "(This section is not required.)";

  const textNodes = getTextNodes(document.body);

  let count = 0;
  let inRequiredSection = false;

  for (let i = 0; i < textNodes.length; i++) {
    const nodeText = textNodes[i].nodeValue;

    if (nodeText.includes(requiredSectionStart)) {
      inRequiredSection = true;
      const startIndex = nodeText.indexOf(requiredSectionStart);
      if (startIndex !== -1) {
        count += countAsterisksInSection(nodeText.substring(startIndex));
      }
    } else if (inRequiredSection) {
      if (nodeText.includes(requiredSectionEnd)) {
        inRequiredSection = false;
        const endIndex = nodeText.indexOf(requiredSectionEnd);
        if (endIndex !== -1) {
          count += countAsterisksInSection(nodeText.substring(0, endIndex));
        }
      } else {
        count += countAsterisksInSection(nodeText);
      }
    }
  }

  return count;
}

function countAsterisksInSection(text) {
  const matches = text.match(/\*/g);
  return matches ? matches.length : 0;
}


// Helper function to retrieve visible text nodes within an element
function getTextNodes(element) {
  const textNodes = [];
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  let currentNode;
  while ((currentNode = treeWalker.nextNode())) {
    if (isVisibleTextNode(currentNode)) {
      textNodes.push(currentNode);
    }
  }

  return textNodes;
}

// Helper function to check if a text node is visible
function isVisibleTextNode(node) {
  const parentElement = node.parentElement;

  if (parentElement && parentElement.offsetHeight === 0) {
    return false; // Exclude hidden elements
  }

  const style = window.getComputedStyle(parentElement);
  if (style && style.display === 'none') {
    return false; // Exclude elements with display: none
  }

  return true;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'countAsterisks') {
    const count = countAsterisks();
    sendResponse({ count: count });
  }
});
