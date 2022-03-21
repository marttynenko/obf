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
      loop: true,
      speed: 1000,
      pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: function (swiper, current, total) {
          return current + " из " + total;
        },
      },
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
      },
      effect: "creative",
      creativeEffect: {
        perspective: true,
        prev: {
          translate: ["-25%", 0, -1],
          // rotate: [0,0,3]
        },
        next: {
          translate: ["100%", 0, 0],
          // rotate: [0,0,0]
        },
      },
    });

    slider.querySelectorAll('.ui-swiper-slide-img').forEach(item => {
      item.addEventListener('click',() => {
        let event = new Event("click")
        nextArrow.dispatchEvent(event)
      })
    })
  });
})();
// Enterprises.html Слайдер для дипломов
const swiper = new Swiper(".enterprises-swipper", {
  loop: true,
  slidesPerView: 2,
  autoHeight: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});