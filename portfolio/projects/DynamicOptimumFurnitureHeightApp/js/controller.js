class FurnitureHeightFittingController {
  constructor(model, view, store) {
    this.model = model;
    this.view = view;
    this.store = store;
  }
  
  initialize() {
    this.updateModelHeightFromStore();
    this.initializeView();
  }

  initializeView() {
    this.view.resizeDiagramToFitPage();
    this.view.registerHandlers();
    this.updateUserInputUnitDisplayState();
    this.updateCurrentUnitDisplay();
    this.updateFurnitureMeasurement();
    this.syncViewModelHeightInputWithStore();
  }
  
  handleWindowResize() {
    this.view.resizeDiagramToFitPage();
  }

  handlePrintPage() {
    this.view.resizeDiagramToFitPrintedPage();
  }
  
  handleUserCmHeightInputChange(event) {
    var newUserHeightInputString = this.view.getInput("user-height-input-cm");
    var newUserHeight = parseFloat(newUserHeightInputString);
    if (!Number.isNaN(newUserHeight) && newUserHeight > 0) {
      this.model.setUserHeight(newUserHeight);
    }
  }

  handleUserUSHeightInputChange(event) {
    var newUserHeightFeetInput = this.view.getInput("user-height-input-feet");
    var newUserHeightFeet = parseFloat(newUserHeightFeetInput);

    var newUserHeightInchInput = this.view.getInput("user-height-input-inch");
    var newUserHeightInch = parseFloat(newUserHeightInchInput);

    if (!Number.isNaN(newUserHeightFeet) && !Number.isNaN(newUserHeightInch)
      && (newUserHeightFeet > 0) && (newUserHeightInch > 0)) {

      var newUserHeightInCm = (newUserHeightFeet * 12 + newUserHeightInch) * 2.54;
      this.model.setUserHeight(newUserHeightInCm);

    } else {
      event.defaultDefault();
    }
  }

  handleUserHeightUpdate() {
    this.updateFurnitureMeasurement();
    this.store.saveUserHeight(this.model.userHeight);
  }

  handleToggleUnitClick(event) {
    if (this.model.unitUsed == "SI") {
      this.model.setUnitUsed("US");
    } else {
      this.model.setUnitUsed("SI");
    }
  }

  handleUnitUsedChange() {
    this.updateCurrentUnitDisplay();
    this.updateUserInputUnitDisplayState();
    this.updateSIUserInputDisplay();
    this.updateUSUserInputDisplay();
    this.updateFurnitureMeasurement();
  }

  updateModelHeightFromStore() {
    var storedUserHeight = this.store.getUserHeight();
    if (storedUserHeight !== undefined) {
      this.model.setUserHeight(storedUserHeight);
    }
  }

  syncViewModelHeightInputWithStore() {
    this.updateSIUserInputDisplay();
    this.updateUSUserInputDisplay();
  }

  updateSIUserInputDisplay() {
    this.view.setInput("user-height-input-cm", Math.round(this.model.userHeight));
  }

  updateUSUserInputDisplay() {
    var heightInCm = this.model.userHeight;
    var heightInFeet = parseInt(heightInCm / 30.48);
    var heightInInch = Math.round((heightInCm - (heightInFeet * 30.48)) / 2.54);
    this.view.setInput("user-height-input-feet", heightInFeet);
    this.view.setInput("user-height-input-inch", heightInInch);
  }

  updateCurrentUnitDisplay() {
    if (this.model.unitUsed == "US") {
      this.view.updateCurrentUnitDisplay("UNITS: US CUST");
    } else {
      this.view.updateCurrentUnitDisplay("UNITS: SI [cm]");
    }
  }

  updateUserInputUnitDisplayState() {
    if (this.model.unitUsed == "SI") {
      this.view.showInput("user-height-input-cm");
      this.view.hideInput("user-height-input-feet");
      this.view.hideInput("user-height-input-inch");
      this.view.hideInput("user-height-input-feet-unit-label");
      this.view.hideInput("user-height-input-inch-unit-label");
    } else {
      this.view.hideInput("user-height-input-cm");
      this.view.showInput("user-height-input-feet");
      this.view.showInput("user-height-input-inch");
      this.view.showInput("user-height-input-feet-unit-label");
      this.view.showInput("user-height-input-inch-unit-label");
    }
  }

  updateFurnitureMeasurement() {
    for (var furnitureType in this.model.getScaledFurnitureHeight()) {
      var newFurnitureDisplayMeasurementValue = this.model.getScaledFurnitureHeight()[furnitureType];
      this.view.setMeasurementDisplay(furnitureType, this.inCurrentUnit(newFurnitureDisplayMeasurementValue));
    }
  }

  inCurrentUnit(measurementInSI) {
    if (this.model.unitUsed == "SI") {
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