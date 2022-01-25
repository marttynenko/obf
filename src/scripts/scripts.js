const D = document;


//full screen menu toggler
(function () {
  const toggler = D.querySelector('.ux-toggler-menu')
  if (!toggler) return

  toggler.addEventListener('click', function(e) {
    e = event || window.event
    e.preventDefault()
    this.classList.toggle('opened')
    //...
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


  // D.addEventListener( 'click', (e) => {
  //   const openedUL = D.querySelector('.main-menu-sub.opened')
  //   if (!openedUL) return
  //   const withinBoundaries = e.composedPath().includes(openedUL);
    
  //   if ( ! withinBoundaries ) {
  //     openedUL.classList.remove('opened'); 
  //   }
  // })
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


