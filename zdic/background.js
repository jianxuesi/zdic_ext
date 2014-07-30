/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var lastUtterance = '';
var speaking = false;
var globalUtteranceIndex = 0;

if (localStorage['lastVersionUsed'] != '1') {
  localStorage['lastVersionUsed'] = '1';
  chrome.tabs.create({
    url: chrome.extension.getURL('options.html')
  });
}

function speak(utterance) {

  if (speaking && utterance == lastUtterance) {
    chrome.tts.stop();
    return;
  }

  speaking = true;
  lastUtterance = utterance;
  globalUtteranceIndex++;
  var utteranceIndex = globalUtteranceIndex;

  chrome.browserAction.setIcon({path: 'SpeakSel19-active.png'});

  var rate = localStorage['rate'] || 1.0;
  var pitch = localStorage['pitch'] || 1.0;
  var volume = localStorage['volume'] || 1.0;
  var voice = localStorage['voice'];
  chrome.tts.speak(
    utterance,
    {voiceName: voice,
      rate: parseFloat(rate),
      pitch: parseFloat(pitch),
      volume: parseFloat(volume),
      onEvent: function(evt) {
        if (evt.type == 'end' ||
          evt.type == 'interrupted' ||
          evt.type == 'cancelled' ||
          evt.type == 'error') {
          if (utteranceIndex == globalUtteranceIndex) {
            speaking = false;
            chrome.browserAction.setIcon({path: 'SpeakSel19.png'});
          }
        }
      }
    }
  );
}

function initBackground() {
  loadContentScriptInAllTabs();

  var defaultKeyString = getDefaultKeyString();
  var keyString = localStorage['speakKey'];
  if (keyString == undefined) {
    keyString = defaultKeyString;
    localStorage['speakKey'] = keyString;
  }
  sendKeyToAllTabs(keyString);

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request['init']) {
        sendResponse({'key': localStorage['speakKey']});
      } else if (request['speak']) {
        //console.log("haha");
        //speak(request['speak'][0]);
        var top = request['speak'][1];
        var left = request['speak'][2];
        var left = (parseInt(left) + 30).toString();
        var lan = "en";
        chrome.tabs.detectLanguage(function(language){console.log(language);});
        chrome.tabs.getSelected(null, function(tab) {
          if (tab) {
            /* Create the code to be injected */
            if (lan == "cn"){
              var code = [
                'var d = document.createElement("div");',
                'd.setAttribute("style", "'
                  + 'width: 330px; '
                  + 'position: absolute; '
                  + 'top: ' + top +'px; '
                  + 'left: ' + left +'px; '
                  + 'z-index: 9999; '
                  + '");',
                'd.setAttribute("id","dictionary");',
                'document.body.appendChild(d);',
                'var i = document.createElement("iframe");',
                'i.setAttribute("src", "' + "http://www.zdic.net/search/?c=3&q=" + request['speak'][0]+'");',
                'd.appendChild(i);'
              ].join("\n");
            }
            if (lan == "en"){
              var code = [
                'var d = document.createElement("div");',
                'd.setAttribute("style", "'
                  + 'width: 400px; '
                  + 'hight: 400px; '
                  + 'overflow: hidden;'
                  + 'position: absolute; '
                  + 'top: ' + top +'px; '
                  + 'left: ' + left +'px; '
                  + 'z-index: 9999; '
                  + '");',
                'd.setAttribute("id","dictionary");',
                'document.body.appendChild(d);',
                'var i = document.createElement("iframe");',
                'i.setAttribute("scrolling","no")',
                'i.setAttribute("style", "'
                  + 'position: absolute; '
                  + 'overflow: hidden;'
                  + 'top: -360px; '
                  + 'left: -330px; '
                  + 'width: 1280px; '
                  + 'height: 500px;'
                  + '");',
                'i.setAttribute("src", "' + "http://www.merriam-webster.com/dictionary/" + request['speak'][0]+'");',
                'd.appendChild(i);'
              ].join("\n");
            }
            /* Inject the code into the current tab */
            chrome.tabs.executeScript(tab.id, { code: code });
          }
        });
      }
    }
  );

  chrome.browserAction.onClicked.addListener(
    function(tab) {
      chrome.tabs.sendRequest(
          tab.id,
          {'speakSelection': true});
    }
  );
}

initBackground();
