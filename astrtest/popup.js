document.addEventListener("DOMContentLoaded", function () {
  const scanButton = document.getElementById("scanButton");
  const leftArrowButton = document.getElementById("leftArrow");
  const rightArrowButton = document.getElementById("rightArrow");

  let currentIndex = -1;
  let spanPositions = [];

  scanButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "countAsterisks" },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            displayCount(0);
          } else {
            spanPositions = response.asteriskPositions || [];
            displayCount(response.count);
            currentIndex = -1;
          }
        }
      );
    });
  });

  leftArrowButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      navigateToAsterisk(currentIndex);
    }
  });

  rightArrowButton.addEventListener("click", function () {
    if (currentIndex < spanPositions.length - 1) {
      currentIndex++;
      navigateToAsterisk(currentIndex);
    }
  });

  function displayCount(count) {
    const countElement = document.getElementById("count");
    countElement.textContent = count;
  }

  function navigateToAsterisk(index) {
    const position = spanPositions[index];
    if (position) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "navigateToAsterisk", position: position },
          function (response) {}
        );
      });
    }
  }

  // Add click event listener to the Intake Form Selector button
  const intakeFormButton = document.getElementById("intakeFormButton");
  intakeFormButton.addEventListener("click", function (event) {
    event.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabUrl = tabs[0].url;
      const newUrl = getRedirectedUrl(currentTabUrl);
      if (newUrl) {
        chrome.tabs.update(tabs[0].id, { url: newUrl });
      }
    });
  });

  // Function to get the redirected URL
  function getRedirectedUrl(url) {
    const regex = /^(https?:\/\/[^/]+\/)(.*)/;
    const match = url.match(regex);
    if (match) {
      const domain = match[1];
      return domain + "portlets/picker/capTypePickerSelector.do";
    }
    return null;
  }
});
