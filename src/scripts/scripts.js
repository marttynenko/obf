const FARBA = {
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
          target.scrollIntoView({
            behavior: "smooth"
          });
        })
      }
    })
  },

  tabs(selector) {
    var tabLinks = document.querySelectorAll(selector);
    if (!tabLinks.length) return;

    var contentDivs = new Array();

    tabLinks.forEach((element) => {
      var id = getHash(element.getAttribute("href"));
  
      contentDivs.push(document.getElementById(id));

      element.addEventListener('click', showTab.bind(null,id,element))
    });
  
    tabLinks[0].classList.add("selected");
    contentDivs[0].classList.add("selected");
  
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
          // tabLinks[i].classList.add("selected");
          // contentDivs[i].classList.add("selected");

          tabLinks[i].classList.add("selected");
          contentDivs[i].classList.remove("leave");
          setTimeout(()=>{
            contentDivs[i].classList.add("selected","enter");
          },151)
          setTimeout(()=>{
            contentDivs[i].classList.remove("enter");
          },200)
          
          if (id !== location.hash.substring(1)) {
            setHash(id)
          }
        } else {
          // tabLinks[i].classList.remove("selected");
          // contentDivs[i].classList.remove("selected");

          tabLinks[i].classList.remove("selected");
          contentDivs[i].classList.add("leave");
          contentDivs[i].classList.remove("enter");
          setTimeout(()=>{
            contentDivs[i].classList.remove("selected");
          },151)
        }
      }
    }

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
  }
}

gsap.registerPlugin(ScrollTrigger);

const D = document;


const Headers = {
  headerHeight: 0,
  targets: ['.museum','.first-screen','.history-header','.main-screen'],

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
    if (window.scrollY >= this.headerHeight) {
      return D
        .querySelector("#header")
        .classList.remove("header-transparent");
    }
    D.querySelector("#header").classList.add("header-transparent");
  },

  init () {
    D.querySelector(".wrapper").classList.add("no-gutters-top");
    D.querySelector("#header").classList.add("header-transparent");

    Headers.updateHeight();
    window.addEventListener("resize", this.updateHeight, false);
    window.addEventListener("scroll", this.scroll, false);
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
    this.classList.toggle("opened");
    target.classList.toggle("opened");
  });
})();


//анимируем fullscreen menu
function animateFSMenu(action) {
  const menu = D.querySelector(".fs-menu");
  const header = D.querySelector("#header");
  const toggler = D.querySelector(".menu-toggler-icon");
  const bg = D.querySelector(".fs-menu-bg");

  const ww = document.documentElement.clientWidth
  const scale = (ww / 44) * 2.25

  const coords = toggler.getBoundingClientRect()
  bg.style.left = coords.x + 'px'
  bg.style.top = coords.y + 'px'

  // header.classList.toggle("fs-opened");

  if (action === "open") {
    header.classList.add("fs-opened");
    menu.classList.add("opened");
    const tlStart = gsap.timeline({ autoRemoveChildren: true });
    tlStart
      .to(".fs-menu-bg", { scale: scale, duration: 0.35 })
      .fromTo(
        ".fs-menu-productions",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 }
      )
      .fromTo(
        ".fs-menu-links",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: -0.25 }
      )
      .fromTo(
        ".fs-menu-contacts-1",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: -0.25 }
      )
      .fromTo(
        ".fs-menu-contacts-2",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: -0.25 }
      );
  } else {
    const tlEnd = gsap.timeline({ autoRemoveChildren: true });
    tlEnd
      .to(".fs-menu-contacts-2", { y: 50, opacity: 0, duration: 0.3 })
      .to(".fs-menu-contacts-1", {
        y: 50,
        opacity: 0,
        duration: 0.3,
        delay: -0.15,
      })
      .to(".fs-menu-links", { y: 50, opacity: 0, duration: 0.3, delay: -0.15 })
      .to(".fs-menu-productions", {
        y: 5,
        opacity: 0,
        duration: 0.3,
        delay: -0.15,
      })
      .to(".fs-menu-bg", {
        scale: 1,
        duration: 0.25,
        onComplete: () => {
          menu.classList.remove("opened");
          header.classList.remove("fs-opened");
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
  const scale = (ww / 44) * 2.25

  const coords = toggler.getBoundingClientRect()
  bg.style.left = coords.x + 'px'
  bg.style.top = coords.y + 'px'

  if (action === "open") {
    header.classList.add("fs-opened","fs-search-opened");
    menu.classList.add("opened");
    const tlStart = gsap.timeline({ autoRemoveChildren: true });
    tlStart
      .to(bg, { scale: scale, duration: 0.45 })
      .fromTo('.fs-search-content', {opacity: 0, y: 50},{opacity: 1, y: 0, duration: 0.5})
      
  } else {
    const tlEnd = gsap.timeline({ autoRemoveChildren: true });
    tlEnd
      .to('.fs-search-content', {opacity: 0, y: 50, duration: 0.5})
      .to(bg, { scale: 1, duration: 0.45, onComplete: () => {
        menu.classList.remove("opened");
        header.classList.remove("fs-opened","fs-search-opened");
        if (document.querySelector('.fs-search-results')) {
          document.querySelector('.fs-search-results').classList.remove('opened')
        }
      }})
  }
}

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
    // this.oldScroll > this.scrollY
    //   ? target.classList.remove('not-fixed')
    //   : target.classList.add('not-fixed')

    this.oldScroll = this.scrollY;
  };
})();

