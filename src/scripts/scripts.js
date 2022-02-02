const FARBA = {
	//lazy load для сторонних либ
	lazyLibraryLoad(scriptSrc,linkHref,callback) {
    let script
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`)
    const domLink = document.querySelector(`link[href="${linkHref}"]`)

    if (!domScript) {
      script = document.createElement('script');
      script.src = scriptSrc;
      document.querySelector('#wrapper').after(script);
    }
		
	
		if (linkHref !== '' && !domLink) {
			let style = document.createElement('link');
			style.href = linkHref;
			style.rel = 'stylesheet';
			document.querySelector('link').before(style);
		}
    
    if (!domScript) {
      script.onload = callback
    } else {
      domScript.onload = callback
    }
	},

  //reinit gallery
  initGallery(selector) {
    const target = D.querySelectorAll(selector)
    if (!target.length) return

    const initedLGs = D.querySelectorAll('.lg-inited')
    if (window.lgData && initedLGs.length) {
      initedLGs.forEach(item => {
        window.lgData[item.getAttribute('lg-uid')].destroy(true)
        item.classList.remove('lg-inited')
      })
    }
    
    target.forEach(el => {
      el.classList.add('lg-inited')
      
      el.addEventListener('onAfterOpen', function(event) {
        const q = D.querySelector('#lg-counter');
        if (q.childNodes[1] && q.childNodes[1].nodeType === 3) {
          D.querySelector('#lg-counter').childNodes[1].nodeValue = ' из '
        }
      });

      lightGallery(el,{
        download: false,
        selector: 'a.ux-gallery-link',
        backdropDuration: 500,
        speed: 500
      })
    })

  },

  initVideo(selector) {
    const target = D.querySelectorAll(selector);
    if (!target.length) return

    target.forEach((el,index) => {
      el.addEventListener('click',function(e){
        e = event || window.event
        e.preventDefault();

        const id = el.dataset.videoid || null;
        const container = el.nextElementSibling;
        if (!id) return

        const markup = `<div class="ux-plyr ux-plyr-${index}" data-plyr-provider="youtube" data-plyr-embed-id="${id}"></div>`

        el.parentElement.classList.add('initialized')
        container.innerHTML = markup
        
        const player = new Plyr(`.ux-plyr-${index}`, {
          autoplay: true,
          ratio: '16:9',
          youtube: {
            autoplay: true,
          }
        });
      })
    })
  }
}


const D = document;


//full screen menu toggler
(function () {
  const toggler = D.querySelector('.ux-toggler-menu')
  if (!toggler) return

  toggler.addEventListener('click', function(e) {
    e = event || window.event
    e.preventDefault()
    
    const action = toggler.classList.contains('opened') ? 'close' : 'open'
    //...
    animateFSMenu(action)

    this.classList.toggle('opened')
  })
})();


//main-menu
(function () {
  const li = D.querySelectorAll('.main-menu-main > li')

  li.forEach(el => {
    if (el.querySelector('ul')) {
      el.querySelector('a').classList.add('childs-in')
    }
  })


  const parentLinks = D.querySelectorAll('a.childs-in')
  
  parentLinks.forEach(el => {
    el.addEventListener('click', function(e){
      e = event || window.event
      e.preventDefault()

      const openedItems = D.querySelectorAll('.main-menu-sub.opened, a.childs-in')
      openedItems.forEach(el => {
        if (el !== this && el !== this.nextElementSibling) {
          el.classList.remove('opened')
        }
      })

      this.classList.toggle('opened')
      this.nextElementSibling.classList.toggle('opened')
    })
  })


  //скрываем меню по клику вне
  D.addEventListener( 'click', (e) => {
    const openedUL = D.querySelector('.main-menu-sub.opened')
    if (!openedUL) return
    const withinBoundaries = e.composedPath().includes(openedUL);
    
    if ( ! withinBoundaries && !e.target.classList.contains('childs-in') ) {
      openedUL.classList.remove('opened'); 
    }
  })
})();


//news-archieve toggler
(function () {
  const toggler = D.querySelector('.ux-toggler-archieve')
  const target = D.querySelector('.news-archieve')
  if (!toggler || !target) return

  toggler.addEventListener('click', function(e) {
    e = event || window.event
    e.preventDefault()
    this.classList.toggle('opened')
    target.classList.toggle('opened')
  })
})();


//анимируем fullscreen menu
function animateFSMenu (action) {
  const menu = D.querySelector('.fs-menu')
  const header = D.querySelector('#header')

  header.classList.toggle('fs-opened')
  
  if (action === 'open') {

    menu.classList.add('opened')
    const tlStart = gsap.timeline({autoRemoveChildren: true})
    tlStart
      .fromTo('.fs-menu-bg',{scale: 0}, {scale: 1, duration: 0.35})
      .fromTo('.fs-menu-productions',{y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.45})
      .fromTo('.fs-menu-links',{y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, delay: -0.25})
      .fromTo('.fs-menu-contacts-1',{y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, delay: -0.25})
      .fromTo('.fs-menu-contacts-2',{y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.45, delay: -0.25})

  } else {
    const tlEnd = gsap.timeline({autoRemoveChildren: true})
    tlEnd
      .to('.fs-menu-contacts-2', {y: 50, opacity: 0, duration: 0.3})
      .to('.fs-menu-contacts-1', {y: 50, opacity: 0, duration: 0.3, delay: -0.15})
      .to('.fs-menu-links', {y: 50, opacity: 0, duration: 0.3, delay: -0.15})
      .to('.fs-menu-productions', {y: 5, opacity: 0, duration: 0.3,delay: -0.15})
      .to('.fs-menu-bg', {scale: 0, duration: 0.25, onComplete: ()=>{menu.classList.remove('opened')}})
  }
}


//фиксация шапки
(function () {
  const target = D.querySelector('#header')
  if (!target) return

  window.onscroll = function(e) {
    // print "false" if direction is down and "true" if up
    this.oldScroll > this.scrollY 
      ? target.classList.remove('not-fixed')
      : target.classList.add('not-fixed')

    this.oldScroll = this.scrollY;
  }
})();


// галлерея
(function () {
  const target = D.querySelectorAll('.ux-gallery')
  if (!target.length) return

  FARBA.lazyLibraryLoad(
    '//cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/js/lightgallery.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/lightgallery-js/1.4.0/css/lightgallery.min.css',
    () => {

      target.forEach(el => {
        el.classList.add('lg-inited')

        el.addEventListener('onAfterOpen', function(event) {
          const q = D.querySelector('#lg-counter');
          if (q.childNodes[1] && q.childNodes[1].nodeType === 3) {
            D.querySelector('#lg-counter').childNodes[1].nodeValue = ' из '
          }
        });

        lightGallery(el,{
          download: false,
          selector: 'a.ux-gallery-link',
          backdropDuration: 500,
          speed: 500
        })
      })

    }
  )
})();


if (D.querySelector('.ux-share')) {
  FARBA.lazyLibraryLoad('//yastatic.net/share2/share.js','',null)
}


if (D.querySelector('.ux-video')) {
  FARBA.lazyLibraryLoad(
    '//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.12/plyr.min.css',
    FARBA.initVideo('.ui-video-preview')
  )
}
