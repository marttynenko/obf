// preloader for pages
const preloader = document.querySelector('.preloader');
const scrollbar = document.querySelector('.hidden');

window.addEventListener('load', loader);

function loader() {
  preloader.classList.add('disppear');
  scrollbar.classList.remove('hidden');
}