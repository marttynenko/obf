// preloader for pages
const preloader = document.querySelector('.preloader');
const scrollbar = document.querySelector('.hidden');

window.addEventListener('load', loader);

function loader() {
  preloader.classList.add('disppear');
  scrollbar.classList.remove('hidden');
}

//popup cookie 
const popUp = document.getElementById("cookiePopup");
const btnAcceptCookie = document.getElementById("acceptCookie");

btnAcceptCookie.addEventListener("click", () => {
  let d = new Date();

  d.setMinutes(2 + d.getMinutes());
  document.cookie = "myCookieName=thisIsMyCookie; expires = " + d + ";";

  popUp.classList.add("hide");
  popUp.classList.remove("show");
});

const checkCookie = () => {
  const input = document.cookie.split("=");

  if (input[0] == "myCookieName") {
    popUp.classList.add("hide");
    popUp.classList.remove("show");
  } else {
    popUp.classList.add("show");
    popUp.classList.remove("hide");
  }
};

window.onload = () => {
  setTimeout(() => {
    checkCookie();
  }, 2000);
};