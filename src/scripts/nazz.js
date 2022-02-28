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
  // let cordsStr = "55.63393951216643, 37.44033897875346";
  // let num1 = Number(cordsStr.split(",")[0]);
  // let num2 = Number(cordsStr.split(",")[1]);
  let myOptions = {
    center: [55.63393951216643, 37.44033897875346],
    zoom: 12,
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

  let map = new ymaps.Map("contacts-map", myOptions);

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
      document.querySelectorAll(".map-control").forEach(el => el.classList.remove("map-fullscreen"))
    } else {
      fullscreenControl.enterFullscreen();
      document.querySelectorAll(".map-control").forEach(el => el.classList.add("map-fullscreen"))
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

  let arrayBtns = document.querySelectorAll(".ux-map-to");
  arrayBtns.forEach((element) => {
    element.addEventListener("click", function () {
      cordsStr = element.dataset.coordinates;
      num1 = Number(cordsStr.split(",")[0]);
      num2 = Number(cordsStr.split(",")[1]);

      map.panTo([num1, num2], { flying: true, duration: 1500 });
    });
  });
}

FARBA.lazyLibraryLoad("//api-maps.yandex.ru/2.1/?lang=ru_RU", "", () => {
  ymaps.ready(initYandexMap);
});



FARBA.tabs(".ux-tabs a");
