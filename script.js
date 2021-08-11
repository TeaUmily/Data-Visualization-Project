import FoodItem  from './foodItem.js';

const APIKEY = "c6d22ce1aec441c2fa99e52b64a8aa25"
const appID = "f88bcc7a"

var consumedFoodList = [];

var selectedMeal = 0
var portionNumber = 1
var selectedPortionGrams = 1
var selectedFoodCaloriesInOneGram = 0
var isPortionDropdownVisible = false

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
    console.log("On add item clicked called");
    var id = foodDetails.food.foodId
    var name = foodDetails.food.label
    var imageUrl = foodDetails.food.image
    var weight = selectedPortionGrams;
    var proteinsWeight = selectedPortionGrams*foodDetails.food.nutrients.PROCNT/100
    var fatsWeight = selectedPortionGrams*foodDetails.food.nutrients.FAT/100
    var carbsWeight = selectedPortionGrams*foodDetails.food.nutrients.CHOCDF/100
    // check if in list exists food with same id and just update
    var foodItem = new FoodItem(id, name, imageUrl, weight, proteinsWeight, fatsWeight, carbsWeight, selectedMeal)
    consumedFoodList.push(foodItem)
    console.log(consumedFoodList)
  }
}

const setUpfoodCard = (foodDetails) => {
  return (e) => {
    console.log(foodDetails)

    var resultList = document.getElementById('result-list')
    resultList.setAttribute('style', 'visibility:visible')
    resultList.innerHTML = ""

    document.getElementById('card-food-name').textContent = foodDetails.food.label
    document.getElementById('card-food-category').textContent = foodDetails.food.category
    document.getElementById('calories-value').textContent = foodDetails.food.nutrients.ENERC_KCAL
    document.getElementById('protein-value').textContent = foodDetails.food.nutrients.PROCNT
    document.getElementById('fats-value').textContent = foodDetails.food.nutrients.FAT
    document.getElementById('carbs-value').textContent = foodDetails.food.nutrients.CHOCDF
    document.getElementById('card-portion-input').value = '1'
    document.getElementById('food-card').setAttribute('style', 'visibility:visible')

    if(foodDetails.food.image != null) {
        document.getElementById('card-food-image').src = foodDetails.food.image
    } else {
        document.getElementById('card-food-image').src = "images/hamburger.png"
    }

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
          document.getElementById('food-card').setAttribute('style', 'visibility:hidden')
          var portionDropdown = document.getElementById('portion-dropdown')
          portionDropdown.setAttribute('style', 'visibility:hidden')
          removeBlueDotFromMeal(selectedMeal)
          portionDropdown.innerHTML = ""
          isPortionDropdownVisible = false
          selectedMeal = 0
          portionNumber = 1
          selectedPortionGrams = 1
          selectedFoodCaloriesInOneGram = 0

           var filtered = items.slice(0, 10)

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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('input');
    form.addEventListener("keyup", onSearchQuery());
});
