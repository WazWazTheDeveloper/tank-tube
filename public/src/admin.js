import { app } from "../firebase.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
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

let timeout = 1000000; // 1000000ms = 1000 seconds

// This is the promise code, so this is the useful bit
function ensureDataIsFetched(timeout) {
  let start = Date.now();
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
  for (let i = 0; i < window.data.length; i++) {
    let blockWarper = $("<div class='block-warper absolute-center'></div>");
    let block = $("<div class='blocks-card flexbox-two-column'></div>");
    let blockImg = $("<img/>");
    let blockText = $("<p></p>");

    //setup block img
    let imgSrc = `https://drive.google.com/uc?export=view&id=${window.data[i].img.src}`;
    blockImg.attr("src", imgSrc);
    blockImg.attr("alt", window.data[i].img.alt);

    //setup block text
    blockText.text(window.data[i].title);

    //add on click listener
    block.on("click", { blockId: i }, createBlockMenu);

    //append
    block.append(blockImg, blockText);
    blockWarper.append(block);
    $(".blocks-container").append(blockWarper);
  }
}

function createBlockMenu(e) {
  let id = e.data.blockId;

  let exitButton = $(`<div class="menu--body-exit-button"></div>`);
  let editButton = $(`<div class="menu--body-edit-button"></div>`);
  let addButton = $(`<div class="menu--body-add-button"></div>`);
  let background = $('<div class="menu--background absolute-center"></div>');
  let menu = $('<div class="menu--body"></div>');
  let title = $(`<p class="menu--body--title">${window.data[id].title}</p>`);
  let seperator = $(`<div class="menu--body-seperator"></div>`);
  let videoBlockContainer = $(
    `<div class="menu--body--video-block-container"></div>`
  );

  //exitbutton
  exitButton.on("click", deleteBlockMenu);

  //editButton
  editButton.on("click", { blockId: id, videoId: -1 }, createEditMenu);

  //addButton
  addButton.on(
    "click",
    { blockId: id, videoId: window.data[id].urls.length },
    createEditMenu
  );

  let videoBlock, img, text, imgSrc, videoBlockWarper;

  for (let i = 0; i < window.data[id].urls.length; i++) {
    // imgSrc = `https://drive.google.com/uc?export=view&id=${window.data[i].img.src}`;
    imgSrc = `https://drive.google.com/uc?export=view&id=${window.data[id].urls[i].img.src}`;

    videoBlockWarper = $("<div class='block-warper absolute-center'></div>");
    videoBlock = $(`<div class="menu--body--video-block"></div>`);
    img = $(`<img 
      src="${imgSrc}"
      alt="${window.data[id].urls[i].title}"
      "/>`);
    text = $(`<p>${window.data[id].urls[i].title}</P>`);

    //onclick of video block
    videoBlock.on("click", { blockId: id, videoId: i }, createEditMenu);

    videoBlock.append(img, text);
    videoBlockWarper.append(videoBlock);
    videoBlockContainer.append(videoBlockWarper);
  }

  //append
  menu.append(
    title,
    seperator,
    videoBlockContainer,
    exitButton,
    editButton,
    addButton
  );
  background.append(menu);
  $("body").append(background);
}

function deleteBlockMenu() {
  $(this).parent().parent().remove();
}

function createEditMenu(e) {
  let blockId = e.data.blockId;
  let videoId = e.data.videoId;

  //ref to data
  let _data;
  if (videoId == -1) {
    _data = window.data[blockId];
  } else if (videoId == window.data[blockId].urls.length) {
    _data = {
      title: "",
      img: {
        src: "",
        alt: "",
      },
      url: "",
    };
  } else {
    _data = window.data[blockId].urls[videoId];
  }

  let deleteButton = $(`<div class="menu--body-delete-button"></div>`);
  let exitButton = $(`<div class="menu--body-exit-button"></div>`);
  let background = $('<div class="menu--background absolute-center"></div>');
  let menu = $('<div class="menu-video--body"></div>');
  let title = $(`<p class="menu-video--body--title">${_data.title}</p>`);
  let seperator = $(`<div class="menu-video--body-seperator"></div>`);
  let wraper = $(`<ul class="menu-edit--body-wrapper"></ul>`);
  let titleTile = $(
    `<li class="menu-edit--body-tile">
        <p>titles</p>
        <input 
        type="text" 
        id="title"
        value="${_data.title}">
    </li>`
  );
  let imgSrcTile = $(
    `<li class="menu-edit--body-tile">
        <p>img src</p>
        <input 
        type="text" 
        id="img-src"
        value="${_data.img.src}">
    </li>`
  );
  let imgAltTile = $(
    `<li class="menu-edit--body-tile">
        <p>img alt</p>
        <input 
        type="text" 
        id="img-alt"
        value="${_data.img.alt}">
    </li>`
  );
  let videoUrlTile =
    videoId == -1
      ? $("<div></div>")
      : $(`<li class="menu-edit--body-tile">
        <p>video url</p>
        <input 
        type="text" 
        id="video-url"
        value="${_data.url}">
    </li>`);

  let submitButton = $(
    `<button class="menu-edit--body-submit-button">save</button>`
  );

  //exitbutton
  exitButton.on("click", deleteBlockMenu);

  //editButton
  deleteButton.on("click", { blockId: blockId, videoId: videoId }, removeBlock);

  //sumbitbutton
  submitButton.on(
    "click",
    { blockId: blockId, videoId: videoId },
    onSubmitChanges
  );

  //append
  wraper.append(titleTile, imgSrcTile, imgAltTile, videoUrlTile);
  menu.append(exitButton, title, seperator, wraper, submitButton, deleteButton);
  background.append(menu);
  $("body").append(background);
}

function removeBlock(e) {
  let blockId = parseInt(e.data.blockId);
  let videoId = parseInt(e.data.videoId);

  if (videoId > -1) {
    window.data[blockId].urls.splice(videoId, 1);
  }

  updateData(blockId, -2);
  $(this).parent().parent().remove();
}

function onSubmitChanges(e) {
  let blockId = parseInt(e.data.blockId);
  let videoId = parseInt(e.data.videoId);
  let title = $("#title").val();
  let imgSrc = $("#img-src").val();
  let imgAlt = $("#img-alt").val();
  let videoUrl = $("#video-url").val();

  updateData(blockId, videoId, title, imgSrc, imgAlt, videoUrl);
  $(this).parent().parent().remove();
}

function updateData(blockId, videoId, title, imgSrc, imgAlt, videoUrl) {
  let dir, data;

  if (videoId === -1) {
    window.data[blockId].img.src = imgSrc;
    window.data[blockId].img.alt = imgAlt;
    window.data[blockId].title = title;

    dir = `blocks/${blockId}/`;
    data = window.data[blockId];
  } else if (videoId == window.data[blockId].urls.length) {
    let newData = {
      title: title,
      img: {
        src: imgSrc,
        alt: imgAlt,
      },
      url: videoUrl,
    };
    window.data[blockId].urls.push(newData);
    dir = `blocks/${blockId}/urls/`;
    data = window.data[blockId].urls;
  }else if (videoId === -2) {
    dir = `blocks/${blockId}/`;
    data = window.data[blockId];v
  } else {
    window.data[blockId].urls[videoId].url = videoUrl;
    window.data[blockId].urls[videoId].img.src = imgSrc;
    window.data[blockId].urls[videoId].img.alt = imgAlt;
    window.data[blockId].urls[videoId].title = title;

    dir = `blocks/${blockId}/urls/`;
    data = window.data[blockId].urls;
  }

  const db = getDatabase();
  set(ref(db, dir), data);
}
