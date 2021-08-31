import FoodItem from './foodItem.js'
import FoodMacroDetails from './foodMacroDetails.js'

const APIKEY = "c6d22ce1aec441c2fa99e52b64a8aa25"
const appID = "f88bcc7a"

var consumedFoodList = []
var selectedCarbsPercentage = 0.5
var selectedProteinPercentage = 0.3
var selectedFatPercentage = 0.2
var selectedMacro = ""

var selectedRatioOption = 1

var calories = 1780
var caloriesLeft = 1780
var caloriesConsumed = 0
var proteinsWeightSumMax = calories * selectedProteinPercentage / 4
var carbsWeightSumMax = calories * selectedCarbsPercentage / 4
var fatWeightSumMax = calories * selectedFatPercentage / 9

var proteinsIntake = 0
var carbsIntake = 0
var fatIntake = 0

var proteinStart = 0
var proteinEnd = selectedProteinPercentage * 345 * Math.PI / 180

var carbsStart = proteinEnd + 5 * Math.PI / 180
var carbsEnd = carbsStart + selectedCarbsPercentage * 345 * Math.PI / 180

var fatStart = carbsEnd + 5 * Math.PI / 180
var fatEnd = fatStart + selectedFatPercentage * 345 * Math.PI / 180

var selectedMeal = 0
var portionNumber = 1
var selectedPortionGrams = 1
var selectedFoodCaloriesInOneGram = 0
var isPortionDropdownVisible = false
var selectedConsumedMeal = 0
var consumedListCollapsed = false
var totalCalories = 0
var group

var proteinsData = []
var carbsData = []
var fatsData = []

var proteinsLabel
var carbsLabel
var fatsLabel

var swiper = new Swiper('.swiper-container', {
  slidesPerView: 3,
  spaceBetween: 10,
  allowTouchMove: true,
  direction: 'horizontal',
});

// function that checks if the portion number is valid, if it's not then reset input to 1
const onPortionNumberInputChanged = () => {
  return (e) => {
    var value = document.getElementById('card-portion-input').value
    var z1 = /^[0-9]+$/
    if (value != "") {
      if (z1.test(value) && value <= 10000) {
        portionNumber = value
      } else {
        portionNumber = 1
        document.getElementById('card-portion-input').value = '1'
      }
    }
    totalCalories = portionNumber * selectedPortionGrams * selectedFoodCaloriesInOneGram
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(0) + " kcal"
  }
}

function removeBlueDotFromMeal() {
  switch (selectedMeal) {
    case 0:
      document.getElementById('breakfast-blue-dot').setAttribute('style', 'visibility:hidden')
      break;
    case 1:
      document.getElementById('lunch-blue-dot').setAttribute('style', 'visibility:hidden')
      break;
    default:
      document.getElementById('dinner-blue-dot').setAttribute('style', 'visibility:hidden')
  }
}

function addBlueDotToSelectedMeal(meal) {
  switch (meal) {
    case 0:
      document.getElementById('breakfast-blue-dot').setAttribute('style', 'visibility:visible')
      break;
    case 1:
      document.getElementById('lunch-blue-dot').setAttribute('style', 'visibility:visible')
      break;
    default:
      document.getElementById('dinner-blue-dot').setAttribute('style', 'visibility:visible')
  }
}

const onCardMealSelected = (meal) => {
  return (e) => {
    if (selectedMeal != meal) {
      removeBlueDotFromMeal()
      addBlueDotToSelectedMeal(meal)
      selectedMeal = meal
    }
  }
}

const onPortionSelected = (label, weight) => {
  return (e) => {
    selectedPortionGrams = weight
    var portionDropdown = document.getElementById('portion-dropdown')
    document.getElementById('portion-selection-button').textContent = label + " (" + weight + "g)"
    portionDropdown.setAttribute('style', 'visibility:hidden')
    portionDropdown.innerHTML = ""
    isPortionDropdownVisible = false
    totalCalories = portionNumber * selectedPortionGrams * selectedFoodCaloriesInOneGram
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(0) + " kcal"
  }
}

