// Function to count occurrences of the asterisk symbol on the webpage
function countAsterisks() {
  const textNodes = getTextNodes(document.body);

  let count = 0;

  for (let i = 0; i < textNodes.length; i++) {
    const nodeText = textNodes[i].nodeValue;
    const matches = nodeText.match(/\*/g);
    if (matches) {
      count += matches.length;
    }
  }

  return count;
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
