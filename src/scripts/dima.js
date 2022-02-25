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
        type: "custom",
        renderCustom: function (swiper, current, total) {
          return current + " из " + total;
        },
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
  let uihead = document.querySelector(".header");
  wrap.classList.add("ui-wrapper");
  uihead.classList.add("ui-header");
}

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
  document.querySelector(".wrapper").classList.add("wrapper-museum");
  document.querySelector("#header").classList.add("header-transparent");

  Museum.updateHeight();

  window.addEventListener("resize", Museum.updateHeight, false);

  window.addEventListener("scroll", Museum.scroll, false);
}

// График  company.html

const ctx = document.getElementById("company_chart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ["#F08322"],
        hoverBackgroundColor: ["black"],
        borderColor: ["white"],
        borderWidth: 1,
        datalabels: {
          color: "blue",
        },
      },
    ],
  },
  // plugins: [ChartDataLabels],
  options: {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          // display: false,
          drawBorder: false,
          color: "transparent",
        },
        ticks: {
          color: "transparent",
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          // display: false,
          drawBorder: false,
          color: "transparent",
        },
        ticks: {
          color: "#DD722A",
        },
      },
    },
    onHover: {},
  },
});
