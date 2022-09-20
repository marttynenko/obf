const FARBA = {
  WH: window.innerHeight,

  WW: document.documentElement.clientWidth,

  isTouch: 'ontouchstart' in window || navigator.msMaxTouchPoints,

  removeScroll() {
    D.documentElement.classList.add('ui-no-scroll')
  },

  addScroll() {
    D.documentElement.classList.remove('ui-no-scroll')
  },

  //lazy load для сторонних либ
  lazyLibraryLoad(scriptSrc, linkHref, callback) {
    let script;
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`);
    const domLink = document.querySelector(`link[href="${linkHref}"]`);

    if (!domScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      document.querySelector("#wrapper").after(script);
    }

    if (linkHref !== "" && !domLink) {
      let style = document.createElement("link");
      style.href = linkHref;
      style.rel = "stylesheet";
      document.querySelector("link").before(style);
    }

    if (!domScript) {
      script.onload = callback;
    } else {
      domScript.onload = callback;
    }
  },

  //reinit gallery
  initGallery(selector) {
    const target = D.querySelectorAll(selector);
    if (!target.length) return;

    const scrollTop = window.scrollY;
    const initedLGs = D.querySelectorAll(".lg-inited");
    if (window.lgData && initedLGs.length) {
      initedLGs.forEach((item) => {
        window.lgData[item.getAttribute("lg-uid")].destroy(true);
        item.classList.remove("lg-inited");
      });
      window.scroll(0, scrollTop);
    }

    target.forEach((el) => {
      el.classList.add("lg-inited");

      el.addEventListener("onAfterOpen", function (event) {
        const q = D.querySelector("#lg-counter");
        if (q.childNodes[1] && q.childNodes[1].nodeType === 3) {
          q.childNodes[1].nodeValue = " из ";
        }

        setTimeout(()=>{D.querySelector('.lg-outer').classList.add('lg-appear')},550)
      });


      lightGallery(el, {
        download: false,
        selector: "a.ux-gallery-link",
        backdropDuration: 500,
        speed: 1000
      });

      el.addEventListener("onSlideClick",function(){
        window.lgData[el.getAttribute("lg-uid")].goToNextSlide()
      })

      el.addEventListener("onBeforeClose",function(){
        D.querySelector('.lg-outer').classList.remove('lg-appear')
      })
    });
  },

  initVideo(selector) {
    const target = D.querySelectorAll(selector);
    if (!target.length) return;
    const players = [];

    target.forEach((el, index) => {
      el.addEventListener("click", function (e) {
        e = event || window.event;
        e.preventDefault();

        const id = el.dataset.videoid || null;
        const container = el.nextElementSibling;
        if (!id) return;

        const markup = `<div class="ux-plyr ux-plyr-${index}" data-plyr-provider="youtube" data-plyr-embed-id="${id}"></div>`;

        el.parentElement.classList.add("initialized");
        container.innerHTML = markup;

        players.forEach((el, index) => {
          el.pause()
        });

        const player = new Plyr(`.ux-plyr-${index}`, {
          ratio: "16:9",
          autoplay: true,
          autopause: true,
        });

        players.push(player);

        //оставляем играть только 1 плеер
        players.forEach(item => {
          item.on('playing',function(e) {

            players.forEach(player => {
              if (e.target !== player.elements.container) {
                player.pause()
              }
            })
            
          })
        })
      })

      
    })
  },


  scroller(selector) {
    const link = D.querySelectorAll(selector);
    if (!link.length) return

    link.forEach(el => {
      const target = D.querySelector(el.dataset.target)
      if (target) {
        el.addEventListener('click',(e)=> {
          e = e || window.event
          e.preventDefault()
          // target.scrollIntoView({
          //   behavior: "smooth"
          // });
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth"
        });
        })
      }
    })
  },


  tabs(selector) {
    var tabLinks = document.querySelectorAll(selector);
    if (!tabLinks.length) return;

    let parent = D.createElement('div');
    parent.className = 'ux-tabs-content-parent'
    let contentDivs = new Array();

    tabLinks.forEach((element) => {
      let id = getHash(element.getAttribute("href"));
  
      contentDivs.push(document.getElementById(id));

      element.addEventListener('click', showTab.bind(null,id,element))
    });
  
    tabLinks[0].classList.add("selected");
    contentDivs[0].classList.add("selected");
    
    contentDivs[0].insertAdjacentElement('beforebegin',parent)
    parent.append(...D.querySelectorAll('.ui-tabs-content'))
  
    //functions
    function showTab(id,element,event) {
      if (event) {
        event = event || window.event;
        event.preventDefault()
      }

      fetchTabData(element,id)
      
      for (let i = 0; i < contentDivs.length; i++) {
        let divID = contentDivs[i].getAttribute("id")
        if (divID === id) {

          tabLinks[i].classList.add("selected");
          contentDivs[i].classList.remove("leave");
          setTimeout(()=>{
            contentDivs[i].classList.add("selected","enter");
          },151)
          setTimeout(()=>{
            contentDivs[i].classList.remove("enter");
            easeHeights(contentDivs[i])
          },200)

          
          
          if (id !== location.hash.substring(1)) {
            setHash(id)
          }
        } else {
          tabLinks[i].classList.remove("selected");
          contentDivs[i].classList.add("leave");
          contentDivs[i].classList.remove("enter");
          setTimeout(()=>{
            contentDivs[i].classList.remove("selected");
          },151)
        }
      }
    }

    function easeHeights(currentTab) {
      const height = currentTab.clientHeight
      gsap.to(parent,{height: height, duration: 1, overwrite: true})

      const imgs = currentTab.querySelectorAll('img')
      imgs.forEach(element => element.addEventListener('load',() => {
        parent.style.height = parent.querySelector('.ui-tabs-content.selected').clientHeight + 'px'
      }))
    }

    window.addEventListener('resize',()=>{
      parent.style.height = parent.querySelector('.ui-tabs-content.selected').clientHeight + 'px'
    });

    

    async function fetchTabData(el,id) {
      try {
        if (!el) {
          tabLinks.forEach(item => {
            if (item.getAttribute('href') === '#'+id) {el = item}
          })
        }
  
        const url = el.dataset.url || false
        const isload = el.dataset.isload || false
        const target = el.getAttribute('href')
        
        if (!url || isload === 'true') {return}
        await fetch(url)
          .then(function (response) {
            if (response.status >= 200 && response.status < 400) {
              return response.text();
            }
          })
          .then(function (html) {
            if (html) {
              document.querySelector(target).innerHTML = html;
            }
            el.dataset.isload = true


            if (D.querySelector(".ux-video")) {
              FARBA.lazyLibraryLoad(
                "//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.js",
                "//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.css",
                FARBA.initVideo(".ui-video-preview")
              );
            }
          })
          .catch(function (err) {
            console.warn(err);
          });
      } catch (e) {
        console.log(e)
      }
    }

    
    function getHash(url) {
      var hashPos = url.lastIndexOf("#");
      return url.substring(hashPos + 1);
    }

    function setHash(id) {
      window.onpopstate = function(event) {
        if (event.state && event.state.tab) {
          showTab(event.state.tab)
        }
      };

      history.pushState({tab: id}, '', location.origin + location.pathname + '#' +id);
    }


    function checkHash() {
      if (location.hash == '') return
      hash = location.hash.substring(1);

      showTab(hash)
    }

    checkHash()
  },

  clearStyles() {
    for (let i = 0; i < arguments.length; i++) {
      if (document.querySelector(arguments[i])) {
        document.querySelector(arguments[i]).removeAttribute('style')
      }
    }
  },

  rebuildPager() {
    if (!document.querySelector('.ui-pgn-link') || !document.querySelector('.ui-pgn-current')) return
    const current = document.querySelector('.ui-pgn-current')
    const links = document.querySelectorAll('.ui-pgn-link')
    let prev = current.previousElementSibling
    let prevCounter = 0

    links[links.length - 1].classList.add('mobile-visible')

    while (prev && prev.classList.contains('ui-pgn-link') && prevCounter < 3) {
      prev.classList.add('mobile-visible')
      prev = prev.previousElementSibling
      prevCounter++
    }

    console.log(prevCounter)

    if (prevCounter < 3) {
      let next = current.nextElementSibling
      console.log(next)

      while (next && next.classList.contains('ui-pgn-link') && prevCounter < 3) {
        next.classList.add('mobile-visible')
        next = next.nextElementSibling
        prevCounter++
      }
    }
  }
}

var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {
  console.log(e)
}

gsap.registerPlugin(ScrollTrigger);
CustomEase.create('dflt','.25,.1,.25,1')
CustomEase.create('imgs','0,.85,.8,.96')
CustomEase.create('easeout','0,0,.58,1')
gsap.defaults({
  ease: "dflt"
});

const D = document;

svg4everybody();


const bdy = document.body;
let timer;
window.addEventListener('scroll', function() {
  if (FARBA.isTouch) return
  clearTimeout(timer);
  if(!bdy.classList.contains('disable-hover')) {
    bdy.classList.add('disable-hover')
  }
  
  timer = setTimeout(function(){
    bdy.classList.remove('disable-hover')
  },350);
}, false);


const Headers = {
  header: D.querySelector('#header'),
  headerHeight: 0,
  targets: ['.museum','.first-screen','.history-header','.main-screen','.productions-head'],

  checkTargets () {
    let res = false;
    for (let i = 0; i < this.targets.length; i++) {
      if (D.querySelector(this.targets[i])) {
        res = true;
        continue;
      }
    }
    return res
  },

  updateHeight: () => {
    this.headerHeight = D.documentElement.clientHeight;
  },

  scroll: () => {
    const offset = FARBA.WW <= 959 ? 0 : 160 
    if (window.scrollY >= offset) {
      this.header.classList.remove("header-transparent");
    } else {
      this.header.classList.add("header-transparent");
    }
  },

  init () {
    D.querySelector(".wrapper").classList.add("no-gutters-top");
    D.querySelector("#header").classList.add("header-transparent");

    window.addEventListener("scroll", this.scroll, supportsPassive ? { passive: true } : false);
  }
};

if (Headers.checkTargets()) {
  Headers.init()
}


//full screen menu toggler
(function () {
  const toggler = D.querySelector(".ux-toggler-menu");
  if (!toggler) return;
  let delay = 0;

  toggler.addEventListener("click", function (e) {
    e = event || window.event;
    e.preventDefault();

    if (D.querySelector('.fs-search.opened')) {
      animateFSsearch('close')
      D.querySelector('.circle-link-search').classList.remove('opened')
      delay = 1000
    }

    const action = toggler.classList.contains("opened") ? "close" : "open";
    
    setTimeout(()=>{
      animateFSMenu(action);
    },delay)
    

    this.classList.toggle("opened");
  });
})();

//main-menu
(function () {
  const li = D.querySelectorAll(".main-menu-main > li");

  li.forEach((el) => {
    if (el.querySelector("ul") || el.querySelector('.main-menu-sub-pr')) {
      el.querySelector("a").classList.add("childs-in");
    }
  });

  const parentLinks = D.querySelectorAll("a.childs-in");

  parentLinks.forEach((el) => {
    el.addEventListener("click", function (e) {
      e = event || window.event;
      e.preventDefault();

      const openedItems = D.querySelectorAll(
        ".main-menu-sub.opened, a.childs-in"
      );
      openedItems.forEach((el) => {
        if (el !== this && el !== this.nextElementSibling) {
          el.classList.remove("opened");
        }
      });

      this.classList.toggle("opened");
      this.nextElementSibling.classList.toggle("opened");
    });
  });

  //скрываем меню по клику вне
  D.addEventListener("click", (e) => {
    const openedUL = D.querySelector(".main-menu-sub.opened");
    if (!openedUL) return;
    const withinBoundaries = e.composedPath().includes(openedUL);

    if (!withinBoundaries && !e.target.classList.contains("childs-in")) {
      openedUL.classList.remove("opened");
      D.querySelector("a.childs-in.opened").classList.remove("opened");
    }
  });
})();


//news-archieve toggler
(function () {
  const toggler = D.querySelector(".ux-toggler-archieve");
  const target = D.querySelector(".news-archieve");
  if (!toggler || !target) return;

  toggler.addEventListener("click", function (e) {
    e = event || window.event;
    e.preventDefault();
    if (!this.classList.contains('opened')) {
      if (FARBA.WW < 960) {

        if (!D.querySelector('.news-archieve-mobile')) {
          const tags = D.querySelector('.ui-tags-news')
          const newsFilters = D.createElement('div')
          newsFilters.className = 'news-filters'
          tags.after(newsFilters)
          newsFilters.appendChild(tags)
          const clone = target.cloneNode(true)
          clone.classList.add('news-archieve-mobile')
          newsFilters.appendChild(clone)
        }

        setTimeout(()=>{
          D.querySelector('.news-archieve-mobile').classList.add('opened')
        },1)

      } else {
        gsap.fromTo(target,{autoAlpha: 0, height: 0}, {autoAlpha: 1, height: 'auto'})
      }
    } else {
      if (FARBA.WW < 960) {
        D.querySelector('.news-archieve-mobile').classList.remove('opened')
      } else {
        gsap.to(target,{autoAlpha: 0, height: 0})
      }
    }
    this.classList.toggle("opened");
  });
})();
// function setArchieveOffset() {
//   const target = D.querySelector(".news-archieve");
//   const tags = D.querySelector('.ui-tags-news');

//   if (!target || !tags) return
//   const box = tags.getBoundingClientRect()
//   target.style.top = box.top + window.pageYOffset + 'px'
//   target.style.left = box.left + window.pageXOffset + 'px'
  
// }
// if (FARBA.WW < 960) {
//   window.addEventListener('resize',setArchieveOffset)
// }


//анимируем fullscreen menu
function animateFSMenu(action) {
  const menu = D.querySelector(".fs-menu");
  const header = D.querySelector("#header");
  const toggler = D.querySelector(".menu-toggler-icon");
  const bg = D.querySelector(".fs-menu-bg");

  const ww = document.documentElement.clientWidth
  const hw = document.documentElement.clientHeight
  const diagonal = Math.sqrt(Math.pow(ww, 2) + Math.pow(hw, 2))
  const scale = (diagonal / 44) * 2 * 1.25

  const coords = toggler.getBoundingClientRect()
  bg.style.left = coords.x + 'px'
  bg.style.top = coords.y + 'px'

  if (action === "open") {
    D.body.classList.add('fs-opened');
    header.classList.add("fs-opened");
    menu.classList.add("opened");
    bg.classList.add('opened');
    FARBA.removeScroll()
    const tlStart = gsap.timeline({ autoRemoveChildren: true });
    tlStart
      .to(".fs-menu-bg", { scale: scale, duration: 0.35 })
      .fromTo(
        ".fs-menu .fs-menu-productions",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 }
      )
      .fromTo(
        ".fs-menu-links",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: -0.25 }
      )
      .fromTo(
        ".fs-menu-contacts-1",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: -0.25 }
      )
      .fromTo(
        ".fs-menu-contacts-2",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: -0.25 }
      );
  } else {
    
    D.body.classList.remove('fs-opened');
    const tlEnd = gsap.timeline({ autoRemoveChildren: true });
    tlEnd
      .to(".fs-menu-contacts-2", { y: 50, opacity: 0, duration: 0.3 })
      .to(".fs-menu-contacts-1", {
        y: 50,
        opacity: 0,
        duration: 0.3,
        delay: -0.2,
      })
      .to(".fs-menu-links", { y: 50, opacity: 0, duration: 0.3, delay: -0.2 })
      .to(".fs-menu .fs-menu-productions", {
        y: 5,
        opacity: 0,
        duration: 0.3,
        delay: -0.2,
      })
      .to(".fs-menu-bg", {
        scale: 1,
        duration: 0.25,
        onComplete: () => {
          FARBA.addScroll()
          menu.classList.remove("opened");
          header.classList.remove("fs-opened");
          bg.classList.remove('opened')
        },
      });
  }
}

//full screen search toggler
(function () {
  const toggler = D.querySelector(".circle-link-search");
  if (!toggler) return;
  let delay = 0

  toggler.addEventListener("click", function (e) {
    e = event || window.event;
    e.preventDefault();

    if (D.querySelector('.fs-menu.opened')) {
      animateFSMenu('close')
      D.querySelector('.ux-toggler-menu').classList.remove('opened')
      delay = 1000
    }

    const action = toggler.classList.contains("opened") ? "close" : "open";
    //...
    setTimeout(()=>{
      animateFSsearch(action);
    },delay)
    

    this.classList.toggle("opened");
  });
})();


//анимируем fullscreen search
function animateFSsearch(action) {
  const menu = D.querySelector(".fs-search");
  const header = D.querySelector("#header");
  const toggler = D.querySelector(".circle-link-search");
  const bg = D.querySelector(".fs-search-bg");

  const ww = document.documentElement.clientWidth
  const hw = document.documentElement.clientHeight
  const diagonal = Math.sqrt(Math.pow(ww, 2) + Math.pow(hw, 2))
  const scale = (diagonal / 44) * 2 * 1.25

  const coords = toggler.getBoundingClientRect()
  bg.style.left = coords.x + 'px'
  bg.style.top = coords.y + 'px'

  if (action === "open") {
    bg.classList.add('opened');
    header.classList.add("fs-opened","fs-search-opened");
    menu.classList.add("opened");
    FARBA.removeScroll()
    const tlStart = gsap.timeline({ autoRemoveChildren: true });
    tlStart
      .to(bg, { scale: scale, duration: 0.45 })
      .fromTo('.fs-search-content', {opacity: 0, y: 50},{opacity: 1, y: 0, duration: 0.5})
      
  } else {
    FARBA.addScroll()
    const tlEnd = gsap.timeline({ autoRemoveChildren: true });
    tlEnd
      .to('.fs-search-content', {opacity: 0, y: 50, duration: 0.5})
      .to(bg, { scale: 1, duration: 0.45, onComplete: () => {
        menu.classList.remove("opened");
        bg.classList.remove('opened');
        header.classList.remove("fs-opened","fs-search-opened");
        if (document.querySelector('.fs-search-results')) {
          document.querySelector('.fs-search-results').classList.remove('opened')
        }
      }})
  }
};


//закрытие карты сайта и попап новостей по Esc
document.addEventListener('keydown',(e)=>{
  if (e.code !== 'Escape') return;

  if (D.querySelector('.fs-menu.opened')) {
    animateFSMenu('close')
    D.querySelector('.ux-toggler-menu').classList.remove('opened')
  }

  if (D.querySelector('.fs-search.opened')) {
    animateFSsearch('close')
    D.querySelector('.circle-link-search').classList.remove('opened')
  }

  if (D.querySelector('.news-popup')) {
    mainScreenEx.togglePopup()
  }
});



//фиксация шапки
(function () {
  const target = D.querySelector("#header");
  if (!target) return;

  window.onscroll = function (e) {
    if (this.oldScroll > this.scrollY) {
      target.classList.remove("not-fixed");
    } else if (this.scrollY > 81) {
      target.classList.add("not-fixed");
    }

    this.oldScroll = this.scrollY;
  };
})();


// галлерея
(function () {
  const target = D.querySelectorAll(".ux-gallery");
  if (!target.length) return;

  const getSelectors = (parent,link) => {
    parent.querySelectorAll(link).forEach(item => {
      if (!item.closest('.swiper-slide-duplicate')) {
        item.classList.add('ux-not-duplicate')
      } else {
        item.classList.add('ux-gallery-link-duplicate')
        item.classList.remove('ux-gallery-link')
      }
    })
  }

  const shadowSelectors = (parent) => {
    let evt = new Event('click',{cancelable: true})

    D.querySelectorAll('.ux-gallery-link-duplicate')
    .forEach(item => {
      item.addEventListener('click',(e)  => {
        e = e || window.event;
        e.preventDefault();
        const src = item.querySelector('img').getAttribute('src')
        
        const notDuplicate = parent.querySelector(`.ux-not-duplicate img[src="${src}"]`).parentElement
        if (notDuplicate) {
          notDuplicate.dispatchEvent(evt)
        }
        
      })
    })
  }

  FARBA.lazyLibraryLoad(
    "//cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js",
    "//cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/css/lightgallery.min.css",
    () => {
      target.forEach((el) => {
        el.classList.add("lg-inited");

        el.addEventListener("onAfterOpen", function (event) {
          const q = D.querySelector("#lg-counter");
          if (q.childNodes[1] && q.childNodes[1].nodeType === 3) {
            D.querySelector("#lg-counter").childNodes[1].nodeValue = " из ";
          }

          setTimeout(()=>{D.querySelector('.lg-outer').classList.add('lg-appear')},550)
        });

        let selector = 'a.ux-gallery-link'
        if (el.classList.contains('swiper-rewards-wrp')) {
          getSelectors(el,'a.ux-gallery-link')
          shadowSelectors(el)
          selector = 'a.ux-gallery-link.ux-not-duplicate'
        }

        lightGallery(el, {
          download: false,
          selector: selector,
          backdropDuration: 500,
          speed: 1000
        });
        

        el.addEventListener("onSlideClick",function(){
          window.lgData[el.getAttribute("lg-uid")].goToNextSlide()
        })

        el.addEventListener("onBeforeClose",function(){
          D.querySelector('.lg-outer').classList.remove('lg-appear')
        })
      });
    }
  );
})();


if (D.querySelector(".ux-share")) {
  FARBA.lazyLibraryLoad("//yastatic.net/share2/share.js", "", null);
}

if (D.querySelector(".ux-video")) {
  FARBA.lazyLibraryLoad(
    "//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.js",
    "//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.css",
    FARBA.initVideo(".ui-video-preview")
  );
}


if (D.querySelector('.productions-animation')) {
  const headerbg = D.querySelector('.productions-animation').dataset.headerbg || null

  D.querySelector('#wrapper').classList.add('no-gutters-top')
  if (headerbg) {
    D.querySelector('#header').classList.add(headerbg,'header-colored')
  } 
}


FARBA.scroller('.ux-scroller');



//productions animate
const prdHeadAnimate = () => {
  const head = D.querySelector('.productions-head')
  if (!head) return;

  let btn = head.querySelector('.productions-head-btn')
  if ('.productions-head-tovideo') {
    btn = head.querySelector('.productions-head-tovideo')
  }

  const tl = gsap.timeline();
  tl
    .fromTo('.productions-head-title',{opacity: 0, y: 70}, {opacity: 1, y: 0, duration: 1})
    .fromTo('.productions-head-descr',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1}, ">-0.6")
    .fromTo(btn,{opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.5}, ">-0.55")
    .fromTo('.productions-head-img',{ yPercent: 20, scale: 0.9, opacity: 0}, {yPercent: 0, scale: 1, opacity: 1, duration: 1.5, ease: "power1.inOut"}, '>-1.5')
    .fromTo('.productions-head-btn',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1},">-0.4")
    .fromTo('#header',{opacity: 0, yPercent: -100},{opacity: 1, yPercent: 0, duration: 0.4},1);


  //убираем инлайн-стили после анимации
  tl.eventCallback(
    "onComplete",
    FARBA.clearStyles,
    ['.productions-head-img','.productions-head-title','.productions-head-descr','.productions-head-arrow','.productions-head-btn','.productions-head-tovideo','#header']
  )
}

const firstScreenAnimate = () => {
  const head = D.querySelector('.first-screen')
  if (!head) return;

  const tl = gsap.timeline();
  tl
    .from({},{},0.1)
    .from('.first-screen-title',{opacity: 0, y: 30, duration: 0.8})
    .from('.first-screen-txt',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.first-screen-arrow',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.first-screen-right',{opacity: 0, y: 30, duration: 0.6},'>-0.6')
    .fromTo('#header',{opacity: 0, yPercent: -100}, {opacity: 1, yPercent: 0, duration: 0.4},'-=1');
  
  tl.eventCallback(
    "onComplete",
    FARBA.clearStyles,
    ['.first-screen-title','.first-screen-txt','.first-screen-arrow','.first-screen-right','#header']
  )
}

const museumScreenAnimate = () => {
  const head = D.querySelector('.museum-header')
  if (!head) return;

  const tl = gsap.timeline();
  tl
    .from({},{},0.1)
    .from('.museum-top-screen-title',{opacity: 0, y: 30, duration: 0.8})
    .from('.museum-top-screen-text',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.history-header-arrow',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.museum-circle',{opacity: 0, y: 30, duration: 0.6},'>-0.6')
    .fromTo('#header',{opacity: 0, yPercent: -100}, {opacity: 1, yPercent: 0, duration: 0.4},'>-0.4');
  
  tl.eventCallback(
    "onComplete",
    FARBA.clearStyles,
    ['.museum-top-screen-title','.museum-top-screen-text','.history-header-arrow','.museum-circle','#header']
  )
}

window.addEventListener('load',() => {
  prdHeadAnimate()
  firstScreenAnimate()
  museumScreenAnimate()
});




(function () {
  const trigger = D.querySelectorAll('.bbi-parallax')
  if (!trigger) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: 'top 80%',
      end: 'bottom 80%',
      scrub: 0.5
    }
  })
  
  gsap.utils.toArray('.bbi-parallax-img').forEach((el,index,arr) => {
    const y = -((arr.length - index) * 5);
    tl.to(el,{yPercent: y, ease: "none"},0)
  })
  
})();


const rewards = document.querySelectorAll('.swiper-rewards-wrp')
rewards.forEach((el,index) => {
  const slider = el.querySelector('.swiper-rewards')
  const prevArrow = el.querySelector('.swiper-button-prev')
  const nextArrow = el.querySelector('.swiper-button-next')

  const ds = `swiper-reward-${index}`
  slider.classList.add(ds)

  prevArrow.classList.add(`swiper-button-prev-${index}`)
  nextArrow.classList.add(`swiper-button-next-${index}`)


  const swiper = new Swiper(`.${ds}`, {
    autoHeight: true,
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 500,
    shortSwipes: true,
    navigation: {
      nextEl: nextArrow,
      prevEl: prevArrow,
    },
    breakpoints: {
      960: {
        autoHeight: false,
        slidesPerView: 2,
        spaceBetween: 30,
        shortSwipes: false,
      }
    }
  })

  el.addEventListener('mousedown', event => {
    event.preventDefault()
    return false
  });
})




//charts
document.querySelectorAll('.ux-chart').forEach((el) => {
  const str = el.dataset.data || null
  if (!str) return;
  const data = str.split(',')
  const color = el.dataset.color || 'primary'

  let max = 0
  for (let i = 0; i < data.length; i++) {
    const value = data[i].split(':')[1]
    if (+value > max) {max = value}
  }
  
  for (let i = 0; i < data.length; i++) {
    const label = data[i].split(':')[0]
    const value = data[i].split(':')[1]

    const bar = D.createElement('div')
    bar.className = 'ui-chart-bar'
    if (data.length - i > 10) {
      bar.classList.add('ui-chart-bar-desctop')
    }

    const progress = D.createElement('div')
    progress.className = `ui-chart-bar-progress ui-bg-${color}`
    progress.style.height = (value / max * 100) + '%'
    progress.style.width = (value / max * 100) + '%'

    const labelEl = D.createElement('div')
    labelEl.className = `ui-chart-bar-label  ui-color-${color}`
    labelEl.textContent = label

    const valueEl = D.createElement('div')
    valueEl.className = `ui-chart-bar-value`
    valueEl.textContent = value

    progress.appendChild(valueEl)
    progress.appendChild(labelEl)

    bar.appendChild(progress)
    el.appendChild(bar)

    el.addEventListener('mousemove',(e) => {
      if (FARBA.WW < 960) return
      const bar = e.target.closest('.ui-chart-bar');
      if (!bar) return
      el.querySelectorAll('.ui-chart-bar').forEach(item => {
        item.classList.add('darken')
        item.classList.remove('active')
      })
      bar.classList.remove('darken')
      bar.classList.add('active')
    })

    el.addEventListener('mouseleave',(e) => {
      el.querySelectorAll('.ui-chart-bar').forEach(item => {
        item.classList.remove('darken')
        item.classList.remove('active')
      })
    })
  }
})


FARBA.tabs(".ux-tabs a");


const mainScreen = () => {
  if (!D.querySelector('#main-screen')) return;
  const slides = D.querySelectorAll('.main-slide').length

  if (D.documentElement.clientWidth > 959) {
    D.querySelectorAll('.main-slide').forEach(item => {
      const img = item.querySelector('img.main-slide-img')
      if (img) {
        const src = img.getAttribute('src')
        const pic = new Image()
        pic.src = src
        pic.className = 'main-screen-cache'
        D.querySelector('#main-screen').appendChild(pic)
      }
    })
  }
  

  return new Vue({
    el: '#main-screen',
    data: {
      index: 0,
      slides: slides,
      timer: null,
      isPopup: false,
      bgCoords: {
        x: 0,
        y: 0
      },
      line: null,
      timeout: 5,
      isMobile: true,
      wiper: null
    },

    watch: {
      index: function(val) {
        this.animateShadow(val)
      }
    },

    methods: {
      changeSlide(index) {
        this.index = index

        clearTimeout(this.timer)
        this.initTimer()

        //меняем статус анимации прогрессбара
        this.line.progress(index / this.slides)
      },

      animateShadow(index) {
        const shadow = D.querySelector('.main-slides-nav-border')
        const activeLink = D.querySelectorAll('.main-slides-nav-link')[index]
        const coords = activeLink.getBoundingClientRect()

        gsap.to(shadow,{width: coords.width, x: coords.x})
      },

      initTimer() {
        this.timer = setInterval(() => {
          if (this.index === this.slides - 1) {
            this.index = 0
            //перезапускаем анимацию прогрессбара
            this.line.restart()
          } else {
            this.index++
          }
        },this.timeout*1000)
      },

      initProgress() {
        this.line = gsap.timeline()
        const duration = this.timeout * this.slides
        
        this.line = gsap.timeline()
        for (let i = 0; i < this.slides; i++) {
          this.line.to(this.$refs.progress,
            {
              width: () => {
                const w = (i+1) * (100 / this.slides)
                return w + '%'
              },
              duration: this.timeout,
              ease: "easeout"
            }
          )
        }
      },

      slideEnter(el,done) {
        const tl = gsap.timeline({ autoRemoveChildren: true })
        gsap.set(el.querySelector('.main-slide-img'), {scale: 0.92})
        tl
          .fromTo(el.querySelector('.main-slide-content'),{opacity: 0, x: -150},{opacity: 1, x: 0, duration: 0.35})
          .fromTo(el.querySelector('.main-slide-img'),{opacity: 0, xPercent: 50}, {opacity: 1, xPercent: 0, duration: 0.51, ease: "easeout"},'-=0.51')
          .to(el.querySelector('.main-slide-img'),{scale: 1, duration: 4.5, ease: "imgs", onComplete: done}, '-=0.51')
      },
      slideLeave(el,done) {
        const tl = gsap.timeline({ autoRemoveChildren: true })
        tl
          .to(el.querySelector('.main-slide-img'),{opacity: 0, xPercent: -50, duration: 0.45, ease: "easeout"})
          .to(el.querySelector('.main-slide-content'),{opacity: 0, x: 150, onComplete: done}, '-=0.45')
      },

      popupEnter(el,done) {
        const ww = document.documentElement.clientWidth
        const hw = document.documentElement.clientHeight
        const size = ww < 600 ? 92 : (ww < 960) ? 106 : (ww < 1440) ? 130 : 170 
        const diagonal = Math.sqrt(Math.pow(ww, 2) + Math.pow(hw, 2))
        const scale = (diagonal / size) * 2
        const news = this.$refs.popupBody.querySelectorAll('.news-grid')

        FARBA.removeScroll()
        
        if (this.wiper) {
          this.wiper.autoplay.stop();
        }

        const tl = gsap.timeline()
        tl
          .to(this.$refs.popupBg,{scale: scale, duration: 0.45})
          .fromTo(this.$refs.popupBody,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.3, onComplete: () => {
            done()
            setTimeout(()=>{this.$refs.popupBody.style = ''},1)
          }})
          // news.forEach((item,index) => {
          //   tl.fromTo(item,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.3, onComplete: () => {
          //     setTimeout(()=>{item.style = ''},1)
          //   }}, '-=0.15')
          // })
          // tl.to({},{onComlete: done},0);

        tl.eventCallback("onComplete", () => {
          gsap.to(this.$refs.popupBtn,{opacity: 1, y: 0, duration: 0.3});
        });
      },

      popupLeave(el,done) {
        const tl = gsap.timeline()
        tl
          .to(this.$refs.popupBody, {opacity: 0, y: 50, duration: 0.4})
          .to(this.$refs.popupBg,{scale: 1, duration: 0.3, delay: -0.15, onComplete: done})

        FARBA.addScroll()
        if (this.wiper) {
          this.wiper.autoplay.start();
        }
      },

      togglePopup() {
        this.getBgCoords()

        this.isPopup = !this.isPopup
      },

      getBgCoords() {
        const coords = this.$refs.popupToggler.getBoundingClientRect()
        this.bgCoords.x = coords.x
        this.bgCoords.y = coords.y
      },

      appearAnimation() {
        const tl = gsap.timeline()
        const slide = D.querySelector('.main-slide')
        const content = slide.querySelector('.main-slide-content')
        const img = slide.querySelector('.main-slide-img')
        const newsLink = this.$refs.popupToggler
        const actualLink = D.querySelector('.main-screen-news')

        const clearHeader = () => {
          D.querySelector('#header').removeAttribute('style')
        }

        tl
          .fromTo(img, {scale: 0.95}, {scale: 1, duration: 4.5, delay: 0.5, ease: 'imgs'})
          .fromTo(content,{opacity: 0, x: -75},{opacity: 1, x: 0, duration: 0.35}, '-=4.5')
          .from(newsLink, {x: 40, opacity: 0, duration: 0.35}, '-=4.5')
          .from(actualLink, {x: 100, opacity: 0, duration: 0.35}, '-=4.5')
          .fromTo('#header',{opacity: 0, yPercent: -100},{opacity: 1, yPercent: 0, duration: 0.4, onComplete: clearHeader}, '-=4.5')
          .fromTo('.main-slides-nav',{opacity: 0, yPercent: 100},{opacity: 1, yPercent: 0, duration: 0.4}, '-=4.1')
      },

      appearAnimationMobile() {
        const clearImg = (img) => {
          setTimeout(()=>{
            img.removeAttribute('style')
          },1)
        }
        
        const slide = D.querySelector('.mobile-slides-swiper .swiper-slide-active')
        const img = slide.querySelector('.mobile-slides-img img')
        const body = slide.querySelector('.mobile-slides-body')

        gsap.fromTo(img,{scale: 0.9},{scale: 1, duration: 4.5, ease: "imgs",onComplete: clearImg, onCompleteParams: [img]})
        gsap.fromTo(body,{opacity: 0, x: 25}, {opacity: 1, x: 0, duration: 1})
        
      },

      initCarousel() {
        const total = D.querySelectorAll('.mobile-slides .swiper-slide:not(.swiper-slide-duplicate)').length

        const pgn = (total,current) => {
          const pgn = D.querySelector('.mobile-slides-pgn')
          pgn.textContent = current+1 + ' из ' + total
        }
       
        this.wiper = new Swiper('.mobile-slides-swiper',{
          slidesPerView: 1,
          loop: true,
          speed: 500,
          effect: "fade",
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          watchSlidesProgress: true,
          pagination: {
            el: ".mobile-slides-bar",
            bulletClass: "mobile-slides-bullet",
            bulletActiveClass: "active"
          },
          navigation: {
            nextEl: '.mobile-slides-next',
            prevEl: '.mobile-slides-prev',
          },
        })

        pgn(total,0)

        this.wiper.on('realIndexChange',(swiper)=> {
          const slideIndex = swiper.realIndex
          const bullets = D.querySelectorAll('.mobile-slides-bullet')

          pgn(total,slideIndex);

          bullets.forEach((el,index) => {
            if (index < slideIndex) {
              el.classList.add('filled')
            } else {
              el.classList.remove('filled')
            }
          })

          const clearImg = (img) => {
            setTimeout(()=>{
              img.removeAttribute('style')
            },1)
          }
          
          setTimeout(()=>{
            const slide = D.querySelector('.mobile-slides-swiper .swiper-slide-active')
            const img = slide.querySelector('.mobile-slides-img img')
            const body = slide.querySelector('.mobile-slides-body')

            gsap.fromTo(body,{opacity: 0, x: 25}, {opacity: 1, x: 0, duration: .6})
            gsap.fromTo(img,{opacity: 0, x: 25}, {opacity: 1, x: 0, delay: 0.15, duration: .6})
            gsap.fromTo(img,{scale: 0.9},{scale: 1, delay: 0.15, duration: 4.5, ease: "imgs",onComplete: clearImg, onCompleteParams: [img]})
          },1)
        });

        const observer = new IntersectionObserver((entries, observer)=>{
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // console.log('ин')
              this.wiper.autoplay.start()
            } else {
              // console.log('оут')
              this.wiper.autoplay.stop()
            }
          })
        }, {
          threshold: 0,
          rootMargin: '-62px 0px 0px 0px'
        })

        observer.observe(document.querySelector('.mobile-slides'))
      },

      imgsPositioning () {
        const slides = D.querySelectorAll('.mobile-slides-slide')
      
        slides.forEach(el => {
          const wrp = el.querySelector('.mobile-slides-img')
          const img = wrp.querySelector('img')
      
          if (img.clientHeight >= wrp.clientHeight) {
            img.classList.add('align-top')
          } else {
            img.classList.remove('align-top')
          }
        })
        
      },

      mediaHandler() {
        const sc959 = window.matchMedia("(max-width:959px)");
      
        const changes = (sc959) => {
          if (sc959.matches) {
            this.isMobile = true
            
            setTimeout(() => {
              this.initCarousel()
              this.appearAnimationMobile()
              this.imgsPositioning()

              window.addEventListener('load', this.imgsPositioning, false)
              window.addEventListener('resize', this.imgsPositioning, false)
            },2)
            
          } else {
            this.isMobile = false
            this.wiper = null
            
            setTimeout(() => {
              this.initTimer()
              this.initProgress()
              this.animateShadow(0)
              this.appearAnimation()

              window.removeEventListener('load', this.imgsPositioning, false)
              window.removeEventListener('resize', this.imgsPositioning, false)
            },2)
          }
        }

        sc959.addListener(changes);
        changes(sc959);
      }
    },

    created() {
      window.addEventListener('load',()=>{
        this.mediaHandler()
      })
      
    },

    mounted() {
      window.addEventListener('resize', ()=>{
        if (this.isMobile) return
        this.animateShadow(this.index)
      }, false)

    }
  })
}
const mainScreenEx = mainScreen()




const mainActivities = () => {
  if (!D.querySelector('#main-activities')) return;

  if (FARBA.WW > 959) {
    D.querySelectorAll('.main-activities-img img').forEach(item => {
      const img = new Image();
      img.src = item.getAttribute('src')
      img.className = 'main-activities-cache'
      D.querySelector('#main-activities').appendChild(img)
    })
  }
  

  return new Vue({
    el: '#main-activities',
    data: {
      index: 0,
      appearHeight: 0,
      isMobile: true
    },

    methods: {
      changeTab(index) {
        this.index = index
      },

      getPaddings() {
        const computedStyle = getComputedStyle(D.querySelector('#main-activities'));
        const paddings = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        return paddings
      },

      easeHeight() {
        const h = D.querySelector('#main-activities .container').clientHeight
        const paddings = this.getPaddings()

        gsap.fromTo('#main-activities',{height: this.appearHeight},{height: h+paddings, onComplete: ()=>{
          this.appearHeight = h+paddings
        }})
      },

      descrEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, y: 25},{opacity: 1, y: 0, duration: 0.49, delay: 0.2, onComplete: done})
      },

      descrLeave(el,done) {
        gsap.to(el,{opacity: 0, y: 25, duration: 0.25, onComplete: done})
      },

      tabEnter(el,done) {
        const img = el.querySelector('.main-activities-img')
        const sight = el.querySelector('.main-activities-sights')
        const tl = gsap.timeline()
        tl
          .fromTo(img,{opacity: 0, x: 50},{opacity: 1, x: 0, duration: 0.5, onStart: () => {
            this.easeHeight()
        }})
          .fromTo(sight,{opacity: 0, x: 50},{opacity: 1, x: 0, duration: 0.5, onComplete: done}, '-=0.5')
      },
      tabLeave(el,done) {
        const img = el.querySelector('.main-activities-img')
        const sight = el.querySelector('.main-activities-sights')
        const tl = gsap.timeline()
        tl.to(img,{opacity: 0, x: 50, duration: 0.25})
          .to(sight,{opacity: 0, x: 50, duration: 0.25, onComplete: done},'-=0.25')
      },

      scrollAnim() {
        const tls = gsap.timeline({
          scrollTrigger: {
            trigger: '#main-activities',
            start: "top 60%",
            end: '+=40%',
            // scrub: 2,
            toggleActions: 'play none none none'
          }
        })
      
        tls
          .from('.main-activities-img',{opacity: 0, y: 50, duration: 0.5})
          .from('.main-activities-sights',{opacity: 0, y: 50, duration: 0.5}, '>-0.15')
          .from('.main-activities-nav',{opacity: 0, y: 50, duration: 0.5})
          .from('.main-activities-descrs',{opacity: 0, y: 30, duration: 0.5},'-=0.2')
      },

      setHeight() {
        const h = D.querySelector('#main-activities .container').clientHeight
        const paddings = this.getPaddings()
        this.appearHeight = h + paddings
        D.querySelector('#main-activities').style.height = this.appearHeight + 'px'
      },

      desctopStartup() {
        this.setHeight()

        this.scrollAnim()

        // window.addEventListener('resize', this.setHeight, false)

        // window.addEventListener('load', this.setHeight, false)
      },

      initCarousel() {
        const wiper = new Swiper('.mobile-activities-swiper',{
          slidesPerView: 1,
          autoHeight: true,
          loop: true,
          speed: 500,
          effect: "fade",
          navigation: {
            nextEl: '.mobile-activities-next',
            prevEl: '.mobile-activities-prev',
          },
        })

        wiper.on('init',()=>{
          setTimeout(()=>{
            const slide = D.querySelector('.mobile-activities-swiper .swiper-slide-active')
            if (!slide) return
            const name = slide.dataset.name || ''
            this.$refs.flipTitle.textContent = name
          },1)
        })

        wiper.on('realIndexChange',(swiper)=> {
          setTimeout(()=>{
            const slide = D.querySelector('.mobile-activities-swiper .swiper-slide-active')
            if (!slide) return
            const name = slide.dataset.name || ''
            this.$refs.flipTitle.textContent = name

            const img = slide.querySelector('.mobile-activities-img img')
            const txt = slide.querySelector('.mobile-activities-txt')
            const data = slide.querySelector('.mobile-activities-data')

            const tl = gsap.timeline()
            tl
              .fromTo(img,{x: 50, opacity: 0},{x: 0, opacity: 1, duration: .5})
              .fromTo(data,{y: 15, opacity: 0},{y: 0, opacity: 1, duration: .5},'<0.2')
              .fromTo(txt,{y: 15, opacity: 0},{y: 0, opacity: 1, duration: .5},'<0.2')
          },1)
  
        });
      },

      flipNav(event) {
        const panel = this.$refs.flipPanel
        const links = this.$refs.flip
        const block = D.querySelector('.main-activities')
        if (!links || !block) return
        const sy = window.scrollY
        const linksBox = panel.getBoundingClientRect()
        const blockBox = block.getBoundingClientRect()
        const margin = FARBA.WW < 600 ? 48 : 62

        if (sy > linksBox.top + window.pageYOffset - margin && sy < blockBox.bottom + window.pageYOffset - margin*2) {
          links.classList.add('flipped')
        } else {
          links.classList.remove('flipped')
        }
      },

      mediaHandler() {
        const sc959 = window.matchMedia("(max-width:959px)");
      
        const changes = (sc959) => {
          if (sc959.matches) {
            this.isMobile = true
            
            setTimeout(() => {
              this.initCarousel()
              window.addEventListener('scroll',this.flipNav, false)
              window.removeEventListener('resize', this.setHeight, false)
              window.removeEventListener('load', this.setHeight, false)
            },2)
            
          } else {
            this.isMobile = false
            
            setTimeout(() => {
              this.desctopStartup()
              window.removeEventListener('scroll',this.flipNav, false)
              window.addEventListener('resize', this.setHeight, false)
              window.addEventListener('load', this.setHeight, false)
            },2)
          }
        }

        sc959.addListener(changes);
        changes(sc959);
      },
    },

    mounted() {
      this.mediaHandler()
    }
  })
}
mainActivities()


const mainEntrs = () => {
  if (!D.querySelector('#main-entrs')) return;

  D.querySelectorAll('.main-entrs-imgs img').forEach(item => {
    const img = new Image();
    img.src = item.getAttribute('src')
    img.className = 'main-entrs-cache'
    D.querySelector('#main-entrs').appendChild(img)
  })
  D.querySelector('.main-entrs-title').classList.add('main-entrs-title-main')

  return new Vue({
    el: '#main-entrs',
    data: {
      index: 0,
      appearHeight: 0,
      isMobile: true,
      isPopup: false,
      popupIndex: -1
    },

    watch: {
      index: function(val) {
        this.animateShadow(val)
      }
    },

    methods: {
      changeSlide(index) {
        this.index = index
      },

      animateShadow(index) {
        const shadow = D.querySelector('.main-entrs-nav-border')
        const activeLink = D.querySelectorAll('.main-entrs-nav-link')[index]
        const coords = activeLink.getBoundingClientRect()
        const ww = D.documentElement.clientWidth
        const cw = D.querySelector('.container').clientWidth
        const rw = (ww - cw) / 2

        gsap.to(shadow,{width: coords.width, height: coords.height, x: coords.x - rw - 30})
      },

      getPaddings() {
        const computedStyle = getComputedStyle(D.querySelector('#main-entrs'));
        const paddings = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        return paddings
      },

      easeHeight() {
        setTimeout(()=>{
          const h = D.querySelector('.main-entrs-slide').clientHeight

          const paddings = this.getPaddings()

          gsap.fromTo('#main-entrs',{height: this.appearHeight},{height: h+paddings, onComplete: ()=>{
            this.appearHeight = h+paddings
          }})
        },1)
        
      },

      titleEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, x: -50},{opacity: 1, x: 0, duration: 0.3, delay: -0.05, onComplete: done})
      },

      titleLeave(el,done) {
        gsap.to(el,{opacity: 0, x: 50, duration: 0.3, onComplete: done})
      },

      bodyEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, x: -25},{
          opacity: 1, x: 0, duration: 0.4, delay: -0.05,
          onStart: () => {
            this.easeHeight()
          },
          onComplete: done
        })
      },

      bodyLeave(el,done) {
        gsap.to(el,{opacity: 0, x: 25, duration: 0.3, onComplete: done})
      },

      imgEnter(el,done) {
        const img = el.querySelector('.main-entrs-img')
        const btn = el.querySelector('.ui-btn-circle')
        const tl = gsap.timeline()

        tl.fromTo(img,{opacity: 0, x: 50},{opacity: 1, x: 0, duration:0.5, delay: -0.1})
          .fromTo(btn,{opacity: 0, x: 30},{opacity: 1, x: 0, duration: 0.4, onComlete: done}, '-=0.35')
      },

      imgLeave(el, done) {
        gsap.to(el,{opacity: 0, x: 50, duration: 0.3, onComplete: done})
      },

      scrollAnim() {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#main-entrs',
            start: "top 60%",
            end: "+=40%",
            toggleActions: 'play none none none'
          }
        })
      
        tl
          .from('.main-entrs-nav',{opacity: 0, y: 50, duration: 1})
          .from('.main-entrs-img',{opacity: 0, y: 120, duration: 0.5}, '>-0.35')
          .from('.main-entrs-imgs .ui-btn-circle',{opacity: 0, y: 50, duration: 0.5}, '>-0.2')
          .from('.main-entrs-descr',{opacity: 0, y: 30, duration: 0.5})
          
        gsap.utils.toArray('.main-entrs-vntg').forEach((el,index)=>{
          const delay = ((index + 1) % 2 === 0) ? 0.3 : 0
          tl.from(el,{opacity: 0, y: 30, duration: 0.3}, `-=${delay}`)
        })
      },

      desktopStart() {
        this.scrollAnim()
        this.animateShadow(0)

        //Устанавливаем начальную высоту
        this.appearHeight = D.querySelector('.main-entrs-slide').clientHeight + this.getPaddings()
        D.querySelector('#main-entrs').style.height = this.appearHeight + 'px'

        window.addEventListener('resize', ()=>{
          this.animateShadow(this.index)
          
          this.appearHeight = D.querySelector('.main-entrs-slide').clientHeight + this.getPaddings()
          D.querySelector('#main-entrs').style.height = this.appearHeight + 'px'
        }, false)


        window.addEventListener('load', ()=>{
          this.animateShadow(this.index)
          
          this.appearHeight = D.querySelector('.main-entrs-slide').clientHeight + this.getPaddings()
          D.querySelector('#main-entrs').style.height = this.appearHeight + 'px'
        }, false)
      },

      openPopup(index) {
        this.popupIndex = index
        this.isPopup = true
        D.documentElement.classList.add('ui-no-scroll')
      },

      closePopup() {
        this.isPopup = false
        this.popupIndex = -1
        D.documentElement.classList.remove('ui-no-scroll')
      },

      popupEnter(el,done) {
        const tl = gsap.timeline()
        tl
          .from(el,{y:50, opacity: 0, duration: 1})
          .from(el.querySelector('.main-entrs-title'),{y: 30, opacity: 0, duration: 0.5},"<0.35")
          .from(el.querySelector('.main-entrs-imgs'),{y: 30, opacity: 0, duration: 0.5},"<0.2")
          .from(el.querySelector('.main-entrs-descr'),{y: 30, opacity: 0, duration: 0.5},"<0.2")
          .from(el.querySelector('.main-entrs-vntgs'),{y: 30, opacity: 0, duration: 0.5, onComplete: done},"<0.2")
      },

      popupLeave(el,done) {
        const tl = gsap.timeline()
        tl
          .to(el,{y: 50, opacity: 0, duration: .8, onComplete: done})
      },

      flipNav(event) {
        const panel = D.querySelector('.main-entrs-in-panel')
        const links = D.querySelector('.main-entrs-in-links')
        const block = D.querySelector('.main-entrs')
        if (!links || !block) return
        const sy = window.scrollY
        const linksBox = panel.getBoundingClientRect()
        const blockBox = block.getBoundingClientRect()
        const margin = FARBA.WW < 600 ? 48 : 62

        if (sy > linksBox.top + window.pageYOffset - margin && sy < blockBox.bottom + window.pageYOffset - margin*2) {
          links.classList.add('flipped')
        } else {
          links.classList.remove('flipped')
        }
      },

      mediaHandler() {
        const sc959 = window.matchMedia("(max-width:959px)");
      
        const changes = (sc959) => {
          if (sc959.matches) {
            this.isMobile = true
            
            setTimeout(() => {
              window.addEventListener('scroll',this.flipNav)
            },2)
            
          } else {
            this.isMobile = false
            
            setTimeout(() => {
              this.desktopStart()
              window.removeEventListener('scroll',this.flipNav)
            },2)
          }
        }

        sc959.addListener(changes);
        changes(sc959);
      }
    },

    mounted() {
      this.mediaHandler()
    }
  })
}
mainEntrs();

//анимация массива элементов по скроллy для главной
function animArrayTrigger(arr,duration) {
  arr.forEach((el,i) => {
    gsap.utils.toArray(el).forEach((item,index) => {
      if (item) {
        ScrollTrigger.create({
          trigger: item,
          onEnter: function() {
            const idx = i + index
            animateFrom(item, idx, duration)
          },
          onLeave: false,
          onEnterBack: false,
        })
      }
    })
  })

  function animateFrom (elem,index) {
    const delay = index * (duration * 0.25)
    gsap.fromTo(elem, 
      {y: 50, opacity: 0},
      {y: 0, opacity: 1, duration: duration, delay: delay, overwrite: "auto"}
    )
  }
}


//анимируем лендинги предприятий
function animateEnterprises() {
  if (!D.querySelector('.history-header')) return
  const tl = gsap.timeline()
  tl
    .from({},{},0.1)
    .from('.history-header-title',{opacity: 0, y: 30, duration: 0.8})
    .from('.history-header-text',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.history-header-arrow',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.history-header-btn',{opacity: 0, y: 30, duration: 0.6},'>-0.6');
}


if (D.querySelector('.productions-tk-stock-row')) {
  D.querySelector('.productions-tk-stock-row').closest('.productions-block').classList.add('productions-tk-stock')
}

if (D.querySelector('.productions-block .node-slider')) {
  D.querySelector('.productions-block .node-slider').closest('.productions-block').classList.add('productions-block-best')
}


//анимируем лендинги продукции
function animateProductionsNoTk() {
  if (FARBA.isTouch) return;
  if (!D.querySelector('.productions-block-mk')) return

  // const tl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.productions-block-mk',
  //     start: 'top 100%',
  //     end: "+=100%",
  //     scrub: true
  //   }
  // })
  // tl
  //   .to('.productions-head',{yPercent: 50, ease: 'none'}, 0)

  ScrollTrigger.create({
    trigger: ".productions-block-mk",
    start: 'top 100%',
    end: "+=100%",
    scrub: true,
    onUpdate: self => {
      const pg = self.progress.toFixed(3)
      gsap.set('.productions-head',{yPercent: pg / 2 * 100}) 
    }
  });
}
animateProductionsNoTk()


function wheelProductionsTK() {
  const screens = D.querySelector('.productions-screens')
  if (!screens) return


  const videoScreens = D.querySelectorAll('.productions-screen');
  
  const btn = videoScreens[videoScreens.length - 1].querySelector('.ui-btn-circle')
  if (btn) { btn.classList.add('bigger') }

  if (D.documentElement.clientWidth > 960 && videoScreens.length) {
    videoScreens.forEach((el,index) => {
      const video = el.querySelector('video')
      if (video) {
        const src = video.currentSrc
        const link = D.createElement('link');
        link.href = src
        link.rel = 'prefetch';
        // link.as = 'video';
        document.head.appendChild(link);
  
        const cache = D.createElement('video');
        const source = D.createElement('source');
        source.setAttribute('src', src);
        source.setAttribute('type', 'video/mp4');
        cache.setAttribute('preload', 'auto');
        cache.appendChild(source);
        // cache.className = 'ui-hidden'
      }
    })
  }

  const tk = new Vue({
    el: '.wheel-screens',
    data: {
      index: -1,
      vd: 0,
      trigger: false,
      isAnimating: false,
      activeScreen: 0,
      translate: 0,
      isAll: false,
      isMobile: false,
      isParalaxing: false,
      scrollPos: 0
    },

    methods: {
      headEnter(el, done) {
        let arrow = '.productions-head-arrow';
        if (document.documentElement.classList.contains('ui-touchscreen')) {
          arrow = '.productions-head-tovideo'
        }

        const tl = gsap.timeline();
        tl
        .fromTo('.productions-head-title',{opacity: 0, y: 70}, {opacity: 1, y: 0, duration: 1})
        .fromTo('.productions-head-descr',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1}, ">-0.6")
        .fromTo(arrow,{opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.5}, ">-0.55")
        .fromTo('.productions-head-img',{ yPercent: 20, scale: 0.9, opacity: 0}, {yPercent: 0, scale: 1, opacity: 1, duration: 1.5, ease: "power1.inOut"}, '>-1.5')
        .fromTo('.productions-head-btn',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1},">-0.4")
        .fromTo('#header',{opacity: 0, yPercent: -100},{opacity: 1, yPercent: 0, duration: 0.4,onComplete: () => {
          this.index = -1;
          done
          setTimeout(()=>{
            this.isAnimating = false;
          },100)
        }},1);


        //убираем инлайн-стили после анимации
        tl.eventCallback(
          "onComplete",
          FARBA.clearStyles,
          ['.productions-head-img','.productions-head-title','.productions-head-descr','.productions-head-arrow','.productions-head-btn','#header']
        )
      },

      headLeave(el,done) {
        gsap.to(el,{y: 50, opacity: 0, duration: 1, onComplete: done})
      },

      productionsEnter(el,done) {
        if (!this.isMobile) {
          gsap.from(el,{yPercent: 35, opacity: 0, duration: 1.5,onStart: () => {
            this.index = this.index < 1 ? 0 : videoScreens.length - 1;
          }, onComplete: () => {
            done()
            
            setTimeout(()=>{
              this.isAnimating = false;
            },1551)
          }})
        } else {
          gsap.to(el,{opacity: 1, duration: .1, onComlete: done})
        }
        
      },

      productionsLeave(el,done) {
        gsap.to(el,{yPercent: 35, opacity: 0, duration: 1, onComplete: done})
      },

      slideEnter(el,done) {
        const img = el.querySelector('.productions-screen-img')
        const title = el.querySelector('.productions-screen-titles') || el.querySelector('h2')
        const navs = el.querySelector('.productions-screen-touchnav')
        const details = el.querySelector('.productions-screen-details')
        // const btn = el.querySelector('.ui-btn-circle')
        const btn = el.querySelector('.productions-screen-btns')
        const video = el.querySelector('video')
        let delay = 3

        if (video) { video.play() }

        video.addEventListener('loadedmetadata',()=>{
          delay = video.duration
          createTimeline()
          setTimeout(()=> {
            this.isAnimating = false
          },delay * 1000)
        })
        // video.addEventListener('ended',()=>{
        //   gsap.to(el.querySelector('.productions-screen-img'),{opacity: 1, duration: 1})
        // })
        
        gsap.set(details,{opacity: 0})
        gsap.set(btn,{opacity: 0})

        const tl = gsap.timeline()
        tl
          .to({},{onStart: () => {
            // if (video) { video.play() }
          }},0.5)
          .fromTo(title,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1});

        const createTimeline = () => {
          
          gsap.fromTo(details,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, delay: delay-1})
          gsap.fromTo(navs,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, delay: delay-1})
          gsap.fromTo(btn,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, delay: delay-1, onComplete: () => {
            if (this.index >= videoScreens.length - 1) {
              this.isAll = true
            }
            done()
          }})
        }
        
      },
  
      slideLeave(el,done) {
        const titles = el.querySelector('.productions-screen-titles')
        const details = el.querySelector('.productions-screen-details')
        const tl = gsap.timeline()
        tl.to(titles,{opacity: 0, y: -50, duration: 1})
          .to(details,{opacity: 0, y: -50, duration: 1, onStart: () => {
          if (this.index === videoScreens.length - 2) {
            this.isAll = false
          }
        }, onComplete: done}, '>-0.7');

        gsap.to(el.querySelector('.productions-screen-img'),{opacity: 0, duration: 0.5})
      },

      wheel(event) {
        let delta = event.deltaY;
        
        if (delta > 0) {
          return this.setScreen('down', event)
        } 
        this.setScreen('up',event)
      },

      setScreen(direction,event) {
        if (!this.isAll && D.querySelector('.wheel-screens').getBoundingClientRect().top === 0) {
          event.preventDefault()
        }

        if (this.isAnimating || D.querySelector('.wheel-screens').getBoundingClientRect().top !== 0) {
          return;
        }
        
        if (direction === 'down') {

          if (this.activeScreen === 1 && this.index < videoScreens.length - 1) {
            this.index = (this.index < videoScreens.length - 1)
              ? ++this.index
              : videoScreens.length - 1
          } else {
            this.activeScreen = (this.activeScreen >= 1)
              ? 1
              : ++this.activeScreen
          }

        } else {
          
          if (this.activeScreen === 1 && this.index > 0) {
            this.index = (this.index === 0)
              ? 0
              : --this.index
          } else {
            this.activeScreen = (this.activeScreen <= 0) 
              ? 0
              : --this.activeScreen
          }
          
        }
      },

      toSlide(index) {
        this.activeScreen = index
      },

      screenHeights() {
        const screens = D.querySelectorAll('.productions-screen')
        if (!screens.length) return

        screens.forEach(el => {
          const bg = el.querySelector('.productions-screen-bg')
          bg.style.height = el.clientHeight+'px'
        })
      },

      parralax(event) {
        const screens = D.querySelectorAll('.productions-screen')
        if (!screens.length) return
        const margin = FARBA.WW < 600 ? 48 : 62
        const sy = window.pageYOffset

        gsap.utils.toArray(screens).forEach(screen => {
          const img = screen.querySelector('.productions-screen-bg')
          const box = screen.getBoundingClientRect()
          
          // if (sy > box.top + sy - margin && sy < box.bottom + sy  - FARBA.WH) {
          if (sy > box.top + sy - margin && sy < box.bottom + sy  - margin) {
            screen.classList.add('active')
          } else {
            screen.classList.remove('active')
          }
        });

        // const hm = FARBA.WH - margin
        // const obs = new IntersectionObserver((entries)=>{
        //   entries.forEach((entry) => {
        //     const {intersectionRatio, target, isIntersecting} = entry
        //     if (isIntersecting) {
        //       console.log('in', target)
        //       target.classList.add('active');
        //     } else {
        //       console.log('out')
        //       target.classList.remove('active');
        //     }
        //   })
        // },{
        //   rootMargin: `0px 0px -${hm}px 0px`,
        //   threshold: 0,
        // })

        // screens.forEach(el => obs.observe(el))
        // this.scrollPos = sy
      },

      mediaHandler() {
        const sc959 = window.matchMedia("(max-width:959px)");
      
        const changes = (sc959) => {
          if (sc959.matches) {
            this.isMobile = true

            setTimeout(()=>{
              D.querySelector('.wheel-screens').removeEventListener('wheel',this.wheel)
              window.addEventListener('scroll',this.parralax)
              // window.addEventListener('load',this.parralax)
              

              window.addEventListener('resize',this.screenHeights,false)
              this.screenHeights()
            },1)

          } else {
            this.isMobile = false

            setTimeout(()=>{
              let Alltrigger = ScrollTrigger.getAll()
              for (let i = 0; i < Alltrigger.length; i++) {
                Alltrigger[i].kill(true)
              }

              D.querySelector('.wheel-screens').addEventListener('wheel',this.wheel)
              window.removeEventListener('scroll',this.parralax)
              window.removeEventListener('resize',this.screenHeights,false)
            },1)
            
          }
        }

        sc959.addListener(changes);
        changes(sc959);
      }
    },

    watch: {
      index: function (val) {
        this.isAnimating = true
      },
      activeScreen: function (val) {
        this.isAnimating = true
      }
    },

    mounted() {
      this.mediaHandler()
    }
  })
}
wheelProductionsTK()


function animateCompany() {
  if (!D.querySelector('.company-pos')) return


  const tlh = gsap.timeline({
    scrollTrigger: {
      trigger: '.company-pos',
      start: 'top 100%',
      end: "+=100%",
      scrub: true
    }
  })
  tlh
    .to('.first-screen',{yPercent: 50, ease: 'none'}, 0)


  const cpTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.company-pos-top-num',
      start: 'top 70%',
      end: 160,
      scrub: 5
    }
  })
  cpTL
    .from('.company-pos-top-num',{xPercent: -20, opacity: 0, duration: 0.71})
    .from('.company-pos-top-subtitle',{opacity: 0, y: -50, duration: 0.44}, '-=0.37');

  const cpmTL = gsap.timeline({
    scrollTrigger: {
      trigger: '.company-pos-middle',
      start: 'top 70%',
      end: 300,
      scrub: 5
    }
  })
  cpmTL
    .from('.company-pos-middle-top',{opacity: 0, y: 100, duration: 0.8})
    .from('.company-pos-middle-txt',{opacity: 0, y: 200, duration: 0.6})
    .from('.company-pos-bottom-digit',{opacity: 0, y: 200, duration: 1}, '-=0.6')
    .from('.company-pos-bottom-subtitle',{opacity: 0, y: 20, duration: 0.8}, '-=0.3');


  
  gsap.utils.toArray('.company-purpose-item').forEach((item)=>{
    const tls = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 60%',
        end: 400,
        scrub: 5
      }
    })
    tls
      .from(item.querySelector('.company-purpose-item-title'),{opacity: 0, yPercent: -15, duration: 1})
      .from(item.querySelector('.company-purpose-item-text'),{opacity: 0, yPercent: -30, duration: 1}, '-=0.5');
  })
}
// animateCompany()


window.addEventListener('load',()=>{
  animateEnterprises()
  // animateProductionsNoTk()
  
});



//node slider
(function () {
  const toggler = document.querySelectorAll(".node-slider");
  if (!toggler.length) return;

  toggler.forEach((el, index) => {
    const slider = el.querySelector(".ui-swiper");
    const prevArrow = el.querySelector(".swiper-button-prev");
    const nextArrow = el.querySelector(".swiper-button-next");

    const ds = `ui-swiper-${index}`;
    slider.classList.add(ds);

    slider.querySelectorAll('.ui-swiper-slide-img').forEach(el => {
      el.removeAttribute('loading')
      el.classList.add('swiper-lazy')
    })

    prevArrow.classList.add(`swiper-button-prev-${index}`);
    nextArrow.classList.add(`swiper-button-next-${index}`);

    const descr = D.createElement('div')
    descr.className = 'ui-swiper-slide-subtitle node-slider-descr'
    descr.textContent = el.querySelector('.ui-swiper-slide-subtitle').textContent
    el.appendChild(descr)

    const pgn = el.querySelector('.swiper-pagination')
    el.appendChild(pgn)

    const swiper = new Swiper(`.${ds}`, {
      autoHeight: true,
      loop: true,
      speed: 1000,
      shortSwipes: true,
      lazy: true,
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
          translate: ["-100%", 0, 1],
        },
        next: {
          translate: ["75%", 0, -1],
        },
      },
      breakpoints: {
        960: {
          shortSwipes: false,
        }
      },
      on: {
        slideChangeTransitionEnd: function () {
          if (!el.querySelector('.swiper-slide-active .ui-swiper-slide-subtitle')) return
          const text = el.querySelector('.swiper-slide-active .ui-swiper-slide-subtitle').textContent || ''
          el.querySelector('.node-slider-descr').textContent = text
        }
      }
    });

    slider.querySelectorAll('.ui-swiper-slide-img').forEach((item,index) => {
      item.addEventListener('click',() => {
        let event = new Event("click")
        nextArrow.dispatchEvent(event)
      })

      item.addEventListener('load', () => {
        swiper.update()
      })
      
    })
  });
})();


(function () {
  const target = D.querySelectorAll('.node-inner img, .node img')
  if (!target.length) return
  const parents = ['.swiper', '.ui-video', '.ui-share', 'figure']

  target.forEach(el => {
    let isParent = false;
    for (let parent of parents) {
      if (el.closest(parent)) {
        isParent = true
      }
    }
    if (!isParent) {
      const figure = D.createElement('figure')
      const caption = D.createElement('figcaption')
      const title = el.getAttribute('alt') || el.getAttribute('title') || ''
      caption.textContent = title
      el.insertAdjacentElement('afterend',figure)

      figure.appendChild(el)
      if (title && title != '') {
        figure.appendChild(caption)
      }
    }
  })

  D.querySelectorAll('.node figure', '.node-inner figure').forEach(el => {
    if (!el.querySelector('figcaption') && (el.querySelector('img').hasAttribute('alt') || el.querySelector('img').hasAttribute('title'))) {
      const caption = D.createElement('figcaption')
      const title = el.querySelector('img').getAttribute('alt') || el.querySelector('img').getAttribute('title') || ''
      caption.textContent = title
      el.appendChild(caption)
    }
  })
})();


(function () {
  const lists = D.querySelectorAll('.node-inner ul, .node ul, .node-inner ol, .node ol')
  if (!lists.length) return;
  const listParents = ['.swiper', '.ui-video', '.ui-share', 'figure', '.ui-tags']
  
  lists.forEach(el => {
    let isParent = false;
    for (let parent of listParents) {
      if (el.closest(parent)) {
        isParent = true
      }
    }
    if (!isParent) {
      el.classList.add('ui-marked')
    }
  })
})();


// Enterprises.html Слайдер для дипломов
const entSwiper = new Swiper(".enterprises-swipper", {
  loop: true,
  slidesPerView: 2,
  autoHeight: true,
  shortSwipes: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    960: {
      shortSwipes: false,
    }
  }
});



const btnTitle = document.querySelectorAll(".contacts-tab-toggle");
const btnContant = document.querySelectorAll(".contacts-tab-contant");

for (var i = 0; i < btnTitle.length; i++) {
  btnTitle[i].addEventListener("click", funOpen);
}
function funOpen(e) {
  for (let i = 0; i < btnTitle.length; i++) {
    btnTitle[i].classList.remove("contacts-tab-toggle-active");
    gsap.to(btnContant[i],{height: 0,duration: 0.4,onComplete: ()=> {
      btnContant[i].classList.remove("contacts-tab-contant-active")
    }})

    if (btnTitle[i] == e.currentTarget) {
      btnTitle[i].classList.add('contacts-tab-toggle-active');
      setTimeout(()=>{
        btnContant[i].classList.add("contacts-tab-contant-active");
        gsap.fromTo(btnContant[i],{height: 0},{height: 'auto',duration: 0.4})
      },430)
    }
  }

  //анимируем высоту родителя
  setTimeout(()=>{
    const height = D.querySelector('.contacts-tab.selected').clientHeight
    gsap.to('.ux-tabs-content-parent',{minHeight: height, duration: 1, overwrite: true})
  },831)
}
if (document.querySelector('.contacts-tab-toggle')) {
  // let event = new Event("click")
  // document.querySelector('.contacts-tab-toggle').dispatchEvent(event)
  D.querySelector('.contacts-tab-contant').classList.add('contacts-tab-contant-active')
  D.querySelector('.contacts-tab-toggle').classList.add('contacts-tab-toggle-active')
}

if (document.querySelector('.contacts') && document.querySelector('.page-buttons')) {
  document.querySelector('.page-buttons').classList.add('page-buttons-contacts')
  document.querySelector('.contacts').closest('.row').classList.add('contacts-row')
}


//карта для контактов
function initYandexMap() {
  let myOptions = {
    center: [55.63393951216643, 37.44033897875346],
    zoom: 12,
  };

  let zoomUp = document.querySelector(".map-zoom-up");
  let zoomIn = document.querySelector(".map-zoom-in");

  zoomUp.addEventListener("click", function () {
    map.setZoom(myOptions.zoom - 1, { duration: 300 });
    myOptions.zoom -= 1;
  });
  zoomIn.addEventListener("click", function () {
    map.setZoom(myOptions.zoom + 1, { duration: 300 });
    myOptions.zoom += 1;
  });

  let map = new ymaps.Map("contacts-map", myOptions);

  //отрубаем скролл карты мышью
  map.behaviors.disable('scrollZoom');

  map.container.events.add('fullscreenenter', function(){
    map.behaviors.enable(['scrollZoom']);
  });
  map.container.events.add('fullscreenexit', function(){
    map.behaviors.disable(['scrollZoom']);
  });

  function open() {
    let fullscreenControl = new ymaps.control.FullscreenControl();
    map.controls.add(fullscreenControl);
    fullscreenControl.enterFullscreen();
  }
  
  var fullscreenControl = new ymaps.control.FullscreenControl();
  map.controls.add(fullscreenControl);
  let isFull = false;
  let fullScrean = document.querySelector(".map-subtract");

  fullScrean.addEventListener("click", function () {
    isFull = !isFull;
    if (isFull == false) {
      fullscreenControl.exitFullscreen();
      document.querySelectorAll(".map-control").forEach(el => el.classList.remove("map-fullscreen"))
      document.querySelector(".contacts-row").classList.remove("map-fullscreen")
    } else {
      fullscreenControl.enterFullscreen();
      document.querySelectorAll(".map-control").forEach(el => el.classList.add("map-fullscreen"))
      document.querySelector(".contacts-row").classList.add("map-fullscreen")
    }
  });

  const links = document.querySelectorAll(".ux-map-to");


  for (i = 0; i < links.length; ++i) {
    let lat = links[i].dataset.coordinates.split(',')[0]
    let lng = links[i].dataset.coordinates.split(',')[1]

    let place = new ymaps.Placemark(
      [lat,lng],
      {},
      {
        iconLayout: "default#image",
        iconImageHref: "images/svg/map-market.svg",
        iconImageSize: [41, 53],
      }
    );
    map.geoObjects.add(place);
  }

  
  links.forEach((element) => {
    element.addEventListener("click", function () {
      cordsStr = element.dataset.coordinates;
      num1 = Number(cordsStr.split(",")[0]);
      num2 = Number(cordsStr.split(",")[1]);

      map.panTo([num1, num2], { flying: true, duration: 1500 });
    });
  });


  if (location.hash && location.hash !== '') {
    const current = D.querySelector('.ux-map-to[href="'+location.hash+'"]')
    if (current) {
      const cordsStr = current.dataset.coordinates;
      const num1 = Number(cordsStr.split(",")[0]);
      const num2 = Number(cordsStr.split(",")[1]);

      map.panTo([num1, num2], { flying: true, duration: 500 });
    }

    setTimeout(()=>{
      const height = D.querySelector('.contacts-tab.selected').clientHeight
      // console.log(height)
      gsap.to('.ux-tabs-content-parent',{minHeight: height, duration: 1, overwrite: true})
    },500)
    
  }
}

if (document.querySelector('.contacts-map')) {
  FARBA.lazyLibraryLoad("//api-maps.yandex.ru/2.1/?lang=ru_RU", "", () => {
    ymaps.ready(initYandexMap);
  });
}


if (document.querySelector('.scientific-cardboard-img')) {
  let html = document.querySelector('.scientific-cardboard-img').innerHTML
  document.querySelector('.scientific-cardboard-img').insertAdjacentHTML('beforeend',html)
  document.querySelectorAll('.scientific-cardboard-img img')[1].classList.add('scientific-cardboard-shadow')
}




// preloader
function prloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  preloader.classList.add('loaded');
  setTimeout(()=>{
    if(!D.querySelector('#header').hasAttribute('style') && window.scrollY < 50) {
      gsap.from('#header',{opacity: 0, yPercent: -100, duration: 0.4, onComplete: FARBA.clearStyles, onCompleteParams: ['#header']})
    }
  },150)
  setTimeout(()=>{
    preloader.remove()
    // preloader.style.display = 'none'
  },651)
}

setTimeout(()=>{prloader()},30000)
window.addEventListener('load', prloader);


// popup cookie
(function (){
  const popUp = document.getElementById("popup-cookie");
  const btnAcceptCookie = document.getElementById("popup-cookie-accept");
  if (!popUp || !btnAcceptCookie) return;


  btnAcceptCookie.addEventListener("click", () => {
    localStorage.setItem('cookiePopup','y')
  
    popUp.classList.add("confirmed");
    setTimeout(()=>{
      popUp.remove()
    },401);
  });

  if (localStorage.getItem('cookiePopup') && localStorage.getItem('cookiePopup') === 'y') {
    popUp.remove()
  }
})();


if (document.querySelector(".page-error")) {
  document.querySelector("#footer").classList.add("ui-hidden");
}


;(function(){
  if (!D.querySelector('.swiper')) return

  const bg = D.querySelectorAll('[class*="ui-bg-light"]')
  bg.forEach(el => {
    const btns = el.querySelectorAll('.swiper-button-white')
    btns.forEach(item => item.classList.remove('swiper-button-white'))
  })
})();


let toFlyAnim = `
  .ui-side-title,
  .ui-subtitle,
  .col-layout-thin:not(:empty, .col-layout-thin-footer),
  .col-layout-wide:not(.col-layout-wide-footer),
  .gallery-title,
  .gallery-img,
  .news-grid,
  .to-all-news,
  .analytics-item,
  .ui-chart-block,
  .docs-card,
  .cert-item,
  .page-title,
  .node-title,
  .publication-preview,
  .main-partner-item,
  .main-block-title,
  .publication-item,
  .productions-mk-descr,
  .productions-mk-for,
  .museum-review,
  .page-buttons-contacts,
  .enterprises-sort-adaptive-link,
  footer .container .row,
  .mobile-activities-flip,
  .mobile-activities-data,
  .mobile-activities-txt`;
if (FARBA.WW < 960) {
  toFlyAnim += `,
  .main-entrs-in-title,
  .main-entrs-in-links,
  .main-entrs-descr,
  .main-entrs-vntgs`;
}
const toFlyAnimDelay = `
  .node-body .container,
  .page > .row
`;
D.querySelectorAll(toFlyAnim).forEach(el => {if (!(el).classList.contains('not-anim')) {el.classList.add('anim-fly')}});

const toFlyAnimDelayLength = D.querySelectorAll(toFlyAnimDelay).length

function flyAnimations(selectors = '.anim-fly', offset = 0.9) {
  let toBottom = 0.95
  let targetOffset = FARBA.WH * offset
  const pageOffset = window.pageYOffset
    
  if (D.documentElement.clientWidth < 960) {
    targetOffset = FARBA.WH + 10
    toBottom = 0.99
  }
  D.querySelectorAll(selectors).forEach(el => {
    const boxTop = parseInt(el.getBoundingClientRect().top,10);
    
    if (boxTop + pageOffset - targetOffset < pageOffset || pageOffset >= (document.documentElement.scrollHeight - FARBA.WH) * toBottom) {
      el.classList.add('visible')
      if (el.classList.contains('anim-once')) {
        setTimeout(() => {el.classList.remove('anim-fly')},801);
      }
    } else {
      el.classList.remove('visible')
    }
  })
}

window.addEventListener('load',() => {
  FARBA.WH = window.innerHeight
  FARBA.WW = document.documentElement.clientWidth
  
  setTimeout(()=>{
    flyAnimations('.anim-fly')
    flyAnimations('.anim-fly-upper',0.7)

    if (toFlyAnimDelayLength) {
      D.querySelectorAll(toFlyAnimDelay).forEach(el => {
        if (el.getBoundingClientRect().top + window.pageYOffset - FARBA.WH * 0.9 < window.scrollY || window.scrollY >= (document.documentElement.scrollHeight - FARBA.WH) * 0.95) {
          setTimeout(()=>{el.classList.add('visible')},300)
        } 
        // else {
        //   el.classList.remove('visible')
        // }
      })
    }
  },530)
})

window.addEventListener('resize',() => {
  FARBA.WH = window.innerHeight
  FARBA.WW = document.documentElement.clientWidth
})


window.addEventListener('scroll',() => {
  flyAnimations('.anim-fly')
  flyAnimations('.anim-fly-upper',0.7)

  if (toFlyAnimDelayLength) {
    D.querySelectorAll(toFlyAnimDelay).forEach(el => {
      if (el.getBoundingClientRect().top + window.pageYOffset - (FARBA.WH * 0.9) < window.scrollY || window.scrollY >= (document.documentElement.scrollHeight - FARBA.WH) * 0.95) {
        setTimeout(()=>{el.classList.add('visible')},300)
      } else {
        el.classList.remove('visible')
      }
    })
  }
},supportsPassive ? { passive: true } : false)


D.querySelectorAll('[class*=ui-bg-] .node-slider-btns').forEach((el)=>{
  el.classList.remove('museum-slider-btns');
})


//responsive hacks
;(function(){
  const tbls = D.querySelectorAll('.ui-table, .node-inner table');
  if (!tbls.length) return;
  tbls.forEach(el => {
    const wrp = D.createElement('div')
    wrp.className = 'ui-table-overflow'
    el.insertAdjacentElement('afterend',wrp)
    wrp.appendChild(el)
  })

})();

;(function() {
  const tomap = D.querySelectorAll('.contacts-tomobile-link');
  const zoom = D.querySelector('.map-subtract')
  if (!tomap.length || !zoom) return

  let evt = new Event('click', {cancelable: true})

  tomap.forEach(el => {
    el.addEventListener('click',(e) => {
      e = event || window.event;
      e.preventDefault();
      
      zoom.dispatchEvent(evt)
    })
  })
})();


;(function(){
  const links = D.querySelectorAll('.contacts-tab-toggle')
  if (!links.length) return

  const tabs = D.createElement('div')
  tabs.className = 'contacts-horizontal-tabs'
  links[0].closest('.ui-tabs-content').querySelector('.contacts-tab-title').insertAdjacentElement('afterend',tabs)

  let evt = new Event('click', {cancelable: true})

  links.forEach((el,index) => {
    const link = D.createElement('a')
    link.classList.add('contacts-horizontal-tab')
    if (index === 0) {
      link.classList.add('active')
    }
    link.textContent = el.textContent
    const span = D.createElement('span')
    span.className = 'contacts-horizontal-tab-span'
    span.appendChild(link)
    tabs.appendChild(span)

    link.addEventListener('click',(e) => {
      e = event || window.event;
      e.preventDefault();

      D.querySelectorAll('.contacts-horizontal-tab').forEach(item => item.classList.remove('active'))
      link.classList.add('active')
      el.dispatchEvent(evt)
    })
  })
})();


(function(){
  const links = D.querySelectorAll('.fs-menu-title-toggler')
  if (!links.length) return

  let isAnim = false

  function handler(e) {
    e = e || window.event
    e.preventDefault()
    // let isAnim = false
    // const ww = D.documentElement.clientWidth
    if (FARBA.WW >= 960) return

    for (let i = 0; i < links.length; i++) {
      const body = links[i].nextElementSibling
      
      if (isAnim) {break}

      if (links[i] == e.currentTarget) {
        if (!links[i].classList.contains('opened')) {
          links[i].classList.add('opened');
          body.classList.add("opened");
          gsap.fromTo(body,{height: 0},{height: 'auto',duration: 0.4,
          onStart: () => {isAnim = true},
          onComlete: () => {isAnim = false}
        })

        } else {

          links[i].classList.remove("opened");
          gsap.to(body,{height: 0,duration: 0.4,
            onStart: () => {isAnim = true},
            onComplete: ()=> {
              body.classList.remove("opened")
              isAnim = false
            }
          })
        }

      } else {
        links[i].classList.remove("opened");
        gsap.to(body,{height: 0,duration: 0.4,
          onStart: () => {isAnim = true},
          onComplete: ()=> {
            body.classList.remove("opened")
            isAnim = false
          }
        })
      }
    }
  }

  links.forEach(el => el.addEventListener('click',handler));
})();



(function(){
  const productions = D.querySelector('.fs-menu .fs-menu-productions')
  if (!productions) return

  if (matchMedia) {
    var sc959 = window.matchMedia("(max-width:959px)");
    sc959.addListener(changes);
    changes(sc959);
  }
  
  function changes(sc959) {
    if (sc959.matches) {
      D.querySelector('.fs-menu-links .fs-menu-col').after(productions)
    } else {
      if (D.querySelector('.fs-menu-links .fs-menu-productions')) {
        D.querySelector('.fs-menu .container').prepend(D.querySelector('.fs-menu-links .fs-menu-productions'))
      }
    }
  }
})();


function fixProductionPosition () {
  const img = D.querySelector('.productions-head-img')
  if (!img) return

  const wrp = img.closest('.productions-head-img-wrp')
  if (img.clientHeight > wrp.clientHeight) {
    img.classList.add('align-top')
  } else {
    img.classList.remove('align-top')
  }
}
fixProductionPosition();
window.onload = fixProductionPosition;
window.onresize = fixProductionPosition;


;(function(){
  const links = D.querySelectorAll('.tk-subtype-title')
  if (!links.length) return

  let isAnim = false

  function fixParentHeight(el) {
    const parent = el.closest('.ux-tabs-content-parent')
    if (!parent) {
      isAnim = false
      return
    }
    const child = parent.querySelector('.selected')
    if (!child) {
      isAnim = false
      return
    }
    const h = child.scrollHeight
    gsap.to(parent,{height: h, duration: 0.2})
    isAnim = false
  }

  function handler(e) {
    e = e || window.event
    e.preventDefault()
    if (FARBA.WW >= 960) return
    // let isAnim = false

    // isAnim = true
    for (let i = 0; i < links.length; i++) {
      const body = links[i].nextElementSibling
      if (isAnim) {break}

      if (links[i] == e.currentTarget) {
        if (!links[i].classList.contains('opened')) {
            links[i].classList.add('opened');
            body.classList.add("opened");
            gsap.fromTo(body,{height: 0},{height: 'auto',duration: 0.4,
            onStart: () => {isAnim = true},
            onComplete: () => {
              fixParentHeight(links[i])
            }})
          

        } else {
         
            links[i].classList.remove("opened");
            gsap.to(body,{height: 0,duration: 0.4,
            onStart: () => {isAnim = true},
            onComplete: ()=> {
              body.classList.remove("opened")
              fixParentHeight(links[i])
            }})
         
        }

      } else {
        
          links[i].classList.remove("opened");
          gsap.to(body,{height: 0,duration: 0.4,
          onStart: () => {isAnim = true},
          onComplete: ()=> {
            body.classList.remove("opened")
            fixParentHeight(links[i])
          }})
        
        
      }
    }
  }

  links.forEach(el => el.addEventListener('click',handler));
})();

//vh fix
function vhFix() {
  let ornt = window.innerWidth > window.innerHeight ? 'land' : 'port'
  let prev = window.innerHeight;
  let vh = prev * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('load', () => {
    setTimeout(()=>{
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },1)
  });

  window.addEventListener('resize', () => {
    let current = window.innerWidth > window.innerHeight ? 'land' : 'port'
    if (ornt !== current) {
      console.log('rotate');
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      ornt = current
    }
    // let h = window.innerHeight;
    // if (h > prev + (prev / 100 * 16) || h < prev - (prev / 100 * 16)) {
    //   console.log('resize');
    //   let vh = h * 0.01;
    //   document.documentElement.style.setProperty('--vh', `${vh}px`);
    //   prev = h
    // }
  });
}
vhFix();

if (FARBA.isTouch) {
  D.documentElement.classList.add('ui-touchscreen')
}


;(function(){
  const tabLinks = D.querySelectorAll('.enterprises-contact-tab');
  if (!tabLinks.length) return

  let prev = 'auto'

  // let parent = D.createElement('div');
  // parent.className = 'enterprises-contact-parent'
  let contentDivs = new Array();

  tabLinks.forEach((element) => {
    let id = getHash(element.getAttribute("href"));

    contentDivs.push(document.getElementById(id));

    element.addEventListener('click', showTab.bind(null,id,element))
  });

  tabLinks[0].classList.add("selected");
  contentDivs[0].classList.add("selected");
  
  // contentDivs[0].insertAdjacentElement('beforebegin',parent)
  // parent.append(...D.querySelectorAll('.enterprises-contact-body'))

  //functions
  function showTab(id,element,event) {
    if (event) {
      event = event || window.event;
      event.preventDefault()
    }
    
    for (let i = 0; i < contentDivs.length; i++) {
      let divID = contentDivs[i].getAttribute("id")
      if (divID === id) {

        tabLinks[i].classList.add("selected");
        contentDivs[i].classList.remove("leave");
        setTimeout(()=>{
          contentDivs[i].classList.add("selected","enter");
          correctHeight(contentDivs[i])
        },151)
        setTimeout(()=>{
          contentDivs[i].classList.remove("enter");
        },300)

      } else {

        tabLinks[i].classList.remove("selected");
        contentDivs[i].classList.add("leave");
        contentDivs[i].classList.remove("enter");
        setTimeout(()=>{
          contentDivs[i].classList.remove("selected");
        },151)
      }
    }
  }

  function getHash(url) {
    var hashPos = url.lastIndexOf("#");
    return url.substring(hashPos + 1);
  }

  function correctHeight(currentTab) {
    const nearParent = currentTab.closest('.row')
    const allParent = currentTab.closest('.ux-tabs-content-parent')
    if (!nearParent) return

    const height = currentTab.scrollHeight
    gsap.fromTo(nearParent,
      {height: prev},
      {height: height, duration: 1, overwrite: true, onComplete: () => {
      setTimeout(()=> {
        nearParent.style.minHeight = height + 'px'
        nearParent.style.height = ''
        prev = height
        if (allParent) {
          allParent.style.height = ''
        }
      },1)
    }, onStart: () => {
      nearParent.style.minHeight = ''
    }})

  }
})();


(function(){
  const tags = D.querySelector('.ui-tags-news')
  const toggler = D.querySelector('.ui-tags-news-topopup')
  if (!tags || !toggler) return

  const copy = tags.cloneNode(true);
  copy.classList.add('popup-tags')
  copy.classList.remove('ui-tags-news')

  copy.querySelector('.ui-tags-more').remove()
  copy.querySelector('.ui-tags-news-topopup').remove()
  copy.querySelector('.ui-tags-list').classList.add('popup-tags-list')
  copy.querySelector('.ui-tags-list').classList.remove('ui-tags-list')
  copy.querySelectorAll('li').forEach(el => {
    el.classList.remove('hide-item')
    el.removeAttribute('style')
  })

  const popupCloser = D.createElement('div')
  popupCloser.className = 'popup-tags-close'
  copy.appendChild(popupCloser)

  D.body.appendChild(copy)

  const handler = (action,event) => {
    event = event || window.event
    event.preventDefault()

    if (action === 'open') {
      copy.classList.add('opened');
      FARBA.removeScroll()
    } else {
      copy.classList.remove('opened');
      FARBA.addScroll()
    }
  }

  toggler.addEventListener('click',handler.bind(null,'open'))
  popupCloser.addEventListener('click',handler.bind(null,'close'))
  copy.querySelectorAll('a.ui-tags-link').forEach(el => {
    el.addEventListener('click',handler.bind(null,'close'))
  });
  
})(); 


FARBA.rebuildPager();