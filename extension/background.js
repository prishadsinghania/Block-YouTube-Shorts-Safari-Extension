/* global browser, chrome */

const runtimeApi = typeof browser !== "undefined" ? browser : chrome;

runtimeApi.runtime.onInstalled.addListener(() => {
  console.log("YouTube Shorts Blocker installed");
});
