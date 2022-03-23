var btnTitle = document.querySelectorAll(".contacts-tab-toggle");
var btnContant = document.querySelectorAll(".contacts-tab-contant");

for (var i = 0; i < btnTitle.length; i++) {
  btnTitle[i].addEventListener("click", funOpen);

  function funOpen(e) {
    for (let i = 0; i < btnTitle.length; i++) {
      // btnTitle[i].classList.remove('contacts-tab-toggle-active');
      // btnContant[i].classList.remove("contacts-tab-contant-active");

      // if (e.currentTarget.classList.contains('contacts-tab-toggle-active')) {
      //   console.log('active');
      // }

      btnTitle[i].classList.remove("contacts-tab-toggle-active");
      gsap.to(btnContant[i],{height: 0,duration: 0.4,onComplete: ()=> {
        btnContant[i].classList.remove("contacts-tab-contant-active")
      }})

      if (btnTitle[i] == e.currentTarget) {
        btnTitle[i].classList.add('contacts-tab-toggle-active');
        setTimeout(()=>{
          btnContant[i].classList.add("contacts-tab-contant-active");
          gsap.fromTo(btnContant[i],{height: 0},{height: 'auto',duration: 0.4})
        },430)
      }
    }
  }
}
if (document.querySelector('.contacts-tab-toggle')) {
  let event = new Event("click")
  document.querySelector('.contacts-tab-toggle').dispatchEvent(event)
}

if (document.querySelector('.contacts') && document.querySelector('.page-buttons')) {
  document.querySelector('.page-buttons').classList.add('page-buttons-contacts')
  document.querySelector('.contacts').closest('.row').classList.add('contacts-row')
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


if (document.querySelector('.scientific-cardboard-img')) {
  let html = document.querySelector('.scientific-cardboard-img').innerHTML
  document.querySelector('.scientific-cardboard-img').insertAdjacentHTML('beforeend',html)
  document.querySelectorAll('.scientific-cardboard-img img')[1].classList.add('scientific-cardboard-shadow')
}