


function resizeDiagramToFitPageHeight() {
  var viewportHeight = $('body').height();
  var viewportWidth = $('body').width();
  
  var diagramUnscaledHeight = $('#diagram-container').height();
  var diagramUnscaledWidth = $('#diagram-container').width();
  
  var diagramScaleRatio = viewportHeight / diagramUnscaledHeight;

  if (diagramUnscaledWidth * diagramScaleRatio > viewportWidth) {
    diagramScaleRatio = (viewportWidth / diagramUnscaledWidth);
  }
  
  $("#diagram-container").css({transform: 'scale(' + diagramScaleRatio + ',' + diagramScaleRatio + ')'});
  
  var diagramScaledWidth = diagramScaleRatio * diagramUnscaledWidth;
  $("#diagram-container").css('left', (viewportWidth/2) - (diagramScaledWidth / 2) + 'px');
}

class FurnitureHeightFittingModel {
  constructor() {
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
  
  getScaledFurnitureHeight() {
    var scaleFactor = this.userHeight / this.unscaledUserHeight;
    var scaledFurnitureHeights = {};
    
    for (var furnitureType in this.unscaledFurnitureHeights) {
      scaledFurnitureHeights[furnitureType] = this.unscaledFurnitureHeights[furnitureType] * scaleFactor;
    }
    
    return scaledFurnitureHeights;
  }
  
  setUserHeight(newHeight) {
    this.userHeight = newHeight;
    this.controller.updateFurnitureMeasurement();
  }
}

class FurnitureHeightFittingController {
  constructor(model) {
    this.model = model;
    this.view = {
      "unitUsed" : "SI"
    };    
  }
  
  initializeView() {
    this.updateUserInputUnitDisplay();
    this.updateFurnitureMeasurement();
  }
  
  registerHandler() {
    $(window).resize(resizeDiagramToFitPageHeight);
    $("#current-unit").on('click', this.handleToggleUnitsUsed.bind(this));    
    $("#user-height-input-cm").on('input', this.handleUserCmHeightInputChange.bind(this));
    $("#user-height-input-feet").on('input', this.handleUserUSHeightInputChange.bind(this));
    $("#user-height-input-inch").on('input', this.handleUserUSHeightInputChange.bind(this));    

  }
  
  handleUserCmHeightInputChange(event) {
    var newUserHeightInputString = $("#user-height-input-cm").val();
    var newUserHeight = parseFloat(newUserHeightInputString);
    if (!Number.isNaN(newUserHeight)) {
      this.model.setUserHeight(newUserHeight);
    }
  }

  handleUserUSHeightInputChange(event) {
    var newUserHeightFeetInputString = $("#user-height-input-feet").val();
    var newUserHeightFeet = parseFloat(newUserHeightFeetInputString);

    var newUserHeightInchInputString = $("#user-height-input-inch").val();
    var newUserHeightInch = parseFloat(newUserHeightInchInputString);    
    if (!Number.isNaN(newUserHeightFeet) && !Number.isNaN(newUserHeightFeet)) {
      var newUserHeightInCm = (newUserHeightFeet * 12 + newUserHeightInch) * 2.54;
      this.model.setUserHeight(newUserHeightInCm);
    }
  }

  updateSIUserInputDisplay() {
    $("#user-height-input-cm").val(Math.round(this.model.userHeight));
  }

  updateUSUserInputDisplay() {
    var valueInCm = this.model.userHeight;
    var valueInFeet = parseInt(valueInCm / 30.48);
    var valueInInches = Math.round((valueInCm - (valueInFeet * 30.48)) / 2.54);
    $("#user-height-input-feet").val(valueInFeet);
    $("#user-height-input-inch").val(valueInInches);
  }

  handleToggleUnitsUsed(event) {
    this.view.unitUsed = (this.view.unitUsed == "SI") ? "US" : "SI";
    this.updateUnitDisplay();
    this.updateUserInputUnitDisplay();
    this.updateFurnitureMeasurement();
  }
  
  updateUnitDisplay() {
    if (this.view.unitUsed == "US") {
      $("#current-unit").text("UNITS: US CUST");
    } else {
      $("#current-unit").text("UNITS: SI [cm]");
    }
  }

  updateUserInputUnitDisplay() {
    if (this.view.unitUsed == "SI") {
      $("#user-height-input-cm").show();
      $("#user-height-input-feet").hide();
      $("#user-height-input-inch").hide();
      $("#user-height-input-feet-unit-label").hide();
      $("#user-height-input-inch-unit-label").hide();
      this.updateSIUserInputDisplay();
    } else {
      $("#user-height-input-cm").hide();
      $("#user-height-input-feet").show();
      $("#user-height-input-inch").show();
      $("#user-height-input-feet-unit-label").show();
      $("#user-height-input-inch-unit-label").show();
      this.updateUSUserInputDisplay();        
    }
  }

  updateFurnitureMeasurement() {
    for (var furnitureType in this.model.getScaledFurnitureHeight()) {
      var newFurnitureDisplayMeasurementValue = this.model.getScaledFurnitureHeight()[furnitureType];
      $('#' + furnitureType).text(this.inSelectedUnits(newFurnitureDisplayMeasurementValue));
    }
  }

  inSelectedUnits(measurementInSI) {
    if (this.view.unitUsed == "SI") {
      return Math.round(measurementInSI);
    } else {
      return this.convertToFeetAndInches(measurementInSI);
    }
  }

  convertToFeetAndInches(valueInCm) {
    var valueTotalInInches = valueInCm / 2.54;
    var valueInFeet = parseInt(valueTotalInInches / 12);
    var valueInInches = Math.round(valueTotalInInches - valueInFeet * 12);
    var valueInFeetAndInchesText = valueInFeet + "'" + valueInInches + '"';
    return valueInFeetAndInchesText; 
  }

}

$(document).ready(function() {
  resizeDiagramToFitPageHeight();
  appModel = new FurnitureHeightFittingModel();
  appController = new FurnitureHeightFittingController(appModel);
  appModel.setController(appController);
  appController.initializeView();
  appController.registerHandler();
});
