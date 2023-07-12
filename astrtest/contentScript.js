// Function to count occurrences of the asterisk symbol on the webpage
function countAsterisks() {
  const requiredSectionStart1 = "(This section is required.)";
  const requiredSectionStart2 = "Custom Fields";
  const requiredSectionEnd = "(This section is not required.)";

  const textNodes = getTextNodes(document.body);

  let count = 0;
  let inRequiredSection = false;

  for (let i = 0; i < textNodes.length; i++) {
    const nodeText = textNodes[i].nodeValue;

    if (
      nodeText.includes(requiredSectionStart1) ||
      nodeText.includes(requiredSectionStart2)
    ) {
      inRequiredSection = true;
      const startIndex = nodeText.indexOf(
        nodeText.includes(requiredSectionStart1)
          ? requiredSectionStart1
          : requiredSectionStart2
      );
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

// Function to count asterisks in a specific section
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

// Function to observe mutations in the DOM and track dynamically added asterisks
function observeMutations() {
  const observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.TEXT_NODE) {
            const text = addedNode.nodeValue;
            const matches = text.match(/\*/g);
            if (matches) {
              for (const match of matches) {
                createAsteriskElement(match);
              }
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to create and highlight an asterisk element
function createAsteriskElement(asterisk) {
  const span = document.createElement("span");
  span.classList.add("highlighted-asterisk");
  span.textContent = asterisk;
  document.body.appendChild(span);
}

// Initialize the mutation observer
observeMutations();

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'countAsterisks') {
    const count = countAsterisks();
    sendResponse({ count: count });
  }
});
