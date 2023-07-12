// Function to count asterisks within font elements
function injectCSS() {
  const css = `
    .highlighted-asterisk {
      background-color: yellow !important;
    }
    .hidden-span {
      display: none !important;
    }
  `;

  const style = document.createElement("style");
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

        // Highlight the label element
        const tdElement = element.parentElement;
        const labelElement = tdElement.querySelector("label");
        if (labelElement) {
          labelElement.classList.add("highlighted-asterisk");

          // Insert a span element with content "!" for navigation
          const spanElement = document.createElement("span");
          spanElement.textContent = "!";
          spanElement.classList.add("hidden-span");
          tdElement.appendChild(spanElement);
        }
      }
    }
  }

  return { count: asterisks.length, asteriskPositions: asterisks };
}

function getPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "countAsterisks") {
    const result = countAsterisks();
    sendResponse(result);
  } else if (request.action === "navigateToAsterisk") {
    const position = request.position;
    if (position) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollLeft = position.left - viewportWidth / 2 + position.width / 2;
      const scrollTop = position.top - viewportHeight / 2 + position.height / 2;
      window.scrollTo(scrollLeft, scrollTop);
    }
  }
});
