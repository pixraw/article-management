function sendAuthEmail(email) {
  if (getUserFromEmail(email) != "unauthorised"){
    
    //Generate and log the key
    var key = makeKey();
    logKey(email, key);
    
    //Email the key to the user
    MailApp.sendEmail({
      to: email,
      name: 'Submissions - Young Scientists Journal',
      subject: "YSJ Authentication",
      htmlBody: "<!doctype html><html><body>Hi. <br/> Your key is <a href=\"https://script.google.com/macros/s/AKfycbw_q_5zDK5J7Ja8FXM4HFOqFoie_yHKN1gpirozJ1309Rni8bk/exec?key=" + key + "\">" + key + "<a></body></html>"
    });
    
    return "Check your inbox.";
  }
  else
  {
   throw("Unauth.")
   return; 
  }
}

function deleteOldKeys (){
  
  
  var sheetName = "Article Management System Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var comparison = formattedDate.substring(0, 14);
  
  
  //Check if the key's expired
  for (var i = 1; i < data.length; i++){
    
     if (data [i][3] == "No"){
          if (data [i][0].substring(0, 14) != comparison){
              SpreadsheetApp.openById(file.getId()).getActiveSheet().deleteRow(i + 1); //rows start at 1 for some reason
          }
     }    

  }
  
}

function makeKey()
{
    var text = "";
    var possible = "1234567890";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function checkUserKey (key){
                                                                    
  var sheetName = "Article Management System Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    logActivity ("Invalid Key");
    return "invalid";
  }

  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();

  //Check if the key's legit
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == key){
        return "valid";
     }
  }
  return "invalid";
                                                                    
}

function logKey (email, key){

  var sheetName = "Article Management System Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, email, key, "No"]);
  
  
}

function createPersistentKey (email){

  var sheetName = "Article Management System Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var key = makeKey() + '' + makeKey();
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, email, key, "Yes"]);
  
  return key;
  
}

function removeKey (key){

  var sheetName = "Article Management System Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
   var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  //Check if the key's legit
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == key){
          SpreadsheetApp.openById(file.getId()).getActiveSheet().deleteRow(i + 1); //rows start at 1 for some reason
     }
  }

    
}
