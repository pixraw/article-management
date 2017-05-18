function doGet(e) { 
  
  deleteOldKeys(); //get rid of keys older than 1 hour
  
  var keyParam = e.parameters.key; //The key the user provides
  
  if (keyParam == undefined){ //if no key is provided send them to the auth page
      return HtmlService
         .createTemplateFromFile('main') // Change to login for production, main to disable auth for dev
         .evaluate()
         .setTitle('Article Management System')
      .setFaviconUrl('https://assets.ysjournal.com/img/ams-favicon.ico'); 
  }
  
  if (checkUserKey (keyParam) == "valid"){ // check if the key is valid
    
    removeKey(keyParam);
    
    return HtmlService
      .createTemplateFromFile('main')
      .evaluate()
      .setTitle('Article Management System')
    .setFaviconUrl('https://assets.ysjournal.com/img/ams-favicon.ico'); 
  }
  else{ //They're using an invalid key
    return HtmlService
      .createTemplateFromFile('unauthorised')
      .evaluate()
      .setTitle('Article Management System')
    .setFaviconUrl('https://assets.ysjournal.com/img/ams-favicon.ico'); 
  }
  
  logActivity ("Logged In");

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


function logActivity (activity){
  
  var sheetName = "Article Management System Logs";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, Session.getActiveUser().getEmail(), activity]);
  
}


                                                                    
function getUserFromEmail (email){
                                                                    
  var sheetName = "Editor Logins";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }

  Logger.log(email);
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  for (var i = 1; i < data.length; i++){
     if (data [i][2].toString().toLowerCase().trim() == email.toString().toLowerCase().trim()){
        return data[i][0];
     }
  }
  return "unauthorised";
                                                                    
}

                                                                    
function getLevelFromEmail (email){
                                                                    
  var sheetName = "Editor Logins";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }

  Logger.log(email);
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  for (var i = 1; i < data.length; i++){
     if (data [i][2].toString().toLowerCase().trim() == email.toString().toLowerCase().trim()){
        return data[i][4];
     }
  }
  return "unauthorised";
                                                                    
}

function getArticles (){
 
  var sheetName = "Article Database";
  
  var data = findSheet(sheetName);

  Logger.log(data);
  
  var labels = new Array;
  
  for (var i = 1; i < data.length; i++) {
    var date = data[i][0].toString();
    if (date == "") { // Check if date is null. This prevents null rows from being pushed.
    }
    else {
      labels.push( [date, data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7]] );
    }
  }
  return labels;
}

function findSheet(sheetname) {
  var file, files = DriveApp.getFilesByName(sheetname); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }
  
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  return data;
}

function togglePublished (url, email){
  
  if (getUserFromEmail(email) == "unauthorised"){
    return "bad email";
  }
  
  //Find the sheet
  var sheetName = "Article Database";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "failure";
  }

  var sheet = SpreadsheetApp.openById(file.getId()).getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  //Find the article  
  var index = -1;
  for (var i=1; i<data.length; i++){
    if (data[i][8] == url){
      index = i;
    }
  }
  
  //If such an article exists then change its status  
  if (index != -1){
    logActivity (email + " toggled the publish status of an article: " + url);
    var cell = sheet.getRange('H'+(index+1));
    cell.setValue((cell.getValue() == "Accepted") ? "Scientific Review" : "Accepted");
    return "success";
  }
  
  return "failure"
  
}