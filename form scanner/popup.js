document.addEventListener("DOMContentLoaded", function () {
  const scanButton = document.getElementById("scanButton");
  const leftArrowButton = document.getElementById("leftArrow");
  const rightArrowButton = document.getElementById("rightArrow");

  let currentIndex = -1;
  let spanPositions = [];
  let count = 0;

  // Retrieve stored values when the popup is opened
  chrome.storage.local.get(["currentIndex", "spanPositions", "count"], function(result) {
    currentIndex = result.currentIndex || -1;
    spanPositions = result.spanPositions || [];
    count = result.count || 0;
    displayCount(count);  // display the stored count
  });

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
            // Save spanPositions in storage
            chrome.storage.local.set({spanPositions: spanPositions}, function() {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              }
            });
            count = response.count;
            displayCount(count);
            // Save count in storage
            chrome.storage.local.set({count: count}, function() {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              }
            });
            currentIndex = -1;
            // Save currentIndex in storage
            chrome.storage.local.set({currentIndex: currentIndex}, function() {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              }
            });
          }
        }
      );
    });
  });

  leftArrowButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      navigateToAsterisk(currentIndex);
      // Save currentIndex in storage
      chrome.storage.local.set({currentIndex: currentIndex}, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  });

  rightArrowButton.addEventListener("click", function () {
    if (currentIndex < spanPositions.length - 1) {
      currentIndex++;
      navigateToAsterisk(currentIndex);
      // Save currentIndex in storage
      chrome.storage.local.set({currentIndex: currentIndex}, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
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
  intakeFormButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabUrl = tabs[0].url;
      const newUrl = getRedirectedUrl(currentTabUrl);
      if (newUrl) {
        chrome.tabs.create({ url: newUrl });
      }
    });
  });

  // Function to get the redirected URL
  function getRedirectedUrl(url) {
    const regex = /^(https?:\/\/[^/]+\/).*$/;
    const match = url.match(regex);
    if (match) {
      const domain = match[1];
      return domain + "portlets/picker/capTypePickerSelector.do";
    }
    return null;
  }
});
