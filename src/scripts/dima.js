// Слайдер
(function () {
  const toggler = document.querySelectorAll(".node-slider");
  if (!toggler.length) return;

  toggler.forEach((el, index) => {
    const slider = el.querySelector(".ui-swiper");
    const prevArrow = el.querySelector(".swiper-button-prev");
    const nextArrow = el.querySelector(".swiper-button-next");

    const ds = `ui-swiper-${index}`;
    slider.classList.add(ds);

    prevArrow.classList.add(`swiper-button-prev-${index}`);
    nextArrow.classList.add(`swiper-button-next-${index}`);

    const swiper = new Swiper(`.${ds}`, {
      autoHeight: true,
      pagination: {
        el: ".swiper-pagination",
        type: "fraction",
      },
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
      },
    });
  });
})();

if (document.querySelector(".ui-page")) {
  let wrap = document.querySelector(".wrapper");
  wrap.classList.add("ui-wrapper");
  document.querySelector(".header").style.background = "transparent";
}

if (document.querySelector(".museum")) {
  let wrap = document.querySelector(".wrapper");
  wrap.classList.add("wrapper-museum");
  document.querySelector(".header").style.background = "transparent";
}

// if (window.pageYOffset > 0) {
//   let wrap = document.querySelector(".wrapper");
//   wrap.classList.remove("ui-wrapper");
//   document.querySelector(".header").style.background = "#222E3F";
// }
