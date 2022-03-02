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
      speed: 800,
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
        prev: {
          // shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
    });

    // slider.querySelectorAll('.ui-swiper-slide').forEach(item => {
    //   item.addEventListener('click',() => {
    //     swiper.slideToClosest()
    //   })
    // })
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

const Museum = {
  headerHeight: 0,

  updateHeight: () => {
    this.headerHeight = document.querySelector(".museum-header").clientHeight;
  },

  scroll: () => {
    if (window.scrollY >= this.headerHeight) {
      return document
        .querySelector("#header")
        .classList.remove("header-transparent");
    }
    document.querySelector("#header").classList.add("header-transparent");
  },
};

if (document.querySelector(".museum")) {
  document.querySelector(".wrapper").classList.add("no-gutters-top");
  document.querySelector("#header").classList.add("header-transparent");

  Museum.updateHeight();

  window.addEventListener("resize", Museum.updateHeight, false);

  window.addEventListener("scroll", Museum.scroll, false);
}

// if (document.querySelector(".page-404")) {
//   document.querySelector(".wrapper").classList.add("wrapper-page-404");
//   document.querySelector("#header").classList.add("header-transparent");
//   document.querySelector(".footer").classList.add("footer-page-404");
// }

// if (document.querySelector(".stub-page")) {
//   document.querySelector(".wrapper").classList.add("wrapper-stub-page");
//   document.querySelector("#header").classList.add("header-stub-page");
//   document.querySelector(".footer").classList.add("footer-stub-page");
// }

const smoothLinks = document.querySelectorAll('a[href^="#"]');
for (let smoothLink of smoothLinks) {
  smoothLink.addEventListener("click", function (e) {
    e.preventDefault();
    const id = smoothLink.getAttribute("href");

    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
