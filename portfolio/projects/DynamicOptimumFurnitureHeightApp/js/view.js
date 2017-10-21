class FurnitureHeightFittingView {
  constructor(controller) {
    this.controller = controller;
    this.unitUsed = "SI";
  }

  setController(controller) {
    this.controller = controller;
  }

  registerHandlers() {
    $(window).resize(this.controller.handleWindowResize.bind(this.controller));
    window.onbeforeprint = this.controller.handlePrintPage.bind(this.controller);    
    $("#current-unit").on('click', this.controller.handleToggleUnitClick.bind(this.controller));    
    $("#user-height-input-cm").on('input', this.controller.handleUserCmHeightInputChange.bind(this.controller));
    $("#user-height-input-feet").on('input', this.controller.handleUserUSHeightInputChange.bind(this.controller));
    $("#user-height-input-inch").on('input', this.controller.handleUserUSHeightInputChange.bind(this.controller));

    if (window.matchMedia) {
        window.matchMedia('print').addListener(
          function(mql) {
            if (mql.matches) {
              this.controller.handlePrintPage();
            }
          }.bind(this));
    }    
  }

  resizeDiagramToFitPage() {
    var viewportHeight = $('body').height();
    var viewportWidth = $('body').width();
    
    var diagramUnscaledHeight = $('#diagram-container').height();
    var diagramUnscaledWidth = $('#diagram-container').width();
    var diagramScaleRatio = viewportHeight / diagramUnscaledHeight;

    if (diagramUnscaledWidth * diagramScaleRatio > viewportWidth) {
      diagramScaleRatio = (viewportWidth / diagramUnscaledWidth);
    }
    var diagramScaledWidth = diagramScaleRatio * diagramUnscaledWidth;
    $("#diagram-container").css({transform: 'scale(' + diagramScaleRatio + ',' + diagramScaleRatio + ')'});
    $("#diagram-container").css('left', (viewportWidth/2) - (diagramScaledWidth / 2) + 'px');
  }

  resizeDiagramToFitPrintedPage() {
    this.resizeDiagramToFitPage();
    $("#diagram-container").css("left", "0px");
    $("#diagram-container").css("top", "0px");
  }

  updateCurrentUnitDisplay(newDisplayText) {
    $("#current-unit").text(newDisplayText);
  }

  showInput(inputFieldId) {
    $("#" + inputFieldId).show();
  }

  hideInput(inputFieldId) {
    $("#" + inputFieldId).hide();
  }

  getInput(inputFieldID) {
    return $("#" + inputFieldID).val();
  }

  setInput(inputFieldID, newValue) {
    $("#" + inputFieldID).val(newValue);
  }

  setMeasurementDisplay(measurementDisplayId, newMeasurement) {
    $("#" + measurementDisplayId).text(newMeasurement);
  }
}