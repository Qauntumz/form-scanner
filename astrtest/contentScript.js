function getFontElementsWithinSections() {
  const requiredSectionStart1 = "(This section is required.)";
  const requiredSectionStart2 = "Custom Fields";
  const requiredSectionEnd = "(This section is not required.)";

  const fontElements = [];

  let inRequiredSection = false;
  let sectionEnd = false;

  const elements = document.querySelectorAll("font");

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const textContent = element.textContent.trim();

    if (textContent === requiredSectionStart1 || textContent === requiredSectionStart2) {
      inRequiredSection = true;
      sectionEnd = false;
    } else if (textContent === requiredSectionEnd) {
      sectionEnd = true;
    }

    if (inRequiredSection && !sectionEnd && element.classList.contains("Redstar")) {
      fontElements.push(element);
    }
  }

  return fontElements;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "countAsterisks") {
    const fontElements = getFontElementsWithinSections();
    const count = fontElements.reduce((total, element) => {
      const matches = element.textContent.match(/\*/g);
      return total + (matches ? matches.length : 0);
    }, 0);
    sendResponse({ count: count });
  }
});
