var btnTitle = document.querySelectorAll(".contacts-tab-toggle");
var btnContant = document.querySelectorAll(".contacts-tab-contant");

for (var i = 0; i < btnTitle.length; i++) {
  btnTitle[i].addEventListener("click", funOpen);
  function funOpen(e) {
    for (var i = 0; i < btnTitle.length; i++) {
      btnContant[i].classList.remove("contacts-tab-contant-active");
      if (btnTitle[i] == e.currentTarget) {
        btnContant[i].classList.toggle("contacts-tab-contant-active");
      }
    }
  }
}
function initYandexMap() {
  let cordsStr = "55.63393951216643, 37.44033897875346";
  let num1 = Number(cordsStr.split(",")[0]);
  let num2 = Number(cordsStr.split(",")[1]);
  let myOptions = {
    center: [55.63393951216643, 37.44033897875346],
    zoom: 9,
  };

  let zoomUp = document.querySelector(".map-zoom-up");
  let zoomIn = document.querySelector(".map-zoom-in");

  zoomUp.addEventListener("click", function () {
    map.setZoom(myOptions.zoom - 1, { duration: 300 });
    myOptions.zoom -= 1;
  });
  zoomIn.addEventListener("click", function () {
    map.setZoom(myOptions.zoom + 1, { duration: 300 });
    myOptions.zoom += 1;
  });

  let map = new ymaps.Map("map", myOptions);
  function open() {
    let fullscreenControl = new ymaps.control.FullscreenControl();
    map.controls.add(fullscreenControl);
    fullscreenControl.enterFullscreen();
  }
  var fullscreenControl = new ymaps.control.FullscreenControl();
  map.controls.add(fullscreenControl);
  let isFull = false;
  let fullScrean = document.querySelector(".map-subtract");
  fullScrean.addEventListener("click", function () {
    isFull = !isFull;

    if (isFull == false) {
      fullscreenControl.exitFullscreen();
    } else {
      fullscreenControl.enterFullscreen();
    }
  });

  var place;
  var pointer = [
    [55.63393951216643, 37.44033897875346],
    [54.739259, 35.996176],
    [59.471691, 40.064734],
    [56.48046, 43.624445],
    [55.624988, 37.415514],
  ];
  // 55.633998, 37.442877

  for (i = 0; i < pointer.length; ++i) {
    place = new ymaps.Placemark(
      pointer[i],
      {},
      {
        iconLayout: "default#image",

        iconImageHref: "images/svg/map-market.svg",

        iconImageSize: [41, 53],
      }
    );
    map.geoObjects.add(place);
  }

  let arrayBtns = document.querySelectorAll(".page-btn");
  arrayBtns.forEach((element) => {
    element.addEventListener("click", function () {
      cordsStr = element.dataset.coordinates;
      num1 = Number(cordsStr.split(",")[0]);
      num2 = Number(cordsStr.split(",")[1]);

      map.panTo([num1, num2], { flying: 4 });
    });
  });
}

FARBA.lazyLibraryLoad("//api-maps.yandex.ru/2.1/?lang=ru_RU", "", () => {
  ymaps.ready(initYandexMap);
});

var tabLinks = new Array();
var contentDivs = new Array();
function tabs(selector) {
  // Grab the tab links and content divs from the page
  // var tabListItems = document.getElementById("tabs").childNodes;

  // for (var i = 0; i < tabListItems.length; i++) {
  //   if (tabListItems[i].nodeName == "LI") {
  //     var tabLink = getFirstChildWithTagName(tabListItems[i], "A");
  //     var id = getHash(tabLink.getAttribute("href"));
  //     tabLinks[id] = tabLink;
  //     contentDivs[id] = document.getElementById(id);
  //   }
  // }

  var tabListItems = document.querySelectorAll(selector);
  tabListItems.forEach((element) => {
    var id = getHash(element.getAttribute("href"));
    // tabLinks[id] = element;
    tabLinks.push(element);
    // contentDivs[id] = document.getElementById(id);
    contentDivs.push(document.getElementById(id));
  });
  // Assign onclick events to the tab links, and
  // highlight the first tab
  var i = 0;
  // console.log(contentDivs);s
  // for (var id in tabLinks) {
  //   tabLinks[id].onclick = showTab;
  //   tabLinks[id].onfocus = function () {
  //     this.blur();
  //   };
  //   if (i == 0) tabLinks[id].classList.add("selected");
  //   i++;
  // }
  console.log(tabLinks);
  console.log(contentDivs);
  for (let i = 0; i <= tabLinks.length; i++) {
    tabLinks[i].onclick = showTab;

    tabLinks[i].onfocus = function () {
      this.blur();
    };
    if (i == 0) tabLinks[i].classList.add("selected");
  }
  // for (var id in tabLinks) {
  //   tabLinks[id].onclick = showTab;
  //   tabLinks[id].onfocus = function () {
  //     this.blur();
  //   };
  //   if (i == 0) tabLinks[id].classList.add("selected");
  //   i++;
  // }

  // Hide all content divs except the first
  var i = 0;
  // сделать цикл
  for (let i = 0; i <= contentDivs.length; i++) {
    if (i != 0) contentDivs[i].classList.remove("selected");
  }
  // for (var id in contentDivs) {
  //   if (i != 0) contentDivs[i].classList.remove("selected");
  //   i++;
  // }
  // for (var id in contentDivs) {
  //   i++;
  // }

  tabListItems[0].classList.add("selected");
  // contentDivs[0].classList.add("selected");
  // document.querySelector(contentDivs[0]).classList.add("selected");
  // console.log(contentDivs["tab-1"]);
}

function showTab() {
  var selectedId = getHash(this.getAttribute("href"));

  // Highlight the selected tab, and dim all others.
  // Also show the selected content div, and hide all others.
  // for (var id in contentDivs) {
  //   if (id == selectedId) {
  //     tabLinks[id].classList.add("selected");
  //     contentDivs[id].classList.add("selected");
  //   } else {
  //     tabLinks[id].classList.remove("selected");
  //     contentDivs[id].classList.remove("selected");
  //   }
  // }
  for (let i = 0; i <= contentDivs.length; i++) {
    if (i == selectedId) {
      tabLinks[i].classList.add("selected");
      contentDivs[i].classList.add("selected");
    } else {
      tabLinks[i].classList.remove("selected");
      contentDivs[i].classList.remove("selected");
    }
  }
  // for (var id in contentDivs) {
  //   if (id == selectedId) {
  //     tabLinks[id].classList.add("selected");
  //     contentDivs[id].classList.add("selected");
  //   } else {
  //     console.log(tabLinks[id]);
  //     tabLinks[id].classList.remove("selected");
  //     contentDivs[id].classList.remove("selected");
  //   }
  // }
  // Stop the browser following the link

  return false;
}

function getFirstChildWithTagName(element, tagName) {
  for (var i = 0; i < element.childNodes.length; i++) {
    if (element.childNodes[i].nodeName == tagName) return element.childNodes[i];
  }
}

function getHash(url) {
  var hashPos = url.lastIndexOf("#");
  return url.substring(hashPos + 1);
}
tabs(".page-buttons a");

function setLocation(curLoc) {
  try {
    history.pushState(null, null, curLoc);
    return;
  } catch (e) {}
  location.hash = "#" + curLoc;
}
