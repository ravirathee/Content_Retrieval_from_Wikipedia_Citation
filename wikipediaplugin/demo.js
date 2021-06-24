function gotback(result){
  console.log(result);
  result = JSON.parse(result);
  console.log(result['res']);
  document.getElementById("resultfromFlask").setAttribute("style", "visibility: visible;");
  if (result['demo'] === "not done"){
    document.getElementById('relevance').innerHTML = "Error";

  }
  else
    document.getElementById('relevance').innerHTML = result['res'];


}



function sendData(url, query) {

  var Titlesplit = url.split('en.wikipedia.org/wiki/')[1];
  if (Titlesplit.split('#').length > 1)
    Titlesplit = Titlesplit.split('#')[0];

  document.getElementById("Title").innerHTML = '<h3>Wikipedia Current Page Title :</h3> ' + Titlesplit;
  document.getElementById("Query").innerHTML = '<h4>Selected Query: </h4> '+ query;


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var sending = JSON.stringify({
    "page": Titlesplit,
    "query": query
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sending,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:5000/test", requestOptions)
    .then(response => response.text())
    .then(result => gotback(result))
    .catch(error => console.log('error', error));

}

function gotSummary(result){
  console.log(result);
  result = JSON.parse(result);
  console.log(result['summary']);
  document.getElementById("resultfromFlask").setAttribute("style", "visibility: visible;");
  if (result['demo'] === "not done"){
    document.getElementById('relevance').innerHTML = "Error";

  }
  else
    document.getElementById('relevance').innerHTML = result['summary'];

}

function sendurl(url){
  var Titlesplit = url.split('en.wikipedia.org/wiki/')[1];
  if (Titlesplit.split('#').length > 1)
    Titlesplit = Titlesplit.split('#')[0];
  console.log(Titlesplit)
  document.getElementById("Title").innerHTML = '<h3>Wikipedia Current Page Title :</h3> ' + Titlesplit;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var sending = JSON.stringify({
    "page": Titlesplit
      });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sending,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:5000/sumarize", requestOptions)
    .then(response => response.text())
    .then(result => gotSummary(result))
    .catch(error => console.log('error', error));


}

summary.onclick = function(element){
  chrome.tabs.query(
    {active: true,
    lastFocusedWindow: true},
    function (tabs){
      chrome.tabs.executeScript(tabs[0].id, { code: sendurl(tabs[0].url)});
    }
    );
};

function gotanswer(result){
console.log(result);
result = JSON.parse(result);
console.log(result['result']);
document.getElementById("resultfromFlask").setAttribute("style", "visibility: visible;");
if (result['demo'] === "not done"){
  document.getElementById('relevance').innerHTML = "Error";

}
else
  document.getElementById('relevance').innerHTML = result['result'];


}

function sendpara(url){
 var Titlesplit = url.split('en.wikipedia.org/wiki/')[1];
  if (Titlesplit.split('#').length > 1)
    Titlesplit = Titlesplit.split('#')[0];

  document.getElementById("Title").innerHTML = '<h3>Wikipedia Current Page Title :</h3> ' + Titlesplit;

var question = document.getElementById("question").value;
var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var sending = JSON.stringify({
    "PageName": Titlesplit,
    "query": question
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sending,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:5000/question", requestOptions)
    .then(response => response.text())
    .then(result => gotanswer(result))
    .catch(error => console.log('error', error));
}




function AnswerFromSummary(url,selectedLine){
    var Titlesplit = url.split('en.wikipedia.org/wiki/')[1];
     if (Titlesplit.split('#').length > 1)
        Titlesplit = Titlesplit.split('#')[0];
     console.log(Titlesplit)

    document.getElementById("Title").innerHTML = '<h3>Wikipedia Current Page Title :</h3> ' + Titlesplit;

    var question = document.getElementById("question").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var sending = JSON.stringify({
    "page": Titlesplit,
    "query": selectedLine,
    "question": question
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: sending,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:5000/AnswerFromSummary", requestOptions)
    .then(response => response.text())
    .then(result => gotanswerFromCited(result))
    .catch(error => console.log('error', error));

}

function gotanswerFromCited(result){
    console.log(result);
  result = JSON.parse(result);
  console.log(result['result']);
  document.getElementById("resultfromFlask").setAttribute("style", "visibility: visible;");
  if (result['demo'] === "not done"){
    document.getElementById('relevance').innerHTML = "Error";

  }
  else
    document.getElementById('relevance').innerHTML = result['result'];
}

summaryans.onclick = function (element){

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    chrome.tabs.executeScript({
      code: "window.getSelection().toString();"
    },
      function (selection) {
        var query = selection[0];
        chrome.tabs.executeScript(tabs[0].id, {
          code: AnswerFromSummary(tabs[0].url, query)
        });
      }
    );
  });
};


answer.onclick = function(element){
  chrome.tabs.query(
    {active: true,
    lastFocusedWindow: true},
    function (tabs){
      chrome.tabs.executeScript(tabs[0].id, { code: sendpara(tabs[0].url)});
    }
    );
};
result.onclick = function (element){

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    chrome.tabs.executeScript({
      code: "window.getSelection().toString();"
    },
      function (selection) {
        var query = selection[0];
        chrome.tabs.executeScript(tabs[0].id, {
          code: sendData(tabs[0].url, query)
        });
      }
    );
  });
};