const showPortionDropDown = (options) => {
  return (e) => {
    var portionDropdown = document.getElementById('portion-dropdown')
    portionDropdown.innerHTML = ""
    if (isPortionDropdownVisible) {
      portionDropdown.setAttribute('style', 'visibility:hidden')
      isPortionDropdownVisible = false
    } else {
      var filteredOptions = options.slice(0, 5)
      var i = 0;
      for (i = 0; i < filteredOptions.length; i++) {
        var li = document.createElement('li')
        var label = filteredOptions[i].label
        var weight = filteredOptions[i].weight.toFixed(2)
        li.innerHTML = `<p>${label} (${weight} g)</p>`
        li.setAttribute('class', 'portion-dropdown-item')
        portionDropdown.appendChild(li)
        li.addEventListener("click", onPortionSelected(label, weight))
        portionDropdown.setAttribute('style', 'visibility:visible')
        isPortionDropdownVisible = true
      }
    }
  }
}

const onAddItemClicked = (foodDetails) => {
  return (e) => {
    var id = foodDetails.food.foodId
    var name = foodDetails.food.label
    var imageUrl
    if (foodDetails.food.image != null) {
      imageUrl = foodDetails.food.image
    } else {
      imageUrl = "-"
    }

    var weight = selectedPortionGrams;
    var proteinsWeight = selectedPortionGrams * foodDetails.food.nutrients.PROCNT / 100
    var fatsWeight = selectedPortionGrams * foodDetails.food.nutrients.FAT / 100
    var carbsWeight = selectedPortionGrams * foodDetails.food.nutrients.CHOCDF / 100
    var foodItem = new FoodItem(id, name, imageUrl, weight, proteinsWeight, fatsWeight, carbsWeight, selectedMeal, totalCalories)
    consumedFoodList.push(foodItem)
    updateDonutGraph(foodItem, "add")
    addItemToConsumedList(foodItem)
  }
}

function updateDonutGraph(foodItem, action) {
  var caloriesLeftOldValue = caloriesLeft
  console.log(foodItem._calories);
  console.log(foodItem._fatsWeight);
  if (action == "add") {
    proteinsIntake = proteinsIntake + foodItem._preoteinsWeight
    carbsIntake = carbsIntake + foodItem._carbsWeight
    fatIntake = fatIntake + foodItem._fatsWeight
    caloriesLeft = caloriesLeft - foodItem._calories
    caloriesConsumed = caloriesConsumed + foodItem._calories
  } else if (action == "remove") {
    proteinsIntake = proteinsIntake - foodItem._preoteinsWeight
    carbsIntake = carbsIntake - foodItem._carbsWeight
    fatIntake = fatIntake - foodItem._fatsWeight
    caloriesLeft = caloriesLeft + foodItem._calories
    caloriesConsumed = caloriesConsumed - foodItem._calories
  }

  var svg = d3.select("#donut-macro-graph")
  console.log("caloriesLeft:" + caloriesLeft);
  console.log("caloriesLeftOldValue:" + caloriesLeftOldValue);
  var arcTween = function(transition, caloriesleft, caloriesLeftOldValue) {
    transition.attrTween("d", function(d) {
      var interpolateCount = d3.interpolate(caloriesLeftOldValue, caloriesleft);
      return function(t) {
        var value = interpolateCount(t)
        if (value < 0) {
          value = value * (-1)
        }
        return middleCount.text(Math.floor(value));
      };
    });
  };

  var caloriesStatusElement = d3.select("#calorieStatusLabel")
  if (caloriesLeft < 0) {
    caloriesStatusElement.text("kcal over")
  } else {
    caloriesStatusElement.text("kcal left")
  }

  var middleCount = svg.selectAll(".middleText")
  middleCount.transition()
    .duration(800)
    .call(arcTween, caloriesLeft, caloriesLeftOldValue)

  document.getElementById("consumed-label").textContent = "Consumed" + " " + (calories - caloriesLeft).toFixed(0) + " kcal"

  proteinsData.pop()
  var pRatio
  var proteinsLabelElement = d3.select("#Proteins-label")
  if (proteinsIntake > proteinsWeightSumMax) {
    pRatio = 1
    proteinsLabel = "Proteins-" + (proteinsIntake - proteinsWeightSumMax).toFixed(0) + "g over"
    proteinsLabelElement.text(proteinsLabel)
    proteinsLabelElement.style("fill", "red")
  } else {
    proteinsLabel = "Proteins-" + (proteinsWeightSumMax - proteinsIntake).toFixed(0) + "g left"
    proteinsLabelElement.text(proteinsLabel)
    proteinsLabelElement.style("fill", "#969696")
    if (proteinsIntake == 0) {
      pRatio = 0
    } else {
      pRatio = proteinsIntake / proteinsWeightSumMax
    }
  }

  var proteinsValue = selectedProteinPercentage * 345 * pRatio
  proteinsData.push(proteinsValue)
  createChartMacroSectionForeground(proteinsData, "Proteins", group, proteinStart, "#F28482")

  var cRatio
  var carbsLabelElement = d3.select("#Carbs-label")
  if (carbsIntake > carbsWeightSumMax) {
    cRatio = 1
    carbsLabel = "Carbs -" + (carbsIntake - carbsWeightSumMax).toFixed(0) + "g over"
    carbsLabelElement.text(carbsLabel)
    carbsLabelElement.style("fill", "red")
  } else {
    carbsLabel = "Carbs-" + (carbsWeightSumMax - carbsIntake).toFixed(0) + "g left"
    carbsLabelElement.style("fill", "#969696")
    carbsLabelElement.text(carbsLabel)
    if (carbsIntake == 0) {
      cRatio = 0
    } else {
      cRatio = carbsIntake / carbsWeightSumMax
    }
  }

  carbsData.pop()
  var carbsValue = selectedProteinPercentage * 345 + 5 + selectedCarbsPercentage * 345 * cRatio
  carbsData.push(carbsValue)
  createChartMacroSectionForeground(carbsData, "Carbs", group, carbsStart, "#F6BD60")

  var fRatio
  var fatsLabelElement = d3.select("#Fats-label")

  if (fatIntake > fatWeightSumMax) {
    fRatio = 1
    fatsLabel = "Fats -" + (fatIntake - fatWeightSumMax).toFixed(0) + "g over"
    fatsLabelElement.text(fatsLabel)
    fatsLabelElement.style("fill", "red")
  } else {
    fatsLabel = "Fats-" + (fatWeightSumMax - fatIntake).toFixed(0) + "g left"
    fatsLabelElement.text(fatsLabel)
    fatsLabelElement.style("fill", "#969696")
    if (fatIntake == 0) {
      fRatio = 0
    } else {
      fRatio = fatIntake / fatWeightSumMax
    }
  }

  fatsData.pop()
  var fatsValue = selectedProteinPercentage * 345 + 2 * 5 + selectedCarbsPercentage * 345 + selectedFatPercentage * 345 * fRatio
  fatsData.push(fatsValue)
  createChartMacroSectionForeground(fatsData, "Fats", group, fatStart, "#84A59D")

  updateMacroDetailsCard(selectedMacro)
}

