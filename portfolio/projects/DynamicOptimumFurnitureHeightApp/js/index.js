


function resizeDiagramToFitPageHeight() {
  console.log('resized fired');
  var viewportHeight = $('body').height();
  var viewportWidth = $('body').width();
  
  var diagramUnscaledHeight = $('#diagram-container').height();
  var diagramUnscaledWidth = $('#diagram-container').width();
  
  var diagramScaleRatio = viewportHeight / diagramUnscaledHeight;

  if (diagramUnscaledWidth * diagramScaleRatio > viewportWidth) {
    diagramScaleRatio = viewportWidth / diagramUnscaledWidth);
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
  }
  
  initializeView() {
    this.updateFurnitureMeasurement();
  }
  
  registerHandler() {
    $(window).resize(resizeDiagramToFitPageHeight);
    $("#user-height-input").on('input', this.handleUserHeightInputChange.bind(this));
  }
  
  handleUserHeightInputChange(event) {
    var newUserHeightInputString = $("#user-height-input").val();
    var newUserHeight = parseFloat(newUserHeightInputString);
    if (!Number.isNaN(newUserHeight)) {
      this.model.setUserHeight(newUserHeight);
    }
  }
  
  updateFurnitureMeasurement() {
    for (var furnitureType in this.model.getScaledFurnitureHeight()) {
      var newFurnitureDisplayMeasurementValue = Math.round(this.model.getScaledFurnitureHeight()[furnitureType]);
      $('#' + furnitureType).text(newFurnitureDisplayMeasurementValue);
    }
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
