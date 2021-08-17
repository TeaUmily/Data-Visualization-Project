import FoodItem  from './foodItem.js';

const APIKEY = "c6d22ce1aec441c2fa99e52b64a8aa25"
const appID = "f88bcc7a"

var consumedFoodList = [];

var selectedMeal = 0
var portionNumber = 1
var selectedPortionGrams = 1
var selectedFoodCaloriesInOneGram = 0
var isPortionDropdownVisible = false
var selectedConsumedMeal = 0
var consumedListCollapsed = false

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
    if(value != "" && z1.test(value) && value <= 10000) {
      portionNumber = value
    } else {
      portionNumber = 1
      document.getElementById('card-portion-input').value = '1'
    }
    var totalCalories = portionNumber*selectedPortionGrams*selectedFoodCaloriesInOneGram
    console.log(totalCalories);
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(2) + " kcal"
  }
}

function removeBlueDotFromMeal() {
  switch(selectedMeal) {
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
  switch(meal) {
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

// function that controls selecting and deselecting of meal
const onCardMealSelected = (meal) => {
  return (e) => {
    console.log(selectedMeal)
    if(selectedMeal != meal) {
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
    document.getElementById('portion-selection-button').textContent = label + " ("+weight+"g)"
    portionDropdown.setAttribute('style', 'visibility:hidden')
    portionDropdown.innerHTML = ""
    isPortionDropdownVisible = false
    // update total calories
    var totalCalories = portionNumber*selectedPortionGrams*selectedFoodCaloriesInOneGram
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(2) + " kcal"
  }
}

const showPortionDropDown = (options) => {
  return (e) => {
    console.log(options)
    var portionDropdown = document.getElementById('portion-dropdown')
    portionDropdown.innerHTML = ""
    if(isPortionDropdownVisible) {
      portionDropdown.setAttribute('style', 'visibility:hidden')
      isPortionDropdownVisible = false
    } else {
      var filteredOptions = options.slice(0, 5)
      var i = 0;
      for (i = 0; i < filteredOptions.length; i++) {
        console.log(i)
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
    console.log("on Click");
    var id = foodDetails.food.foodId
    var name = foodDetails.food.label
    var imageUrl
    if(foodDetails.food.image != null) {
      imageUrl = foodDetails.food.image
    } else {
      imageUrl = "-"
    }

    var weight = selectedPortionGrams;
    var proteinsWeight = selectedPortionGrams*foodDetails.food.nutrients.PROCNT/100
    var fatsWeight = selectedPortionGrams*foodDetails.food.nutrients.FAT/100
    var carbsWeight = selectedPortionGrams*foodDetails.food.nutrients.CHOCDF/100
    // check if in list exists food with same id and just update
    var foodItem = new FoodItem(id, name, imageUrl, weight, proteinsWeight, fatsWeight, carbsWeight, selectedMeal)
    consumedFoodList.push(foodItem)
    console.log(consumedFoodList)
    addItemToConsumedList(foodItem)
  }
}

const setUpfoodCard = (foodDetails) => {
  return (e) => {
    console.log(foodDetails)

    var resultList = document.getElementById('result-list')
    resultList.setAttribute('style', 'visibility:visible')
    resultList.innerHTML = ""

    var image
    if(foodDetails.food.image != null) {
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
        <input type="number" min="1" max="10000" id="card-portion-input" >
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

    var portionSelector =  document.getElementById('portion-selection-button')
    portionSelector.textContent = foodDetails.measures[0].label + " ("+foodDetails.measures[0].weight.toFixed(2)+"g)"
    selectedFoodCaloriesInOneGram = foodDetails.food.nutrients.ENERC_KCAL/100
    selectedPortionGrams = foodDetails.measures[0].weight
    portionSelector.addEventListener("click", showPortionDropDown(foodDetails.measures))
    document.getElementById('card-portion-input').addEventListener('input', onPortionNumberInputChanged())

    document.getElementById('meal-breakfast').addEventListener('click', onCardMealSelected(0))
    document.getElementById('meal-lunch').addEventListener('click', onCardMealSelected(1))
    document.getElementById('meal-dinner').addEventListener('click', onCardMealSelected(2))

    var totalCalories = foodDetails.measures[0].weight*selectedFoodCaloriesInOneGram
    document.getElementById('card-total-calories').textContent = totalCalories.toFixed(2) + " kcal"

    selectedMeal = 0
    addBlueDotToSelectedMeal(0)

    document.getElementById('add-food-button').addEventListener('click', onAddItemClicked(foodDetails))
  }
}

const onSearchQuery = () => {
  return (e) => {
    var input = document.getElementById('search-input')
    var query = input.value

    if(query.length != 0) {
      const apiData = fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${appID}&app_key=${APIKEY}&category=generic-foods`)
      apiData.then((response) => {
        return response.json()}).then((jsonData) => {
          console.log(jsonData)

          let items = jsonData.hints.map(item => {
            return item
          })

          var resultList = document.getElementById('result-list')
          resultList.setAttribute('style', 'visibility:visible')
          resultList.innerHTML = ""

          // reset food card and hide it
          var foodCard = document.getElementById('food-card')
          foodCard.setAttribute('style', 'visibility:hidden')
          foodCard.innerHTML = ""
          isPortionDropdownVisible = false
          selectedMeal = 0
          portionNumber = 1
          selectedPortionGrams = 1
          selectedFoodCaloriesInOneGram = 0

           var filtered = items.slice(0, 7)

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
    if(selectedConsumedMeal != meal) {
      removeBlueDotFromConsumedMeal()
      addBlueDotToSelectedConsumedMeal(meal)
      selectedConsumedMeal = meal
      displayConsumedFoodBySelectedMeal()
    }
  }
}


function displayConsumedFoodBySelectedMeal() {
  var i
  for(i=0; i<consumedFoodList.length; i++) {
    if(consumedFoodList[i]._meal != selectedConsumedMeal && selectedConsumedMeal != 3) {
      document.getElementById(consumedFoodList[i]._id).setAttribute('style', 'display:none')
      } else {
      document.getElementById(consumedFoodList[i]._id).setAttribute('style', 'visibility:visible')
    }
  }
}


function removeBlueDotFromConsumedMeal() {
  var dotId;
  var labelId;
  switch(selectedConsumedMeal) {
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
  switch(meal) {
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
  if(foodDetails._imageUrl == "-") {
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
    for (i=0; i<consumedFoodList.length; i++) {
      console.log(consumedFoodList);
      if(foodId == consumedFoodList[i]._id) {
        index = i
      }
    }
   var foodItem = document.getElementById(foodId)
   foodItem.remove()
   consumedFoodList.splice(index, 1)
   if(consumedFoodList.length < 1) {
     document.getElementById('expand-consumed-button').setAttribute('style', 'visibility:hidden')
   }
  }
}

const onCollapseConsumedListClicked = () => {
  return (e) => {
    if(consumedListCollapsed) {
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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('input')
    form.addEventListener("keyup", onSearchQuery());
    document.getElementById('consumed-meal-breakfast').addEventListener('click', onConsumedMealSelected(0))
    document.getElementById('consumed-meal-lunch').addEventListener('click', onConsumedMealSelected(1))
    document.getElementById('consumed-meal-dinner').addEventListener('click', onConsumedMealSelected(2))
    document.getElementById('consumed-meal-all').addEventListener('click', onConsumedMealSelected(3))
    document.getElementById('expand-consumed-button').addEventListener('click', onCollapseConsumedListClicked())

    //both female and male data
var totals = [{
     title: "Soft-serve",
     value: 286,
     all: 1098
     },
     {
     title: "Scooped",
     value: 472,
     all: 1098
     },
     {
     title: "No Preference",
     value: 318,
     all: 1098
     },
     {
     title: "Not Sure",
     value: 22,
     all: 1098
     }
];//female
var femaleData = [{
     title: "Soft-serve",
     value: 25,
     all: 100
     },
     {
     title: "Scooped",
     value: 44,
     all: 100
     },
     {
     title: "No Preference",
     value: 28,
     all: 100
     },
     {
     title: "Not Sure",
     value: 3,
     all: 100
     }
];//male
var maleData = [{
     title: "Soft-serve",
     value: 27,
     all: 100
     },
     {
     title: "Scooped",
     value: 42,
     all: 100
     },
     {
     title: "No Preference",
     value: 30,
     all: 100
     },
     {
     title: "Not Sure",
     value: 2,
     all: 100
     }
];



    var color = d3.scaleOrdinal(d3.schemeCategory20c);//Or this one for a customized color scheme:
    var color = d3.scaleOrdinal()
    .range(["#5A39AC", "#DD98D6", "#E7C820", "#08B2B2"]);
    
    var radius = Math.min(360, 360)/2
    var svg = d3.select("#donut-macro-graph")
     .append('svg')
     .attr('width', 360)
     .attr('height', 360)
     .append('g')
     .attr('transform', 'translate(' + (360 / 2) + ',' + (360 / 2) + ')');

     var arc = d3.arc()
     .innerRadius(radius - 75)
     .outerRadius(radius);var pie = d3.pie()
     .value(function (d) {
          return d.value;
     })
     .sort(null);var path = svg.selectAll('path')
     .data(pie(totals))
     .enter()
     .append('path')
     .attr('d', arc)
     .attr('fill', function (d, i) {
          return color(d.data.title);
     })
     .attr('transform', 'translate(0, 0)')
});