const setUpfoodCard = (foodDetails) => {
  return (e) => {
    var resultList = document.getElementById('result-list')
    resultList.setAttribute('style', 'visibility:visible')
    resultList.innerHTML = ""

    var image
    if (foodDetails.food.image != null) {
      image = foodDetails.food.image
    } else {
      image = "images/hamburger.png"
    }

    var foodCardContent = `<div class="card-title-image-section">
      <div class="card-titel-category">
        <p id="card-food-name" class="card-title">${foodDetails.food.label}</p>
        <p id="card-food-category" class="card-category">${foodDetails.food.category}</p>
      </div>
      <img id="card-food-image" class="food-circle-image" src="${image}" alt="">
    </div>

    <p class="card-macro-values-label card-label">Nutritional Values in 100g</p>

    <div class="card-macros-section">

      <div class="card-macro">
        <p id="calories-value" class="macro-value">${foodDetails.food.nutrients.ENERC_KCAL}</p>
        <p class="macro-name">Calories</p>
        <p class="macro-unit">Kcal</p>
      </div>

      <div class="card-macro">
        <p id="protein-value" class="macro-value">${foodDetails.food.nutrients.PROCNT}</p>
        <p class="macro-name">Protein</p>
        <p class="macro-unit">g</p>
      </div>

      <div class="card-macro">
        <p id="fats-value" class="macro-value">${foodDetails.food.nutrients.FAT}</p>
        <p class="macro-name">Fats</p>
        <p class="macro-unit">g</p>
      </div>


      <div class="card-macro">
        <p id="carbs-value" class="macro-value">${foodDetails.food.nutrients.CHOCDF}</p>
        <p class="macro-name">Carbs</p>
        <p class="macro-unit">g</p>
      </div>
    </div>

    <div class="card-portion-section">
        <p class="card-label">Portion</p>
        <input type="text" id="card-portion-input" >
        <div class="dropdown-selector">
          <button id="portion-selection-button" class="dropdown-selection-button" type="button" name="button">Slice (113g)</button>
          <ul id="portion-dropdown" class="dropdown"></ul>
        </div>
    </div>

    <div class="card-meal-section">
          <p class="card-label">Meal</p>
          <div class="meal-options">
            <div class="meal-option">
              <img id="breakfast-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
              <p id="meal-breakfast">Breakfast</p>
            </div>
            <div class="meal-option">
              <img id="lunch-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
              <p id="meal-lunch" >Lunch</p>
            </div>
            <div class="meal-option">
              <img id="dinner-blue-dot" class="blue-dot" alt="#" src="images/blue_dot.svg">
              <p id="meal-dinner">Dinner</p>
            </div>
          </div>
    </div>

    <p id="card-total-calories">-</p>

    <p id="add-food-button" class="add-button">Add</p>`


    var foodCard = document.getElementById('food-card')
    foodCard.innerHTML = foodCardContent
    foodCard.setAttribute('style', 'visibility:visible')
    document.getElementById('card-portion-input').value = '1'

    var portionSelector = document.getElementById('portion-selection-button')
    portionSelector.textContent = foodDetails.measures[0].label + " (" + foodDetails.measures[0].weight.toFixed(0) + "g)"
    selectedFoodCaloriesInOneGram = foodDetails.food.nutrients.ENERC_KCAL / 100
    selectedPortionGrams = foodDetails.measures[0].weight
    portionSelector.addEventListener("click", showPortionDropDown(foodDetails.measures))
    document.getElementById('card-portion-input').addEventListener('input', onPortionNumberInputChanged())

    document.getElementById('meal-breakfast').addEventListener('click', onCardMealSelected(0))
    document.getElementById('meal-lunch').addEventListener('click', onCardMealSelected(1))
    document.getElementById('meal-dinner').addEventListener('click', onCardMealSelected(2))

    totalCalories = foodDetails.measures[0].weight * selectedFoodCaloriesInOneGram
    console.log(totalCalories);
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(0) + " kcal"

    selectedMeal = 0
    addBlueDotToSelectedMeal(0)

    document.getElementById('add-food-button').addEventListener('click', onAddItemClicked(foodDetails))
  }
}