// галлерея
(function () {
  const target = D.querySelectorAll(".ux-gallery");
  if (!target.length) return;

  const getSelectors = (parent,link) => {
    // const res = []
    parent.querySelectorAll(link).forEach(item => {
      if (!item.closest('.swiper-slide-duplicate')) {
        item.classList.add('ux-not-duplicate')
      }
    })
    // return res
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

  const clearHeader = () => {
    D.querySelector('#header').removeAttribute('style')
  }

  const tl = gsap.timeline(/*{ autoRemoveChildren: true }*/);
  tl
    .to({}, {}, 0.5)
    // .to(head, {zIndex: 2, duration: 0})
    .to('.productions-head-body', {opacity: 1, duration: 0})
    .fromTo('.productions-head-title',{opacity: 0, y: 70}, {opacity: 1, y: 0, duration: 1})
    .fromTo('.productions-head-descr',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1}, ">-0.5")
    .fromTo('.productions-head-arrow',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.5}, ">-0.35")
    .fromTo('.productions-head-img',{opacity: 0, yPercent: 25, scale: 0.95}, {opacity: 1, yPercent: 0, scale: 1, duration: 3, ease: "expo.out"}, ">-1")
    .fromTo('.productions-head-btn',{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1},">-2")
    .fromTo('#header',{opacity: 0, yPercent: -100}, {opacity: 1, yPercent: 0, duration: 0.5, onComplete: clearHeader},">-1")
}

