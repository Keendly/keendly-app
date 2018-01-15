import React from 'react';

self.addEventListener ('push', function (event) {
  let title, body;
  if (isJsonString (event.data.text)) {
    const json = JSON.parse (event.data.text);
    title = json.title;
    body = json.body;
  } else {
    title = 'Keendly';
    body = event.data.text;
  }

  const options = {
    body: body,
    icon: 'https://app.keendly.com/images/icons/icon-192x192.png',
    badge: 'https://app.keendly.com/images/icons/icon-128x128.png',
  };

  event.waitUntil (self.registration.showNotification (title, options));
});

function isJsonString (str) {
  try {
    JSON.parse (str);
  } catch (e) {
    return false;
  }
  return true;
}