const onSearchQuery = () => {
  return (e) => {
    var input = document.getElementById('search-input')
    var query = input.value

    if (query.length != 0) {
      const apiData = fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${appID}&app_key=${APIKEY}&category=generic-foods`)
      apiData.then((response) => {
        return response.json()
      }).then((jsonData) => {
        console.log(jsonData)

        let items = jsonData.hints.map(item => {
          return item
        })

        var resultList = document.getElementById('result-list')
        resultList.setAttribute('style', 'visibility:visible')
        resultList.innerHTML = ""

        var foodCard = document.getElementById('food-card')
        foodCard.setAttribute('style', 'visibility:hidden')
        foodCard.innerHTML = ""
        isPortionDropdownVisible = false
        selectedMeal = 0
        portionNumber = 1
        selectedPortionGrams = 1
        selectedFoodCaloriesInOneGram = 0

        var filtered = items.slice(0, 5)

        var i = 0;
        for (i = 0; i <= filtered.length - 1; i++) {
          var li = document.createElement('li')
          li.innerHTML = `<p>${filtered[i].food.label}</p>`
          li.setAttribute('id', 'search_result')
          resultList.appendChild(li)
          li.addEventListener("click", setUpfoodCard(items[i]))
        }
      })
    } else {
      var resultList = document.getElementById('result-list')
      resultList.innerHTML = ""
    }
  }
}

const onConsumedMealSelected = (meal) => {
  return (e) => {
    if (selectedConsumedMeal != meal) {
      removeBlueDotFromConsumedMeal()
      addBlueDotToSelectedConsumedMeal(meal)
      selectedConsumedMeal = meal
      displayConsumedFoodBySelectedMeal()
    }
  }
}

function deselectRatioOption(option) {
  document.getElementById("ratio" + option + "-blue-dot")
    .setAttribute('style', 'visibility:hidden')
  var macros = document.getElementById("ratio" + option + "-macros").getElementsByTagName('p')
  var i
  for (i = 0; i < 3; i++) {
    macros[i].setAttribute('style', 'color: #969696')
  }
}

function selectRatioOption(option) {
  document.getElementById("ratio" + option + "-blue-dot")
    .setAttribute('style', 'visibility:visible')
  var macros = document.getElementById("ratio" + option + "-macros").getElementsByTagName('p')
  var i
  for (i = 0; i < 3; i++) {
    macros[i].setAttribute('style', 'color: #404040')
  }
}

const onRatioChanged = (option) => {
  return (e) => {
    if (selectedRatioOption == 1) {
      deselectRatioOption(1)
    } else if (selectedRatioOption == 2) {
      deselectRatioOption(2)
    } else {
      deselectRatioOption(3)
    }

    if (option == 1) {
      selectRatioOption(1)
      selectedRatioOption = 1
      selectedCarbsPercentage = 0.5
      selectedProteinPercentage = 0.3
      selectedFatPercentage = 0.2
    } else if (option == 2) {
      selectRatioOption(2)
      selectedRatioOption = 2
      selectedCarbsPercentage = 0.3
      selectedProteinPercentage = 0.4
      selectedFatPercentage = 0.3
    } else {
      selectRatioOption(3)
      selectedRatioOption = 3
      selectedCarbsPercentage = 0.15
      selectedProteinPercentage = 0.25
      selectedFatPercentage = 0.6
    }

    proteinEnd = selectedProteinPercentage * 345 * Math.PI / 180

    carbsStart = proteinEnd + 5 * Math.PI / 180
    carbsEnd = carbsStart + selectedCarbsPercentage * 345 * Math.PI / 180

    fatStart = carbsEnd + 5 * Math.PI / 180
    fatEnd = fatStart + selectedFatPercentage * 345 * Math.PI / 180
  }
}


function displayConsumedFoodBySelectedMeal() {
  var i
  for (i = 0; i < consumedFoodList.length; i++) {
    if (consumedFoodList[i]._meal != selectedConsumedMeal && selectedConsumedMeal != 3) {
      document.getElementById(consumedFoodList[i]._id).setAttribute('style', 'display:none')
    } else {
      document.getElementById(consumedFoodList[i]._id).setAttribute('style', 'visibility:visible')
    }
  }
}

function removeBlueDotFromConsumedMeal() {
  var dotId;
  var labelId;
  switch (selectedConsumedMeal) {
    case 0:
      dotId = 'consumed-breakfast-blue-dot'
      labelId = 'consumed-meal-breakfast'
      break;
    case 1:
      dotId = 'consumed-lunch-blue-dot'
      labelId = 'consumed-meal-lunch'
      break;
    case 2:
      dotId = 'consumed-dinner-blue-dot'
      labelId = 'consumed-meal-dinner'
      break;
    default:
      dotId = 'consumed-all-blue-dot'
      labelId = 'consumed-meal-all'
  }
  var element = document.getElementById(dotId)
  element.setAttribute('style', 'visibility:hidden')
  var text = document.getElementById(labelId)
  text.style.color = "var(--text-color-light)"
}

function addBlueDotToSelectedConsumedMeal(meal) {
  var dotId;
  var labelId;
  switch (meal) {
    case 0:
      dotId = 'consumed-breakfast-blue-dot'
      labelId = 'consumed-meal-breakfast'
      break;
    case 1:
      dotId = 'consumed-lunch-blue-dot'
      labelId = 'consumed-meal-lunch'
      break;
    case 2:
      dotId = 'consumed-dinner-blue-dot'
      labelId = 'consumed-meal-dinner'
      break;
    default:
      dotId = 'consumed-all-blue-dot'
      labelId = 'consumed-meal-all'
  }
  var element = document.getElementById(dotId)
  element.setAttribute('style', 'visibility:visible')
  var text = document.getElementById(labelId)
  text.style.color = "var(--text-color-dark)"
}

function addItemToConsumedList(foodDetails) {
  consumedListCollapsed = false
  var consumedButtonExpand = document.getElementById('expand-consumed-button')
  consumedButtonExpand.className = "expand-consumed-button"
  consumedButtonExpand.setAttribute('style', 'visibility:visible')
  document.getElementById('swiper-wrapper').setAttribute('style', 'visibility:visible')
  document.getElementById('search-input').value = ""

  var foodCard = document.getElementById('food-card')
  foodCard.setAttribute('style', 'visibility:hidden')
  foodCard.innerHTML = ""

  var foodItem = document.createElement('div')
  foodItem.classList.add('food-item')
  foodItem.id = foodDetails._id
  var foodItems = document.getElementById('swiper-wrapper')
  var image
  if (foodDetails._imageUrl == "-") {
    image = "images/hamburger.png"
  } else {
    image = foodDetails._imageUrl
  }
  var foodItemContent = `<img id="food-item-image" class="food-circle-image" src="${image}" alt="">
        <p class="food-list-item-title">${foodDetails._name}</p>
        <p class="food-list-item-weight">${foodDetails._weight}g</p>
        <button class="delete-button"></button>`
  foodItem.innerHTML = foodItemContent
  foodItems.append(foodItem)
  foodItem.getElementsByClassName('delete-button')[0].addEventListener('click', removeItem(foodDetails._id))

  displayConsumedFoodBySelectedMeal()
}

const removeItem = (foodId) => {
  return (e) => {
    var i
    var index
    var foodItemData
    for (i = 0; i < consumedFoodList.length; i++) {
      if (foodId == consumedFoodList[i]._id) {
        index = i
        foodItemData = consumedFoodList[i]
      }
    }

    var foodItem = document.getElementById(foodId)
    foodItem.remove()
    consumedFoodList.splice(index, 1)
    updateDonutGraph(foodItemData, "remove")
    if (consumedFoodList.length < 1) {
      document.getElementById('expand-consumed-button').setAttribute('style', 'visibility:hidden')
    }
  }
}

const onCollapseConsumedListClicked = () => {
  return (e) => {
    if (consumedListCollapsed) {
      consumedListCollapsed = false
      document.getElementById('expand-consumed-button').className = "expand-consumed-button"
      document.getElementById('swiper-wrapper').setAttribute('style', 'visibility:visible')
    } else {
      consumedListCollapsed = true
      document.getElementById('expand-consumed-button').className = "collapse-consumed-button"
      document.getElementById('swiper-wrapper').setAttribute('style', 'display:none')
    }
  }
}

const onPopupDoneClick = () => {
  var input = document.getElementById("calories-input")
  var caloriesInput = input.value
  var z1 = /^[0-9]+$/
  var errorInput = document.getElementById("calories-input-error")
  if (caloriesInput == "") {
    errorInput.textContent = "Please fill out this field!"
  } else if (!z1.test(caloriesInput) || caloriesInput < 500 || caloriesInput > 20000) {
    errorInput.textContent = "Input should be number from 500 to 20000!"
  } else {
    calories = caloriesInput
    caloriesLeft = caloriesInput

    document.getElementById("calories-info-label").textContent = "Calories: " + caloriesInput + " kcal"
    var ratioLabel = document.getElementById("ratio-info-label")
    if (selectedRatioOption == 1) {
      ratioLabel.textContent = "Ratio:   " + "50% Carbs,  30% Proteins,  20% Fats"
    } else if (selectedRatioOption == 2) {
      ratioLabel.textContent = "Ratio:  " + "30% Carbs, 40% Proteins, 30% Fats"
    } else {
      ratioLabel.textContent = "Ratio:  " + "15% Carbs, 25% Proteins, 60% Fats"
    }

    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    initializeChart()
  }
}

function initializeChart() {
  var width = 240
  var height = 240

  var radius = Math.min(width, height) / 2

  var svg = d3.select("#donut-macro-graph")
    .append('svg')
    .attr('width', 480)
    .attr('height', 480)
    .attr('transform-origin', "center center")
    .append('g')
    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")")

  var circle = svg.append("circle")
    .attr("cx", "0")
    .attr("cy", "0")
    .attr("r", "180")
    .attr("style", "stroke-width:1; fill:white;")
    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

  var middleCount = svg.append('text')
    .datum(calories)
    .text(function(d) {
      return d;
    })
    .attr("class", "middleText")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");

  svg.append('text')
    .attr("id", "calorieStatusLabel")
    .text("kcal left")
    .attr("x", (240 / 2))
    .attr("y", (240 / 2) + 25)
    .attr("class", "middleTextLabel")
    .attr("text-anchor", "middle");

  group = svg.append("g")
    .attr("transform", 'translate(120, 120)');

  createInnerShadowFilter(svg)
  createChartMacroSectionBackground(group, "Proteins", proteinStart, proteinEnd)
  createChartMacroSectionBackground(group, "Carbs", carbsStart, carbsEnd)
  createChartMacroSectionBackground(group, "Fats", fatStart, fatEnd)

  proteinsData.push(selectedProteinPercentage * 345 * 0)
  carbsData.push(selectedProteinPercentage * 345 + 5 + selectedCarbsPercentage * 345 * 0)
  fatsData.push(selectedProteinPercentage * 345 + 2 * 5 + selectedCarbsPercentage * 345 + selectedFatPercentage * 345 * 0)

  createChartMacroSectionForeground(proteinsData, "Proteins", group, proteinStart, "#FFFFFF")
  createChartMacroSectionForeground(carbsData, "Carbs", group, carbsStart, "#FFFFFF")
  createChartMacroSectionForeground(fatsData, "Fats", group, fatStart, "#FFFFFF")
}

document.addEventListener("DOMContentLoaded", function() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  document.getElementById("popup-done-button").addEventListener('click', onPopupDoneClick)

  const form = document.querySelector('input')
  form.addEventListener("keyup", onSearchQuery());
  document.getElementById('consumed-meal-breakfast').addEventListener('click', onConsumedMealSelected(0))
  document.getElementById('consumed-meal-lunch').addEventListener('click', onConsumedMealSelected(1))
  document.getElementById('consumed-meal-dinner').addEventListener('click', onConsumedMealSelected(2))
  document.getElementById('consumed-meal-all').addEventListener('click', onConsumedMealSelected(3))
  document.getElementById('expand-consumed-button').addEventListener('click', onCollapseConsumedListClicked())

  document.getElementById('ratio1-macros').addEventListener('click', onRatioChanged(1))
  document.getElementById('ratio2-macros').addEventListener('click', onRatioChanged(2))
  document.getElementById('ratio3-macros').addEventListener('click', onRatioChanged(3))

  document.getElementById('card-macro-close-btn').addEventListener('click', onCloseMacroCard())
});

const onCloseMacroCard = () => {
  return (e) => {
    var macroCard = document.getElementById('card-macro-details')
    macroCard.style.display = "none";
  }
}

function createInnerShadowFilter(svg) {
  var defs = svg.append("defs");

  var filter = defs.append("filter")
    .attr("id", "dropshadow")

  filter.append("feOffset")
    .attr('dx', 0)
    .attr('dy', 0);

  filter.append("feGaussianBlur")
    .attr("stdDeviation", 4)
    .attr("result", "offset-blur")

  filter.append("feComposite")
    .attr("operator", 'out')
    .attr("in", "SourceGraphic")
    .attr("in2", 'offset-blur')
    .attr("result", "inverse")

  filter.append("feFlood")
    .attr("flood-color", 'black')
    .attr("flood-opacity", .6)
    .attr("result", 'color')

  filter.append("feComposite")
    .attr("operator", "in")
    .attr("in", "color")
    .attr("in2", 'inverse')
    .attr("result", "shadow")

  filter.append("feComposite")
    .attr("operator", "over")
    .attr("in", "shadow")
    .attr("in2", "SourceGraphic")
}


function createChartMacroSectionBackground(group, macroName, startAngle, endAngle) {
  var innerRadius = 134;
  var outerRadius = 170;

  var background = group.append('path')
    .attr("id", macroName + "-path")
    .attr('d', d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(5)
    )
    .attr('fill', "#FFFFFF")
    .style("opacity", 0.7)

    .attr("filter", "url(#dropshadow)")

  var text = group.append("text")
    .attr("dx", 15)
    .attr("dy", -20)

  var label
  if (macroName == "Proteins") {
    proteinsLabel = "Proteins-" + (proteinsWeightSumMax - proteinsIntake).toFixed(0) + "g left"
    label = proteinsLabel
  } else if (macroName == "Carbs") {
    carbsLabel = "Carbs-" + (carbsWeightSumMax - carbsIntake).toFixed(0) + "g left"
    label = carbsLabel
  } else {
    fatsLabel = "Fats-" + (fatWeightSumMax - fatIntake).toFixed(0) + "g left"
    label = fatsLabel
  }

  text.append("textPath")
    .attr("id", macroName + "-label")
    .attr("class", "macro-labels")
    .attr("xlink:href", "#" + macroName + "-path")
    .text(label)

  var textElement = document.getElementById(macroName + "-label")
  textElement.addEventListener('click', onMacroClick(macroName))
}

const onMacroClick = (macroName) => {
  return (e) => {
    selectedMacro = macroName
    updateMacroDetailsCard(macroName)
    var macroCard = document.getElementById('card-macro-details')
    macroCard.style.display = "block";
  }
}

function updateMacroDetailsCard(macroName) {
  if (macroName != "") {
    var rotationAngle
    var macroCard = document.getElementById('card-macro-details')
    var borderColor

    var dataList = []
    console.log("Consumed list cool:" + consumedFoodList);
    if (macroName == "Proteins") {
      borderColor = "#F28482"
      var i
      var proteinsAngle = proteinEnd * 180 / Math.PI
      rotationAngle = 270 - proteinsAngle / 2
      for (i = 0; i < consumedFoodList.length; i++) {
        if (consumedFoodList[i]._preoteinsWeight > 0) {
          var foodItem = consumedFoodList[i]
          var percentage = foodItem._preoteinsWeight / proteinsIntake
          var foodMacroItem = new FoodMacroDetails(foodItem._id, foodItem._name, percentage)
          dataList.push(foodMacroItem)
        }
      }
      document.getElementById('card-details-title').textContent = proteinsLabel

    } else if (macroName == "Carbs") {
      borderColor = "#F6BD60"
      var i
      var carbsAngle = (carbsStart + (carbsEnd - carbsStart) / 2) * 180 / Math.PI
      rotationAngle = 270 - carbsAngle
      for (i = 0; i < consumedFoodList.length; i++) {
        if (consumedFoodList[i]._carbsWeight > 0) {
          var foodItem = consumedFoodList[i]
          var percentage = foodItem._carbsWeight / carbsIntake
          var foodMacroItem = new FoodMacroDetails(foodItem._id, foodItem._name, percentage)
          dataList.push(foodMacroItem)
        }
      }
      document.getElementById('card-details-title').textContent = carbsLabel
    } else if (macroName == "Fats") {
      borderColor = "#84A59D"
      var i
      var fatsAngle = (fatStart + (fatEnd - fatStart) / 2) * 180 / Math.PI
      rotationAngle = 270 - fatsAngle
      for (i = 0; i < consumedFoodList.length; i++) {
        if (consumedFoodList[i]._fatsWeight > 0) {
          var foodItem = consumedFoodList[i]
          console.log(foodItem);
          var percentage = foodItem._fatsWeight / fatIntake
          var foodMacroItem = new FoodMacroDetails(foodItem._id, foodItem._name, percentage)
          dataList.push(foodMacroItem)
        }
      }
      document.getElementById('card-details-title').textContent = fatsLabel
    }

    group
      .transition()
      .duration(2000)
      .attr("transform", 'translate(120, 120) rotate(' + rotationAngle + ')')

    macroCard.style.borderColor = borderColor

    var macroDetailsList = document.getElementById('macros')
    macroDetailsList.innerHTML = ""
    console.log("datalist:" + dataList);
    dataList.sort((a, b) => {
      return b._percentage - a._percentage;
    });

    for (i = 0; i < dataList.length; i++) {
      console.log("listaa:" + dataList[i]);
      var li = document.createElement('li')
      li.innerHTML = `<div class="macro-item-labels">
      <p class="macro-item-name">${dataList[i]._name}</p>
      <p class="macro-item-percentage">${(dataList[i]._percentage*100).toFixed(1)}%</p>
    </div>
    <div class="item-percentage" style="width:${dataList[i]._percentage*240}px"></div>`
      li.setAttribute('id', 'macro-list-item')
      macroDetailsList.appendChild(li)
    }
  }
}

function createChartMacroSectionForeground(data, macroName, svg, startAngle, color) {

  var innerRadius = 134;
  var outerRadius = 170;

  var foreground = svg.selectAll("path." + macroName + "-path").data(data)

  var drawArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(5)
    .startAngle(startAngle)
    .endAngle(function(d, i) {
      return Math.floor((d * (Math.PI / 180)) * 1000) / 1000;
    });

  function arcTween(d, indx) {
    var interp = d3.interpolate(this._current, d);
    this._current = d;
    return function(t) {
      var tmp = interp(t);
      return drawArc(tmp, indx);
    }
  };

  foreground.transition()
    .duration(800)
    .attr("fill", color)
    .attrTween("d", arcTween);

  foreground.enter().append("svg:path")
    .attr("class", macroName + "-path")
    .attr("fill", color)
    .attr("d", drawArc)
    .attr("filter", "url(#dropshadow)")
    .each(function(d) {
      this._current = d;
    });

}
