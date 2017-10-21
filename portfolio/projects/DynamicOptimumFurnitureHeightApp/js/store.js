class FurnitureHeightFittingStore {
  constructor(document)  {
    this.document = document;
  }

  saveUserHeight(newHeight) {
    this.document.cookie = "userHeight=" + newHeight;
  }

  getUserHeight() {
    var userHeight = parseFloat(this.readCookieValue("userHeight"));
    if (!Number.isNaN(userHeight)) {
      return userHeight;
    } else {
      return undefined;
    }
  }

  readCookieValue(key) {
    var extractionRegex = new RegExp('[; ]'+key+'=([^\\s;]*)');
    var match = (' ' + this.document.cookie).match(extractionRegex);
    if (key && match) {
      return unescape(match[1]);
    } else {
      return undefined;
    }
  }
}