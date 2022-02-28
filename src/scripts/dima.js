// Слайдер
(function () {
  const toggler = document.querySelectorAll('.node-slider')
  if (!toggler.length) return

  toggler.forEach((el,index) => {
    const slider = el.querySelector('.ui-swiper')
    const prevArrow = el.querySelector('.swiper-button-prev')
    const nextArrow = el.querySelector('.swiper-button-next')

    const ds = `ui-swiper-${index}`
    slider.classList.add(ds)

    prevArrow.classList.add(`swiper-button-prev-${index}`)
    nextArrow.classList.add(`swiper-button-next-${index}`)


    const swiper = new Swiper(`.${ds}`, {
      autoHeight: true,
      pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: function (swiper, current, total) {
          return current + ' из ' + total; 
        }
      },
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
      },
    })
  })
  
})();

if (document.querySelector(".ui-page")) {
  let wrap = document.querySelector(".wrapper");
  let uihead = document.querySelector(".header");
  wrap.classList.add("ui-wrapper");
  uihead.classList.add("ui-header");
}

const Museum = {
  headerHeight: 0,

  updateHeight: () => {
    this.headerHeight = document.querySelector('.museum-header').clientHeight
  },

  scroll: () => {
    if (window.scrollY >= this.headerHeight) {
      return document.querySelector("#header").classList.remove("header-transparent")
    }
    document.querySelector("#header").classList.add("header-transparent")
  }
}

if (document.querySelector(".museum")) {
  document.querySelector(".wrapper").classList.add("wrapper-museum")
  document.querySelector("#header").classList.add("header-transparent")
  
  Museum.updateHeight()

  window.addEventListener('resize',Museum.updateHeight,false)

  window.addEventListener('scroll',Museum.scroll,false)
}

const history = {
  headerHeight: 0,

  updateHeight: () => {
    this.headerHeight = document.querySelector('.history-header').clientHeight
  },

  scroll: () => {
    if (window.scrollY >= this.headerHeight) {
      return document.querySelector("#header").classList.remove("header-transparent");
    }
    document.querySelector("#header").classList.add("header-transparent");
  }
}

if (document.querySelector(".history")) {
  document.querySelector(".wrapper").classList.add("wrapper-history");
  document.querySelector("#header").classList.add("header-transparent");

  history.updateHeight();

  window.addEventListener('resize', history.updateHeight, false);

  window.addEventListener('scroll', history.scroll, false);
}


if (document.querySelector(".page-404")) {
  document.querySelector(".wrapper").classList.add("wrapper-page-404");
  document.querySelector("#header").classList.add("header-transparent");
  document.querySelector(".footer").classList.add("footer-page-404");
}

if (document.querySelector(".stub-page")) {
  document.querySelector(".wrapper").classList.add("wrapper-stub-page");
  document.querySelector("#header").classList.add("header-stub-page");
  document.querySelector(".footer").classList.add("footer-stub-page");
}

// if (window.pageYOffset > 0) {
//   let wrap = document.querySelector(".wrapper");
//   wrap.classList.remove("ui-wrapper");
//   document.querySelector(".header").style.background = "#222E3F";
// }
