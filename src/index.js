import { app } from "../firebase.js";
//asdasdsad
import {
  getDatabase,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

function getData() {
  // Get a reference to the database service
  const database = getDatabase(app);
  const dbRef = ref(getDatabase());
  get(child(dbRef, `blocks`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        window.data = snapshot.val();
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function waitForData() {
  let x = await window.data;
}

var timeout = 1000000; // 1000000ms = 1000 seconds

// This is the promise code, so this is the useful bit
function ensureDataIsFetched(timeout) {
  var start = Date.now();
  return new Promise(waitForData); // set the promise object within the ensureFooIsSet object

  // waitForFoo makes the decision whether the condition is met
  // or not met or the timeout has been exceeded which means
  // this promise will be rejected
  function waitForData(resolve, reject) {
    if (window && window.data) resolve(window.data);
    else if (timeout && Date.now() - start >= timeout)
      reject(new Error("timeout"));
    else setTimeout(waitForData.bind(this, resolve, reject), 30);
  }
}

// This runs the promise code
ensureDataIsFetched(timeout).then(function () {
  start();
  console.log("sad");
});

$(function () {
  //get data
  getData();
  //wait for data
  waitForData();
});

function start() {
  console.log(window.data); //TODO delete this

  setupBlocks();
}

function setupBlocks() {
  for (var i = 0; i < window.data.length; i++) {
    var block = $("<div class='blocks-card'></div>");
    var blockImg = $("<img/>");
    var blockText = $("<p></p>");

    //setup block img
    var imgSrc = `https://drive.google.com/uc?export=view&id=${window.data[i].img.src}`;
    blockImg.attr("src", imgSrc);
    blockImg.attr("alt", window.data[i].img.alt);

    //setup block text
    blockText.text(window.data[i].name);

    //TODO: add on click listener
    block.on("click", { blockId: i }, createBlockMenu);

    //append
    block.append(blockImg, blockText);
    $(".blocks-container").append(block);
  }
}

function createBlockMenu(e) {
  var id = e.data.blockId;

  var exitButton = $(`<div class="menu--body-exit-button"></div>`);
  var background = $('<div class="menu--background absolute-center"></div>');
  var menu = $('<div class="menu--body"></div>');
  var title = $(`<p class="menu--body--title">${window.data[id].name}</p>`);
  var seperator = $(`<div class="menu--body-seperator"></div>`);
  var videoBlockContainer = $(
    `<div class="menu--body--video-block-container"></div>`
  );

  //exitbutton
  exitButton.on("click", deleteBlockMenu);

  var videoBlock, img, text, imgSrc;

  for (let i = 0; i < window.data[id].urls.length; i++) {
    imgSrc = `https://drive.google.com/uc?export=view&id=${window.data[i].img.src}`;

    videoBlock = $(`<div class="menu--body--video-block"></div>`);
    img = $(`<img 
      src="${imgSrc}"
      alt="${window.data[id].urls[i].title}"
      "/>`);
    text = $(`<p>${window.data[id].urls[i].title}</P>`);

    //onclick of video block
    videoBlock.on("click", { blockId: id, videoId: i }, createVideoMenu);

    videoBlock.append(img, text);
    videoBlockContainer.append(videoBlock);
  }

  //append
  menu.append(title, seperator, videoBlockContainer, exitButton);
  background.append(menu);
  $("body").append(background);
}

function deleteBlockMenu() {
  $(this).parent().parent().remove();
}

function createVideoMenu(e) {
  var blockId = e.data.blockId;
  var videoId = e.data.videoId;
  console.log(blockId);
  console.log(videoId);

  var exitButton = $(`<div class="menu--body-exit-button"></div>`);
  var background = $('<div class="menu--background absolute-center"></div>');
  var menu = $('<div class="menu-video--body"></div>');
  var title = $(
    `<p class="menu-video--body--title">${window.data[blockId].urls[videoId].title}</p>`
  );
  var seperator = $(`<div class="menu-video--body-seperator"></div>`);
  var video = $(
    `<iframe class="" src="${window.data[blockId].urls[videoId].url}" width="640" height="480" allow="autoplay"></iframe>`
  );
  var wraper = $(
    `<div class="absolute-center menu-video--body-wrapper"></div>`
  );
  //exitbutton
  exitButton.on("click", deleteBlockMenu);
  wraper.append(video);
  //append
  menu.append(exitButton, title, seperator, wraper);
  background.append(menu);
  $("body").append(background);
}
