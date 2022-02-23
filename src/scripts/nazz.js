// const { on } = require("gulp");

//табы
$(document).ready(function () {
  $(".page-btn").click(function (e) {
    e.preventDefault();
    $(".page-btn").removeClass("page-btn-active");
    $(".contacts-tab").removeClass("contacts-tab-active");

    $(this).addClass("page-btn-active");
    $($(this).attr("href")).addClass("contacts-tab-active");
  });
  $(".page-btn:first").click();
});
//табы
$(document).ready(function () {
  $(".contacts-tab-toggle").click(function () {
    $(".contacts-tab-contant").slideUp(300);
    $(".contacts-tab-toggle").removeClass("contacts-tab-toggle-active");
    $(this).addClass("contacts-tab-toggle-active");
    $(this).next().slideDown(300);
  });
  $(".contacts-tab-toggle:first").click();
});

function init() {
  let cordsStr = "55.63393951216643, 37.44033897875346";
  let num1 = Number(cordsStr.split(",")[0]);
  let num2 = Number(cordsStr.split(",")[1]);
  let myOptions = {
    center: [55.63393951216643, 37.44033897875346],
    zoom: 9,
  };
  $(".map-zoom-in").click(function () {
    // myOptions.zoom = myOptions.zoom + 1;
    map.setZoom(myOptions.zoom + 1, { duration: 300 });
    myOptions.zoom += 1;
  });
  $(".map-zoom-up").click(function () {
    // myOptions.zoom = myOptions.zoom + 1;
    // if()
    map.setZoom(myOptions.zoom - 1, { duration: 300 });
    myOptions.zoom -= 1;
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
  $(".map-subtract").on("click", function () {
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
    [59.472607, 40.065338],
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
  $(document).ready(function () {
    $(".page-btn").click(function () {
      cordsStr = $(this).data("coordinates");
      num1 = Number(cordsStr.split(",")[0]);
      num2 = Number(cordsStr.split(",")[1]);
      // console.log(cordsStr);
      map.panTo([num1, num2], { flying: 4 });
    });
  });
}

ymaps.ready(init);
// map.panTo(new YMaps.GeoPoint(30.7058, 46.466444), { flying: 1 });
