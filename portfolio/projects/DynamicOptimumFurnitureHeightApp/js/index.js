$(document).ready(function() {
  appModel = new FurnitureHeightFittingModel();
  appView = new FurnitureHeightFittingView();
  appStore = new FurnitureHeightFittingStore(document);
  appController = new FurnitureHeightFittingController(appModel, appView, appStore);

  appModel.setController(appController);
  appView.setController(appController);

  appController.initialize();
});


