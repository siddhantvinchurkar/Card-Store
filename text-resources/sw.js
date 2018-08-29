console.log("%cService Worker Registered!", "background-color:#222222; color:#BADA55;");

// Import and prepare Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
if (workbox) console.log("%cWorkbox loaded!", "background-color:#222222; color:#BADA55;");
else console.log("%cWorkbox didn't load!", "background-color:#5555FF; color:#FF0000;");
