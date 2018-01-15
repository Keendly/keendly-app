import React from 'react';

self.addEventListener ('push', function (event) {
  console.log ('[Service Worker] Push Received.');
  console.log (event.data.text ());

  const title = 'Articles delivered';
  const options = {
    body: event.data.text (),
    icon: 'https://app.keendly.com/images/icons/icon-192x192.png',
    badge: 'https://app.keendly.com/images/icons/icon-128x128.png',
  };

  event.waitUntil (self.registration.showNotification (title, options));
});
