/* This is a Workbox powered service worker */

console.log("%cService Worker Registered!", "background-color:#222222; color:#BADA55;");

// Import and prepare Workbox
importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");
if (workbox) console.log("%cWorkbox loaded!", "background-color:#222222; color:#BADA55;");
else console.log("%cWorkbox didn't load!", "background-color:#5555FF; color:#FF0000;");

// Add files to cache
self.__precacheManifest = [
  {
    "url": "image-resources/app-background.png",
    "revision": "c1e0283ee488456cd73c5aced16b7e2c"
  },
  {
    "url": "image-resources/icons/144.png",
    "revision": "d025f95234a97f0c97f809697d288d23"
  },
  {
    "url": "image-resources/icons/16.png",
    "revision": "b760f69c70b1053a14bbcf382f6d67c6"
  },
  {
    "url": "image-resources/icons/192.png",
    "revision": "aee1cc665ba8333490e269863a91c031"
  },
  {
    "url": "image-resources/icons/48.png",
    "revision": "79a2bf4eb93a578f2903d97f1135057b"
  },
  {
    "url": "image-resources/icons/512.png",
    "revision": "c792dc21aafb8659b62ee0b70ce4d1e9"
  },
  {
    "url": "image-resources/icons/72.png",
    "revision": "16d3a4b20c551be6ae1a3940f9dc1ece"
  },
  {
    "url": "image-resources/icons/96.png",
    "revision": "91e1c7953b4ae7deac4547f1711a2148"
  },
  {
    "url": "index.html",
    "revision": "406b1e54314eaace67173b81536b8656"
  },
  {
    "url": "README.md",
    "revision": "8fa8d6c6454215d739864e9e432f4730"
  },
  {
    "url": "text-resources/index.js",
    "revision": "7369c9f0335860223952457dc14a2676"
  },
  {
    "url": "text-resources/manifest.json",
    "revision": "304cda0747e1adcc50bf306bed5f4c68"
  },
  {
    "url": "workbox-config.js",
    "revision": "37947569647c5a40ced5084d039fe699"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
