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
  $(".contacts-tab-toggle").click(function (e) {
    e.preventDefault();
    // $(".contacts-tab-toggle").removeClass("contacts-tab-toggle-active");
    // $(".contacts-tab-contant").removeClass("contacts-tab-contant-active");

    // $(this).addClass("contacts-tab-toggle-active");
    // $($(this).attr("href")).addClass("contacts-tab-contant-active");
    $(".contacts-tab-contant").slideDown(300);
  });
  // $(".contacts-tab-toggle:first").click();
});

// //инициализация карты
// function initialize() {
//   let cordsStr = "55.63393951216643, 37.44033897875346";
//   let num1 = Number(cordsStr.split(",")[0]);
//   let num2 = Number(cordsStr.split(",")[1]);
//   $(document).ready(function () {
//     $(".page-btn").click(function (e) {
//       cordsStr = $(this).data("coordinates");
//       num1 = Number(cordsStr.split(",")[0]);
//       num2 = Number(cordsStr.split(",")[1]);

//       map.panTo({
//         lat: num1,
//         lng: num2,
//       });
//       marker.setMap(null);
//       changeMarker();
//     });
//   });
//   var styles = [
//     {
//       stylers: [
//         {
//           hue: "#ff1a00",
//         },
//         {
//           invert_lightness: true,
//         },
//         {
//           saturation: -100,
//         },
//         {
//           lightness: 30,
//         },
//         {
//           gamma: 0.5,
//         },
//       ],
//     },
//     {
//       featureType: "all",
//       elementType: "labels.text.fill",
//       stylers: [
//         {
//           color: "#575757",
//         },
//       ],
//     },
//     {
//       featureType: "water",
//       elementType: "geometry",
//       stylers: [
//         {
//           color: "#1B1B1B",
//         },
//       ],
//     },
//   ];

//   let mapOptions = {
//     zoom: 5,
//     center: new google.maps.LatLng(55.63393951216643, 37.44033897875346),
//     mapTypeControl: false,

//     mapTypeControlOptions: {
//       mapTypeIds: [google.maps.MapTypeId.ROADMAP, "map_style"],
//     },
//     scrollwheel: false,
//     zoomControl: false,
//     scaleControl: false,
//     disableDefaultUI: true,
//     navigationControlOptions: {
//       style: google.maps.NavigationControlStyle.SMALL,
//     },
//   };

//   // Create a new StyledMapType object, passing it the array of styles,
//   // as well as the name to be displayed on the map type control.
//   var styledMap = new google.maps.StyledMapType(styles, {
//     name: "Styled Map",
//   });

//   // Create a map object, and include the MapTypeId to add
//   // to the map type control.

//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);

//   // var position = new google.maps.LatLng(num1, num2);
//   function changeMarker() {
//     marker = new google.maps.Marker({
//       position: new google.maps.LatLng(num1, num2),
//       map: map,
//       icon: {
//         url: "images/svg/map-market.svg",
//         scaledSize: new google.maps.Size(41, 53),
//       },
//     });
//   }
//   changeMarker();

//   //Associate the styled map with the MapTypeId and set it to display.
//   map.mapTypes.set("map_style", styledMap);
//   map.setMapTypeId("map_style");

//   //кастомный зум
//   jQuery("#map-zoom-in").click(function () {
//     map.setZoom(map.getZoom() + 1);
//   });
//   jQuery("#map-zoom-out").click(function () {
//     map.setZoom(map.getZoom() - 1);
//   });
// }

// initialize();
////////////////////////////////////////////

function init() {
  let cordsStr = "55.63393951216643, 37.44033897875346";
  let num1 = Number(cordsStr.split(",")[0]);
  let num2 = Number(cordsStr.split(",")[1]);
  let myOptions = {
    center: [55.63393951216643, 37.44033897875346],
    zoom: 6,
  };

  let map = new ymaps.Map("map", myOptions);

  var place;
  var pointer = [
    [59.471691, 40.064734],
    [55.63393951216643, 37.44033897875346],
    [53.1, 27.56667],
    [56.48046, 43.624445],
    [35.624988, 31.415514],
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
