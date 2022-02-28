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

  const links = document.querySelectorAll(".ux-map-to");


  for (i = 0; i < links.length; ++i) {
    let lat = links[i].dataset.coordinates.split(',')[0]
    let lng = links[i].dataset.coordinates.split(',')[1]

    let place = new ymaps.Placemark(
      [lat,lng],
      {},
      {
        iconLayout: "default#image",
        iconImageHref: "images/svg/map-market.svg",
        iconImageSize: [41, 53],
      }
    );
    map.geoObjects.add(place);
  }

  
  links.forEach((element) => {
    element.addEventListener("click", function () {
      cordsStr = element.dataset.coordinates;
      num1 = Number(cordsStr.split(",")[0]);
      num2 = Number(cordsStr.split(",")[1]);

      map.panTo([num1, num2], { flying: true, duration: 1500 });
    });
  });
}

if (document.querySelector('.contacts-map')) {
  FARBA.lazyLibraryLoad("//api-maps.yandex.ru/2.1/?lang=ru_RU", "", () => {
    ymaps.ready(initYandexMap);
  });
}

FARBA.tabs(".ux-tabs a");
