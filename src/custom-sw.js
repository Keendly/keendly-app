import React from 'react';

self.addEventListener ('push', function (event) {
  console.log ('[Service Worker] Push Received.');
  console.log ('[Service Worker] Push had this data: "${event.data.text ()}"');

  const title = 'Push from firebase';
  const options = {
    body: '', //Your push message - event.data.text() for instance
    icon: '', //image
    badge: '', ////image
  };

  event.waitUntil (self.registration.showNotification (title, options));
});
