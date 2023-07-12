// Function to count asterisks within font elements
function injectCSS() {
  const css = `
    .highlighted-asterisk {
      background-color: yellow !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// Call the injectCSS function to apply the CSS rules
injectCSS();


function countAsterisks() {
  const fontElements = getFontElementsWithinSections();
  const asterisks = [];

  for (const element of fontElements) {
    if (element.classList.contains("Redstar")) {
      if (element.textContent.includes("*")) {
        const position = getPosition(element);
        asterisks.push(position);
        element.classList.add("highlighted-asterisk");
      }
    }
  }

  return { count: asterisks.length, asteriskPositions: asterisks };
}

function getPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
  };
}


// Function to get font elements within the required sections
function getFontElementsWithinSections() {
  const requiredSectionStart1 = "(This section is required.)";
  const requiredSectionStart2 = "Custom Fields";
  const requiredSectionEnd = "(This section is not required.)";

  const fontElements = Array.from(document.getElementsByTagName("font"));
  const sections = [];
  let currentSection = [];

  for (const element of fontElements) {
    const textContent = element.textContent.trim();
    if (
      textContent === requiredSectionStart1 ||
      textContent === requiredSectionStart2
    ) {
      currentSection.push(element);
    } else if (textContent === requiredSectionEnd) {
      currentSection.push(element);
      sections.push(currentSection);
      currentSection = [];
    } else if (currentSection.length > 0) {
      currentSection.push(element);
    }
  }

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections.flat();
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "countAsterisks") {
    const result = countAsterisks();
    sendResponse(result);
  }
  // Add additional message handlers if needed
});
