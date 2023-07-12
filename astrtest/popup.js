document.addEventListener("DOMContentLoaded", function () {
  const countButton = document.getElementById("countButton");
  const leftArrowButton = document.getElementById("leftArrow");
  const rightArrowButton = document.getElementById("rightArrow");

  let currentIndex = -1;
  let asteriskCount = 0;

  countButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "countAsterisks" },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            displayCount(0);
          } else {
            asteriskCount = response.count || 0;
            displayCount(asteriskCount);
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
    if (currentIndex < asteriskCount - 1) {
      currentIndex++;
      navigateToAsterisk(currentIndex);
    }
  });

  function displayCount(count) {
    const countElement = document.getElementById("count");
    countElement.textContent = count;
  }

  function navigateToAsterisk(index) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "navigateToAsterisk", index: index },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (response && response.success) {
            const top = response.top;
            chrome.tabs.executeScript(
              tabs[0].id,
              { code: `window.scrollTo({top: ${top}, behavior: "smooth"});` }
            );
          }
        }
      );
    });
  }
});
