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
// const popUp = document.getElementById("cookiePopup");
// const btnAcceptCookie = document.getElementById("acceptCookie");

// btnAcceptCookie.addEventListener("click", () => {
//   let d = new Date();

//   d.setMinutes(2 + d.getMinutes());
//   document.cookie = "myCookieName=thisIsMyCookie; expires = " + d + ";";

//   popUp.classList.add("hide");
//   popUp.classList.remove("show");
// });

// const checkCookie = () => {
//   const input = document.cookie.split("=");

//   if (input[0] == "myCookieName") {
//     popUp.classList.add("hide");
//     popUp.classList.remove("show");
//   } else {
//     popUp.classList.add("show");
//     popUp.classList.remove("hide");
//   }
// };

// window.onload = () => {
//   setTimeout(() => {
//     checkCookie();
//   }, 2000);
// };


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