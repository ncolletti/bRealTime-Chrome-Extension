/**
* Author: Nick Colletti
* Description: EMX Chrome Extension
*
**/
document.addEventListener('DOMContentLoaded', function () {
  // ***** Inject a script to the page DOM ******
  // not sure if I need this but leaving it for adding possible features later

  function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
  }

  injectScript(chrome.extension.getURL('content.js'), 'body');


  // ***** Load Ad Inspector Functionality ******

  const findEmxScript = () =>{
        let re = /biddr.brealtime.com/i
        let allScripts = document.querySelectorAll("script");
        let output = [...allScripts].filter(script => script.src.match(re));
        const isValidEmxBiddr = output && output.length === 1 && output[0].src.includes('biddr.brealtime.com')

        if(isValidEmxBiddr) {
          return {
            status: true,
            text: 'Biddr360 sucessfully loaded!',
            detail: output[0].src,
            style: 'alert-success'
          };
        } else {
          return {
            status: false,
            text: 'Biddr360 is not present or failed to load.',
            style: 'alert-danger'
          };
        }
    }

    let checkPageButton = document.getElementById('checkPage');

    checkPageButton.addEventListener('click', function(elm) {
      checkPageButton.classList.add('inactive');

      chrome.tabs.executeScript(
        {
          code: "(" + findEmxScript + ")();"
        },
        function(result) {
             let resultsElm = document.getElementById("results-container");
             resultsElm.classList.remove('alert-secondary');
             resultsElm.classList.add(result[0].style);
             let pElm = document.getElementById("result");
             pElm.innerText = result[0].text;

             // enable functionality if biddr360 is on the page
             if(result[0].status) {
               let inspectorElm = document.getElementById('loadInspector');
               inspectorElm.classList.add('active');
             }
        }
      );
    });


    // ***** Load Ad Inspector Functionality ******
    let inspectorButton = document.getElementById('loadInspector');

    let url = null;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      url = tabs[0].url;
    });

    inspectorButton.addEventListener('click', function() {
      chrome.tabs.create({url: url + '?biddr_debug=true&biddr_ad_inspector', active: false});
    });


    // ***** Read Biddr Network calls ******
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
          if(details.method == "POST")
          // Use this to decode the body of your post
              var postedString = decodeURIComponent(String.fromCharCode.apply(null,
                                        new Uint8Array(details.requestBody.raw[0].bytes)));
             console.log(postedString)

      },
      {urls: ["<all_urls>"]},
      ["blocking", "requestBody"]
  );

});