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

// [
//   {}
// ]

// const DimaNA = {
//   2001: 10,
//   2002: 20,
//   2003: 30,
//   2004: 40,
//   2005: 50,
//   2006: 60,
//   2007: 70,
//   2008: 80,
//   2009: 90,
//   20010: 100,
//   2011: 110,
//   2012: 120,
//   2013: 10000,
// }

// for (key in DimaNA) {
 
//   console.log(key)
// }