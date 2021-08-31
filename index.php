<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https: //d3js.org/d3.v4.js"></script>
  <link rel="stylesheet" href="./style.css">
  <script type="module" src="script.js" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.6.0/d3.min.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <title>Daily Macros</title>
</head>

<body>
  <div class="container">
    <h1>Daily Macros</h1>
    <div id="search_and_card">
      <input type="text" id="search-input" placeholder="Search for food..">
      <ul id="result-list"></ul>

      <div id="food-card">
      </div>
    </div>

    <div id="donut-macro-graph">
    </div>

    <div class="input-info">
      <p id="calories-info-label"></p>
      <p id="ratio-info-label"></p>
    </div>

    <div id="card-macro-details" class="card-macro-details">
      <p id="card-details-title" class="card-details-title">Proteins</p>
      <button id="card-macro-close-btn" class="card-macro-close-btn"></button>
      <ul id="macros">
      </ul>
    </div>

    <div class="bottom">
      <div class="consumed-top-section">
        <p id="consumed-label">Consumed 0 kcal</p>
        <button id="expand-consumed-button" type="button" name="button" class="expand-consumed-button"></button>
      </div>

      <div class=" consumed-meal-options meal-options">
        <div class="meal-option">
          <img id="consumed-breakfast-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
          <p id="consumed-meal-breakfast">Breakfast</p>
        </div>
        <div class="meal-option">
          <img id="consumed-lunch-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
          <p id="consumed-meal-lunch">Lunch</p>
        </div>
        <div class="meal-option">
          <img id="consumed-dinner-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
          <p id="consumed-meal-dinner">Dinner</p>
        </div>
        <div class="meal-option">
          <img id="consumed-all-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
          <p id="consumed-meal-all">All</p>
        </div>
      </div>
      <div class="swiper-container">
        <div id="swiper-wrapper"></div>
      </div>
    </div>
  </div>

  <!-- The Modal -->
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-body">
        <div class="calories-intake-section">
          <p class="calories-intake-label">Enter daily calories (kcal) intake</p>
          <input type="text" id="calories-input" placeholder="1780">
          <p id="calories-input-error"></p>
        </div>
        <div class="ratio-selector">
          <p>Select macros ratio</p>
          <div class="ratio-option">
            <img id="ratio1-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
            <div id="ratio1-macros" class="ratio-macros">
              <p>50% Carbs</p>
              <p>30% Proteins</p>
              <p>20% Fats</p>
            </div>
          </div>
          <div class="ratio-option">
            <img id="ratio2-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
            <div id="ratio2-macros" class="ratio-macros">
              <p>30% Carbs</p>
              <p>40% Proteins</p>
              <p>30% Fats</p>
            </div>
          </div>
          <div class="ratio-option">
            <img id="ratio3-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
            <div id="ratio3-macros" class="ratio-macros">
              <p>15% Carbs</p>
              <p>25% Proteins</p>
              <p>60% Fats</p>
            </div>
          </div>
        </div>
        <p id="popup-done-button" class="popup-done-button">Done</p>

      </div>
    </div>
</body>

</html>
