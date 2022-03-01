// preloader for pages
window.addEventListener('load', loader);

function loader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  preloader.classList.add('disppear');
  setTimeout(()=>{
    preloader.remove()
  },1001)
}

//popup cookie 
const popupCookie = document.getElementById("popup-cookie");
const btnAcceptCookie = document.getElementById("btn-accept");

btnAcceptCookie.addEventListener('click', () => {
  const date = new Date();
  
  popupCookie.classList.add("hidden");
  popupCookie.classList.remove("visible");

  localStorage.setItem('cookie', date);
})

function checkCookie() {
  const localStorageCookie = localStorage.getItem('cookie');

  if (localStorageCookie == null) {
    popupCookie.classList.remove("hidden");
    popupCookie.classList.add("visible");
  }
}

window.onload = () => {
  setTimeout(() => {
    checkCookie();
  }, 2000);
};

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
  document.querySelector(".wrapper").classList.add("no-gutters-top");
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