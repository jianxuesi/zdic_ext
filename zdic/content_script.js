/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var speakKeyStr;

function speakSelection() {
  var focused = document.activeElement;
  var selectedText;
  var top;
  var left;
  if (focused) {
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
    var oRange = sel.getRangeAt(0);
    var top = oRange.getBoundingClientRect().top;
    var left = oRange.getBoundingClientRect().left;
  }
  var newURL = "http://www.zdic.net/search/?c=3&q=";
  //window.open(newURL + selectedText);
  chrome.extension.sendRequest({'speak': [selectedText , top , left]});
}

function onExtensionMessage(request) {
  if (request['speakSelection'] != undefined) {
    if (!document.hasFocus()) {
      return;
    }
    speakSelection();
  } else if (request['key'] != undefined) {
    speakKeyStr = request['key'];
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage);
  chrome.extension.sendRequest({'init': true}, onExtensionMessage);

  document.addEventListener('keydown', function(evt) {
    if (!document.hasFocus()) {
      return true;
    }
    var keyStr = keyEventToString(evt);
    if (keyStr == speakKeyStr && speakKeyStr.length > 0) {
      speakSelection();
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }
    return true;
  }, false);

  document.addEventListener('click', function(evt) {
    var a = document.getElementById('dictionary');
    if (a){
      a.remove();
    }
  }, false);
}

initContentScript();