const firstScreenAnimate = () => {
  const head = D.querySelector('.first-screen')
  if (!head) return;

  const clearHeader = () => {
    D.querySelector('#header').removeAttribute('style')
  }

  const tl = gsap.timeline(/*{ autoRemoveChildren: true }*/);
  tl
    .from({},{},0.1)
    .from('.first-screen-title',{opacity: 0, y: 30, duration: 0.8})
    .from('.first-screen-txt',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.first-screen-arrow',{opacity: 0, y: 30, duration: 0.8},'>-0.6')
    .from('.first-screen-right',{opacity: 0, y: 30, duration: 0.6},'>-0.6')
    .fromTo('#header',{opacity: 0, yPercent: -100}, {opacity: 1, yPercent: 0, duration: 0.4, onComplete: clearHeader},'-=1');
}

window.addEventListener('load',() => {
  prdHeadAnimate()
  firstScreenAnimate()
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


(function () {
  const toggler = document.querySelectorAll('.swiper-rewards-wrp')
  if (!toggler.length) return

  toggler.forEach((el,index) => {
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
      slidesPerView: 2,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow,
      }
    })
  })
  
})();


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

    const progress = D.createElement('div')
    progress.className = `ui-chart-bar-progress ui-bg-${color}`
    progress.style.height = (value / max * 100) + '%'

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
      timeout: 5
    },
    methods: {
      changeSlide(index) {
        this.index = index

        clearTimeout(this.timer)
        this.initTimer()

        //меняем статус анимации прогрессбара
        this.line.progress(index / this.slides)
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
        
        this.line.to(this.$refs.progress, {width: '100%',duration: duration, ease: 'none'})
      },

      slideEnter(el,done) {
        const tl = gsap.timeline({ autoRemoveChildren: true })
        tl
          .fromTo(el.querySelector('.main-slide-content'),{opacity: 0, x: -100},{opacity: 1, x: 0, duration: 0.35})
          .fromTo(el.querySelector('.main-slide-img'),{opacity: 0, xPercent: 15, scale: 0.95}, {opacity: 1, xPercent: 0, scale: 0.95, ease: "expo.out", duration: 0.35},'-=0.35')
          .to(el.querySelector('.main-slide-img'),{scale: 1, duration: 4.5, ease: "sine.out", onComplete: done})
      },
      slideLeave(el,done) {
        const tl = gsap.timeline({ autoRemoveChildren: true })
        tl
          .to(el.querySelector('.main-slide-img'),{opacity: 0, xPercent: -15, duration: 0.35})
          .to(el.querySelector('.main-slide-content'),{opacity: 0, x: 100, onComplete: done}, '-=0.35')
      },

      popupEnter(el,done) {
        const ww = document.documentElement.clientWidth
        const scale = (ww / 170) * 2.25
        const tl = gsap.timeline()
        tl
          .to(this.$refs.popupBg,{scale: scale, duration: 0.45})
          .fromTo(this.$refs.popupBody,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.5, onComplete: done})
      },

      popupLeave(el,done) {
        const tl = gsap.timeline()
        tl
          .to(this.$refs.popupBody, {opacity: 0, y: 50, duration: 0.4})
          .to(this.$refs.popupBg,{scale: 1, duration: 0.3, delay: -0.15, onComplete: done})
      },

      togglePopup() {
        this.getBgCoords()

        this.isPopup = !this.isPopup
      },

      getBgCoords() {
        const coords = this.$refs.popupToggler.getBoundingClientRect()
        this.bgCoords.x = coords.x
        this.bgCoords.y = coords.y
        // console.log(coords)
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
          .fromTo(img, {scale: 0.95}, {scale: 1, duration: 4.5, delay: 0.5})
          .fromTo(content,{opacity: 0, x: -75},{opacity: 1, x: 0, duration: 0.35}, '-=4.5')
          .from(newsLink, {x: 40, opacity: 0, duration: 0.35}, '-=4.5')
          .from(actualLink, {x: 75, opacity: 0, duration: 0.35}, '-=4.25')
          .fromTo('#header',{opacity: 0, yPercent: -100},{opacity: 1, yPercent: 0, duration: 0.4, onComplete: clearHeader}, '-=3.85')
          .fromTo('.main-slides-nav',{opacity: 0, yPercent: 100},{opacity: 1, yPercent: 0, duration: 0.4}, '-=3.45')
      }
    },

    created() {
      window.addEventListener('load',()=>{
        this.appearAnimation()
      })
    },

    mounted() {
      this.initTimer()
      this.initProgress()
    }
  })
}
mainScreen()


const mainActivities = () => {
  if (!D.querySelector('#main-activities')) return;

  return new Vue({
    el: '#main-activities',
    data: {
      index: 0
    },
    methods: {
      changeTab(index) {
        this.index = index
      },

      descrEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, y: 25},{opacity: 1, y: 0, duration: 0.49, delay: 0.2, onComplete: done})
      },
      descrLeave(el,done) {
        gsap.to(el,{opacity: 0, y: 25, duration: 0.25, onComplete: done})
      },

      tabEnter(el,done) {
        // gsap.fromTo(el,{opacity: 0, x: 50},{opacity: 1, x: 0, duration: 0.5, onComplete: done})
        const img = el.querySelector('.main-activities-img')
        const sight = el.querySelector('.main-activities-sights')
        const tl = gsap.timeline()
        tl.fromTo(img,{opacity: 0, x: 50},{opacity: 1, x: 0, duration: 0.5})
          .fromTo(sight,{opacity: 0, x: 50},{opacity: 1, x: 0, duration: 0.5, onComplete: done}, '-=0.5')
      },
      tabLeave(el,done) {
        // gsap.to(el,{opacity: 0, x: 50, duration: 0.25, onComplete: done})
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
            // end: "+=300",
            end: '+=40%',
            scrub: 2,
            // markers: true,
            // toggleActions: 'play pause resume none'
          }
        })
      
        tls.from('.main-activities .main-block-title',{opacity: 0, y: 50, duration: 0.5})
          .from('.main-activities-img',{opacity: 0, y: 50, duration: 0.5}, '>-0.2')
          .from('.main-activities-sights',{opacity: 0, y: 50, duration: 0.5}, '>-0.15')
          .from('.main-activities-nav',{opacity: 0, y: 50, duration: 0.5})
          .from('.main-activities-descrs',{opacity: 0, y: 30, duration: 0.5},'-=0.2')
      }
    },

    mounted() {
      this.scrollAnim()
    }
  })
}
mainActivities()


