class FurnitureHeightFittingModel {
  constructor() {
    this.unitUsed = "SI";

    this.unscaledFurnitureHeights = {
      "chests-height" : 137.16,
      "bookcases-height": 208.28,
      "beds-lower-height": 55.88,
      "beds-upper-height": 60.96,
      "tables-height": 73.66,
      "seats-and-coffee-tables-lower-height": 40.64,
      "seats-and-coffee-tables-upper-height": 45.72,
      "cabinets-height": 81.28,
      "wardrobes-height": 182.88
    };
    
    this.unscaledUserHeight = 175.26;
    this.userHeight = this.unscaledUserHeight;
    this.controller = undefined;
  }
  
  setController(controller) {
    this.controller = controller;
  }
  
  setUnitUsed(newUnitUsed) {
    this.unitUsed = newUnitUsed;
    this.controller.handleUnitUsedChange();
  }

  setUserHeight(newHeight) {
    this.userHeight = newHeight;
    this.controller.handleUserHeightUpdate();
  }

  getScaledFurnitureHeight() {
    var scaleFactor = this.userHeight / this.unscaledUserHeight;
    var scaledFurnitureHeights = {};
    
    for (var furnitureType in this.unscaledFurnitureHeights) {
      scaledFurnitureHeights[furnitureType] = this.unscaledFurnitureHeights[furnitureType] * scaleFactor;
    }
    
    return scaledFurnitureHeights;
  } 
}