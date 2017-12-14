/**
* Author: Nick Colletti
* Description: BRT Chrome Extension
* 
**/

document.addEventListener('DOMContentLoaded', function () {
    function getScripts () {
        // need to implement regex to capture biddr.brealtime.com/12345-1235.js
        var re = /biddr.brealtime.com/i
        let scripts = "";
        let all = document.querySelectorAll("script");
        for(var i = 0; i < all.length; i ++ ){
            if(all[i].src.match(re)){
                scripts = all[i].src;
            }
        }
        return scripts;
    }

    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {
        console.log("hello!");
         chrome.tabs.executeScript(
           {
             code: "(" + getScripts + ")();" //argument here is a string but function.toString() returns function's code
           },
           results => {
             console.log(results[0]);
                var d = document;
                var divElm = d.getElementById("result");
                var p = d.createElement("p");
                p.textContent = results[0];
                divElm.appendChild(p);
           }
         );
      
    });
   
});