const mainEntrs = () => {
  if (!D.querySelector('#main-entrs')) return;

  console.log('#main-entrs')

  return new Vue({
    el: '#main-entrs',
    data: {
      index: 0
    },
    methods: {
      changeSlide(index) {
        this.index = index
      },

      titleEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, x: -50},{opacity: 1, x: 0, duration: 0.3, onComplete: done})
      },

      titleLeave(el, done) {
        gsap.to(el,{opacity: 0, x: 50, duration: 0.4, onComplete: done})
      },

      bodyEnter(el,done) {
        gsap.fromTo(el,{opacity: 0, x: -25},{opacity: 1, x: 0, duration: 0.4, onComplete: done})
      },

      bodyLeave(el,done) {
        gsap.to(el,{opacity: 0, x: 25, duration: 0.58, onComplete: done})
      },

      imgEnter(el,done) {
        const img = el.querySelector('.main-entrs-img')
        const btn = el.querySelector('.ui-btn-circle')
        const tl = gsap.timeline()

        tl.fromTo(img,{opacity: 0, x: 50},{opacity: 1, x: 0, duration:0.8})
          .fromTo(btn,{opacity: 0, x: 30},{opacity: 1, x: 0, duration: 0.4}, '-=0.3')
      },

      imgLeave(el, done) {
        gsap.to(el,{opacity: 0, x: 50, duration: 0.5, onComplete: done})
      },

      scrollAnim() {
        const tl = gsap.timeline({
          overwrite: "auto",
          // autoRemoveChildren: true,
          scrollTrigger: {
            trigger: '#main-entrs',
            start: "top 60%",
            end: "+=40%",
            scrub: 2, 
            // markers: true,
            // toggleActions: 'play pause resume none'
          }
        })
      
        tl.from('.main-entrs-title',{opacity: 0, y: 50, duration: 0.5})
          .from('.main-entrs-nav',{opacity: 0, y: 30, duration: 0.5}, '-=0.35')
          .from('.main-entrs-img',{opacity: 0, y: 120, duration: 0.5}, '-=0.35')
          .from('.main-entrs-imgs .ui-btn-circle',{opacity: 0, y: 50, duration: 0.5}, '-=0.1')
          .from('.main-entrs-descr',{opacity: 0, y: 30, duration: 0.5})
          
        gsap.utils.toArray('.main-entrs-vntg').forEach((el,index)=>{
          const delay = ((index + 1) % 2 === 0) ? 0.3 : 0
          tl.from(el,{opacity: 0, y: 30, duration: 0.3}, `-=${delay}`)
        })
      }
    },

    mounted() {
      this.scrollAnim()
    }
  })
}
mainEntrs();

//анимация массива элементов по скроллy для главной
function animArrayTrigger(arr,duration) {
  // if (!document.querySelector('#main-slides')) return
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


  const duration = 0.8
  D.querySelectorAll('.enterprises-block, .enterprises-contact, .node-related').forEach((item,index)=> {
    const title = item.querySelector('.ui-subtitle') || item.querySelector('.ui-side-title')
    const wide = item.querySelector('.col-layout-wide')
    const thin = item.querySelector('.col-layout-thin')

    if (title) {
      ScrollTrigger.create({
        trigger: title,
        onEnter: function() {
          animateFrom(title)
        }
      });
    }
    
    if (thin && thin.childNodes.length) {
      ScrollTrigger.create({
        trigger: thin,
        onEnter: function() {
          animateFrom(thin, 0.2)
        }
      });
    }
    
    if (wide) {
      ScrollTrigger.create({
        trigger: wide,
        onEnter: function() {
          animateFrom(wide,0.4)
        }
      });
    }
    

    function animateFrom (elem,delay = 0) {
      gsap.fromTo(elem, 
        {y: 50, opacity: 0},
        {y: 0, opacity: 1, duration: duration, delay: delay, overwrite: "auto"}
      )
    }
  })
}


