const P = {
  prop: PropertiesService.getScriptProperties(),
  get: (key) => P.prop.getProperty(key),
  set: (key, value) => P.prop.setProperty(key, value)
}

const C = {
  cache: CacheService.getScriptCache(),
  get: (key) => C.cache.get(key),
  put: (key, value) => C.cache.put(key, value, 3600)
}

//この関数を時限トリガーで回してGlitchの接続を維持する。
const retainGlitch = () => {
  const glitchURL = P.get('glitchURL')
  const json = {
    'userid': '',
    'channelid': '',
    'message': ''
  };
  sendGlitch(glitchURL, json);
}

const sendGlitch = (uri, json) => {
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  }
  const params = {
    'contentType': 'application/json; charset=utf-8',
    'method': 'post',
    'payload': json,
    'headers': headers,
    'muteHttpExceptions': true
  }

  response = UrlFetchApp.fetch(uri, params);
  console.log(response);
};

//GlitchからのPOSTリクエストを受け取る
const doPost = e => {
  const output = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  const message = JSON.parse(e.postData.contents);
  const messageObj = {
    'sendType': 'send',
    'content': 'via GAS: ' + message.content
  }
  const payload = JSON.stringify(messageObj);
  return output.setContent(payload);
};

// webhookでGASから直接送信するとき用に作った関数
/*
const sendMessage = (messageObj) => {
  const webhookURL = P.get('discordWebhookURL')
  const params = {
    method: 'POST',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify(messageObj)
  };
  const response = UrlFetchApp.fetch(webhookURL, params).getContentText();
  console.log(response);
};
*/
