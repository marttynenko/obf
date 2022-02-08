// Слайдер
(function () {
  const toggler = document.querySelectorAll('.ui-swiper')
  if (!toggler.length) return

  toggler.forEach((el,index) => {
    const ds = `ui-swiper-${index}`
    el.classList.add(ds)

    new Swiper(el, {
      autoHeight: true,
      pagination: {
        el: ".swiper-pagination",
        type: "fraction",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    })
  })
  
})();