//анимируем блоки на лендингах продукции
function animateProductions() {
  const duration = 0.8

  D.querySelectorAll('.productions-block:not(.productions-block-mk), .node-related').forEach((item,index)=> {
    const title = item.querySelector('.ui-side-title')
    const wide = item.querySelector('.col-layout-wide')
    const thin = item.querySelector('.col-layout-thin')

    if (title) {
      ScrollTrigger.create({
        trigger: title,
        onEnter: function() {
          animateFrom(title)
        }
      });
    }
    
    if (thin && thin.childNodes.length) {
      ScrollTrigger.create({
        trigger: thin,
        onEnter: function() {
          animateFrom(thin, 0.2)
        }
      });
    }
    
    if (wide) {
      ScrollTrigger.create({
        trigger: wide,
        onEnter: function() {
          animateFrom(wide,0.4)
        }
      });
    }
  })

  function animateFrom (elem,delay = 0) {
    gsap.fromTo(elem, 
      {y: 50, opacity: 0},
      {y: 0, opacity: 1, duration: duration, delay: delay, overwrite: "auto"}
    )
  }
}


//анимируем лендинги продукции
function animateProductionsNoTk() {
  if (!D.querySelector('.productions-block-mk')) return

  ScrollTrigger.create({
    trigger: '.productions-block-mk',
    start: 'top 90%',
    end: "+=100%",
    scrub: 1,
    onUpdate: (self) => {
      mkToUp(self.progress)
    },
    onEnter: () => {
      gsap.to(window, {duration: 1, scrollTo:{y: document.documentElement.clientHeight}});
    }
  });

  function mkToUp(progress) {
    const h = document.documentElement.clientHeight
    gsap.set('.productions-head',{y: progress * h * 0.85})
  }
  

  const duration = 0.8
  if (D.querySelector('.productions-block-mk')) {
    ScrollTrigger.create({
      trigger: '.productions-block-mk .ui-side-title',
      onEnter: function() {
        animateFrom('.productions-block-mk .ui-side-title', 0.8)
      }
    });
  
  
    ScrollTrigger.create({
      trigger: '.productions-mk-descr',
      onEnter: function() {
        animateFrom('.productions-mk-descr', 0.8)
      }
    });
  
    ScrollTrigger.create({
      trigger: '.productions-mk-for',
      onEnter: function() {
        animateFrom('.productions-mk-for', 0.5)
      }
    });
  }

  function animateFrom (elem,delay = 0) {
    gsap.fromTo(elem, 
      {y: 50, opacity: 0},
      {y: 0, opacity: 1, duration: duration, delay: delay, overwrite: "auto"}
    )
  }
}


