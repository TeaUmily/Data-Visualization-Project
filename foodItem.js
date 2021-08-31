export default class FoodItem {
  constructor(id, name, imageUrl, weight, proteinsWeight, fatsWeight, carbsWeight, meal, calories) {
    this._id = id
    this._name = name
    this._imageUrl = imageUrl
    this._weight = weight
    this._preoteinsWeight = proteinsWeight
    this._fatsWeight = fatsWeight
    this._carbsWeight = carbsWeight
    this._meal = meal
    this._calories = calories
  }
}
