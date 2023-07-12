document.addEventListener("DOMContentLoaded", function () {
  const countButton = document.getElementById("countButton");
  const leftArrowButton = document.getElementById("leftArrow");
  const rightArrowButton = document.getElementById("rightArrow");

  let currentIndex = -1;
  let asteriskPositions = [];

  countButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "countAsterisks" },
        function (response) {
          if (chrome.runtime.lastError) {
            // Handle the error gracefully
            console.error(chrome.runtime.lastError);
            displayCount(0);
          } else {
            displayCount(response.count);
            currentIndex = -1;
            asteriskPositions = response.asteriskPositions;
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
    if (currentIndex < asteriskPositions.length - 1) {
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
        function (response) {}
      );
    });
  }
});
