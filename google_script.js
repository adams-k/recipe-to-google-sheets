function scrapeRecipe() {
    // Get API and API Key Properties
    const properties = PropertiesService.getScriptProperties();
    const api = properties.getProperty("api");
    const apiKey = properties.getProperty("api-key")
  
    // Get active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    const template = ss.getSheetByName('Template')
  
    // Collect URL input
    const urlInputRange = ss.getRangeByName('urlInput');
    const url = urlInputRange.getValue();
    console.log(url)
    // If URL is given
    if (url.length > 0){
      // Set body with url to fetch
      const body = {'url': url}
  
      // Set options to send with fetch of API
      const options = {
        "method" : "POST",
        "headers" : {
          "contentType": "application/json",
          "X-Api-Key": apiKey
        },
        "payload": JSON.stringify(body)
      };
  
      // Get recipe and convert it to parsable JSON
      const response = UrlFetchApp.fetch(api, options);
      const data = JSON.parse(response.getContentText());
  
      // Create new sheet for new recipe based off of template
      const newSheet = template.copyTo(ss).setName(data.title);
      newSheet.activate();
  
      // Get ranges and set values
      const title = ss.getRangeByName(data.title + "!Title");
      title.setValue(data.title)
  
      const link = ss.getRangeByName(data.title + "!Link");
      link.setValue(url);
  
      const cook = ss.getRangeByName(data.title + "!Cook");
      cook.setValue(data.cook_time)
  
      const prep = ss.getRangeByName(data.title + "!Prep");
      prep.setValue(data.prep_time)
  
      const total = ss.getRangeByName(data.title + "!Total");
      total.setValue(data.total_time)
  
      const desc = ss.getRangeByName(data.title + "!Description");
      desc.setValue(data.description)
  
      const image = ss.getRangeByName(data.title + "!Image");
      const imageObject = SpreadsheetApp.newCellImage()
                            .setSourceUrl(data.image).build();
      image.setValue(imageObject)
  
      const ingreds = ss.getRangeByName(data.title = "!Ingredients");
      const ingredsList = [];
      for (const ing of data.ingredients){
        ingredsList.push([ing, ""])
      }
      while (ingredsList.length < ingreds.getValues().length){
        ingredsList.push(["", ""])
      }
      ingreds.setValues(ingredsList)
  
      const instr = ss.getRangeByName(data.title = "!Instructions");
      const instrList = [];
      for (const ins of data.instructions_list){
        instrList.push([ins, "", "", ""])
      }
      while (instrList.length < instr.getValues().length){
        instrList.push(["", "", "", ""])
      }
      instr.setValues(instrList)
  
    } else {
      // Create a blank template for a manual recipe
      const newSheet = template.copyTo(ss).setName("Blank Recipe")
    }
  }