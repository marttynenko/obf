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


//фикс для шапки
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