//анимируем лендинг ТК
function animateProductionsTk() {
  const screens = D.querySelector('.productions-screens')
  if (!screens) return

  const screen = D.querySelectorAll('.productions-screen');
  

  const tk = new Vue({
    el: '.productions-screens',
    data: {
      index: 0,
      vd: 0,
      trigger: false
    },
    methods: {
      slideEnter(el,done) {
        const img = el.querySelector('.productions-screen-img')
        const title = el.querySelector('.productions-screen-title') || el.querySelector('h2')
        const details = el.querySelector('.productions-screen-details')
        const btn = el.querySelector('.ui-btn-circle')
  
      
        const tl = gsap.timeline()
        tl
          .to(el,{opacity: 1, duration: 0.1})
          .fromTo(title,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1})
          .fromTo(img,{opacity: 0, scale: 1.3}, {opacity: 1, scale: 1, duration: 3},">-1")
          .fromTo(details,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1},">-2")
          .fromTo(btn,{opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 1, onComplete: done},">-1")
      },
  
      slideLeave(el,done) {
        gsap.to(el,{opacity: 0, duration: 0.35, onComplete: done})
      },
  
      getIndex(slides, progress) {
        const step = 100 / slides
        const idx = parseInt((progress * 100) / step,10)
        if (idx >= slides) {
          return this.index = slides - 1
        }
        return this.index = idx
      },

      playPause(index) {
        const that = this
        const delay = (this.vd * 1000 / screen.length) * 0.99
        this.$refs.video.currentTime = this.vd * (1 / screen.length) * index
        this.$refs.video.play()
        setTimeout(function(){
          that.$refs.video.pause()
        },delay)
      }
    },

    watch: {
      index: function (val) {
        this.playPause(val)
      }
    },

    created() {
      window.addEventListener('loadedmetadata', (e) => {
        this.vd = this.$refs.video.duration
      }, true);
    },

    mounted() {
      ScrollTrigger.create({
        trigger: '.productions-screen',
        start: 'top 90%',
        end: "+=100%",
        onEnter: () => {
          gsap.to(window, {duration: 1, scrollTo:{y: document.documentElement.clientHeight}});
        }
      })

      ScrollTrigger.create({
        trigger: '.productions-screens',
        pin: true,
        // end: `+=${100*screen.length}%`,
        end: `+=${400*screen.length}`,
        onUpdate: (self) => {
          // const time = (this.vd * self.progress).toFixed(5)
          // console.log(time,this.vd)
          // this.$refs.video.currentTime = time
          this.getIndex(screen.length, self.progress)
        },
        onEnter: () => {
          this.playPause(0)
        }
      })

      ScrollTrigger.create({
        trigger: '.productions-tk-stock',
        end: "+=100%",
        scrub: 1,
        onUpdate: (self) => {
          mkToUp(self.progress)
        },
        onEnter: () => {
          gsap.to(window, {duration: 1, scrollTo:{y: window.scrollY + document.documentElement.clientHeight}});
        }
      });
    
      function mkToUp(progress) {
        const h = document.documentElement.clientHeight
        gsap.set('.productions-screen',{y: progress * h * 0.85})
      }
    }
  })
}
animateProductionsTk()


function animateCompany() {
  if (!D.querySelector('.company-pos')) return

  const cpTL = gsap.timeline()
  cpTL.from('.company-pos-top-num',{opacity: 0, xPercent: -50, duration: 0.5})
      .from('.company-pos-top-subtitle',{opacity: 0, xPercent: -50, duration: 0.7}, '-=0.4');
  ScrollTrigger.create({
    trigger: '.company-pos-top',
    start: 'top 60%',
    animation: cpTL
  });


  const cpmTL = gsap.timeline()
  cpmTL.from('.company-pos-middle-item',{opacity: 0, y: 200, duration: 0.5})
      .from('.company-pos-bottom-item',{opacity: 0, y: 200, duration: 0.8}, '-=0.4');
  ScrollTrigger.create({
    trigger: '.company-pos-middle',
    start: 'top 60%',
    animation: cpmTL
  });


  gsap.utils.toArray('.company-purpose-item').forEach((item)=>{
    const tl = gsap.timeline()
    tl
      .from(item.querySelector('.company-purpose-item-title'),{opacity: 0, xPercent: -50, duration: 0.6})
      .from(item.querySelector('.company-purpose-item-text'),{opacity: 0, yPercent: -50, duration: 0.8},'-=0.4')
    
    ScrollTrigger.create({
      trigger: item,
      start: 'top 65%',
      animation: tl
    });
  })
  
  

  function animateFrom (elem,delay = 0) {
    gsap.fromTo(elem, 
      {y: 50, opacity: 0},
      {y: 0, opacity: 1, duration: duration, delay: delay, overwrite: "auto"}
    )
  }
}


window.addEventListener('load',()=>{
  animArrayTrigger(
    [
      '.main-partner .main-block-title',
      '.main-partner-descr',
      '.main-partner-item',
      '.node-related .main-block-title',
      '.news-list'
    ],
    0.8);

  animateEnterprises()
  animateProductions()
  animateProductionsNoTk()

  animateCompany()

  animArrayTrigger(
    [
      '.company-acs .ui-side-title',
      '.company-acs .col-layout-wide',
      '.company-chart .ui-side-title',
      '.company-chart .ui-chart-block',
      '.company-fs .ui-side-title',
      '.company-fs .col-layout-wide'
    ],
    0.8
  );
})