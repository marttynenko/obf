// function correctFly() {
//     const h = window.innerHeight
//     document.querySelectorAll('.anim-fly').forEach(el => {
//         if (el.getBoundingClientRect().top + window.pageYOffset - h * 0.85 < window.scrollY || window.scrollY >= (document.documentElement.scrollHeight - h) * 0.95) {
//             el.classList.add('visible')
//         } else {
//             el.classList.remove('visible')
//         }
//     })
// }
function correctFly(selectors = '.anim-fly', offset = 0.9) {
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

$(document).ready(function () {
    //Поиск
    ////Подсказки
    $('#searchInput').on('keyup', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code!=13) {

            var sv = $(this).val();                
            setTimeout(() => {
                let scv = $('#searchInput').val();
                if (sv == scv) {                                
                    get_suggestion();
                }
            }, 500);
        }
    });    
    $(document).on('click','.fs-search-hint',function(){
        $('#searchInput').val($(this).attr('data-value'));
        build_query();
    });
    $(document).on('click','.circle-link-search.opened',function(){
        $('#searchInput').val('');
    });
    //Деление меню на колонки
    $('.fs-menu-links .fs-menu-col').each(function(){
        if($(this).find('li').length>4){
            $(this).find('ul').after('<div class="fs-menu-body"><div class="row"><div class="col-6"><ul class="fs-menu-ul fs-menu-ul-1"></ul></div><div class="col-6"><ul class="fs-menu-ul fs-menu-ul-2"></ul></div></div></div>');
            var n = 1;
            var c = Math.ceil($(this).find('li').length/2); 
            let b = $(this);
            $(this).find('li').each(function(index){
                if(index == c){
                    n++;
                }
                b.find('.fs-menu-ul-' + n).append($(this).clone());
            });
            $(this).find('>ul').remove();
            $(this).addClass('fs-menu-col-wide');
        }
        else{
            $(this).find('ul').after('<div class="fs-menu-body"><ul class="fs-menu-ul fs-menu-ul-1"></ul></div>');
            var n = 1;
            var c = 4; 
            let b = $(this);
            $(this).find('li').each(function(index){
                if(index == c){
                    n++;
                }
                b.find('.fs-menu-ul-' + n).append($(this).clone());
            });
            $(this).find('>ul').remove();
            //$(this).addClass('fs-menu-col-wide');
        }
    })
    $('.fs-menu-row .fs-menu-ul').each(function(){
        if($(this).find('li').length>4){
            $(this).addClass('fs-menu-ul-wide');
            $(this).closest('.fs-menu-col').addClass('fs-menu-col-wide');
        }
    });
    //Фильтр по меню слева
    $(document).on('click','#menuFilter a',function(){
        $('#menuFilter a').removeClass('active');
        $(this).addClass('active');
        let url = $(this).attr('href');
        let code = $(this).attr('data-code');
        $.ajax({
            url:url,
            method:'GET',
            async:false,
            success:function(data){    
                $('#contentList').html($(data).find('#contentList').html());
                if($('#pgnList').length){
                    if($(data).find('#pgnList').length){
                        $('#pgnList').html($(data).find('#pgnList').html());                
                    }
                    else{
                        $('#pgnList').html('');
                    }
                }
                if($('#yearFilter').length){
                    $('#yearFilter').html($(data).find('#yearFilter').html());                
                }
                //Навестить обработку поп-апов
                if($('.ux-gallery').length>0){
                    FARBA.initGallery('.ux-gallery')
                }
                location.hash = code;
                var state = {
                    title: $('title').text(),
                    url: url
                }
                // заносим ссылку в историю
                history.pushState( state, state.title, state.url );
            }
        });
        return false;
    });

    if (window.innerWidth < 960 && $('#menuFilter a').length && (document.querySelector('.certs-list') || document.querySelector('.docs-group-list'))) {
        $('#menuFilter a')[0].click();
    }

    //Фильтр по году
    $(document).on('click','#yearFilter a:not(.not-active)',function(){
        $('#yearFilter a').removeClass('active');
        $(this).addClass('active');
        let url = $(this).attr('href');
        let code = $(this).attr('data-code');
        $.ajax({
            url:url,
            method:'GET',
            async:false,
            success:function(data){    
                $('#contentList').html($(data).find('#contentList').html());
                if($('#pgnList').length){
                    $('#pgnList').html($(data).find('#pgnList').html());                
                }                                
                location.hash = code;
                var state = {
                    title: $('title').text(),
                    url: url
                }
                // заносим ссылку в историю
                history.pushState( state, state.title, state.url );                
            }
        });
        return false;
    });
    //Клик по hash'у
    let hash = location.hash;
    if(hash && $('.hash-link[data-code="' + hash.replace(/#/,'') + '"]').length){
        $('.hash-link[data-code="' + hash.replace(/#/,'') + '"]').click();
    }
    $(document).on('click','.show-more-pgn',function(){
        let url = $(this).attr('href');
        $.ajax({
            url:url,
            method:'GET',
            async:false,
            success:function(data){
                $('#contentList').append($(data).find('#contentList').html());
                $('#contentList').children().addClass('anim-fly');
                
                if($('#pgnList').length){               
                    $('#pgnList').html($(data).find('#pgnList').html());            
                }
                if($('#otherList').length){
                    $('#otherList').html($(data).find('#otherList').html());                
                }
                if($('.ux-gallery').length>0){
                    FARBA.initGallery('.ux-gallery')
                }
                var state = {
                    title: $('title').text(),
                    url: url
                }
                
                // заносим ссылку в историю
                history.pushState( state, state.title, state.url );

                FARBA.rebuildPager();

                correctFly()
            }
        });
        return false;
    });
    $(document).on('click','.show-more-pgn-search',function(){
        let url = $(this).attr('href');
        $.ajax({
            url:url,
            method:'GET',
            async:false,
            success:function(data){    
                $('#contentListS').append($(data).find('#contentListS').html());
                $('#contentListS').children().addClass('anim-fly');

                if($('#pgnListS').length){               
                    $('#pgnListS').html($(data).find('#pgnListS').html());                
                }                             
                
                correctFly()
            }
        });
        return false;
    });    
    $(document).on('click','.ui-pgn-links-search a',function(){
        let url = $(this).attr('href');
        $.ajax({
            url:url,
            method:'GET',
            async:false,
            success:function(data){    
                $('#contentListS').html($(data).find('#contentListS').html()); 
                if($('#pgnListS').length){               
                    $('#pgnListS').html($(data).find('#pgnListS').html());                
                }                                         
                $('.fs-search').animate({scrollTop:50},300);
                FARBA.rebuildPager();
            }
        });
        return false;
    });    
    //Отображение других тегов
    $(document).on('click','.ui-tags-more',function(){
        if($(this).hasClass('open')){
            // $('.ui-tags-list .hide-item').slideUp(200);
            // $(this).removeClass('open').find('span').text('Показать все темы');
            // $('body,html').animate({scrollTop:$('.last-visible').offset().top - 300},300);
            let list = document.querySelectorAll('.ui-tags-list .hide-item')
            list = [...list]
            list = list.reverse()
            list.forEach((el,index) => {
                setTimeout(()=>{
                    $(el).slideUp(150);
                },index*50)
            })
            $(this).removeClass('open').find('span').text('Показать все темы');
        }
        else{
            // $('.ui-tags-list .hide-item').slideDown(200);
            
            document.querySelectorAll('.ui-tags-list .hide-item').forEach((el,index) => {
                setTimeout(()=>{
                    $(el).slideDown(150);
                },index*50)
            })
            $(this).addClass('open').find('span').text('Скрыть');
        }
    });
    //Подгрузка фотографий в галерею
    $(document).on('click','.show-more-foto',function(){
        $(this).hide().next().show();
        let id = $(this).attr('data-id');
        var block = $(this).closest('.col-layout-wide').find('.ux-gallery');
        block.find('.gallery-col-hide').show();

        correctFly()
        /* $.ajax({
            url:'/API/gall.php?ID='+id,
            method:'GET',
            async:false,
            success:function(data){
                block.html(data);
                FARBA.initGallery('.ux-gallery');
            }
        }); */
        return false;
    });
    //Удаление подгруженных фотографий
    $(document).on('click','.show-more-foto-remove',function(){
        $(this).hide().prev().show();
        let a = $(this).prev();
        var block = $(this).closest('.col-layout-wide').find('.ux-gallery');
        block.find('.gallery-col-hide').hide(300);
        a = block.find('.gallery-col:not(.gallery-col-hide):last');
        /* block.find('.gallery-col-remove').remove(); */ 
        $('body,html').animate({scrollTop:a.offset().top-300},300);       
        return false;
    });

    //Подгрузка документов в продукцию
    $(document).on('click','.show-more-pdf',function(){
        $(this).hide().next().show();        
        var block = $(this).closest('#contentListPDF');
        block.find('.docs-group-hide').slideDown(200);        
        return false;
    });
    //Удаление подгруженных фотографий
    $(document).on('click','.show-more-pdf-remove',function(){
        $(this).hide().prev().show();
        // let a = $(this).prev();
        var block = $(this).closest('#contentListPDF');
        block.find('.docs-group-hide').slideUp(200);      
        // $('body,html').animate({scrollTop:a.offset().top-500},300);
        return false;
    });
    
});
function get_suggestion(){
    var sv = $('#searchInput').val();
    $.ajax({
        url:'/ajax/search-sugestion.php',
        method:'POST',
        data:{search:sv,params:'pe:5,md5:,site:s1'},
        dataType: 'json',
        success:function(data){  
            $('#hintSearch').removeClass('opened'); 
            $('#hintSearch').html('');
            if(data.length){
                Object.entries(data).forEach(
                    ([key, value]) => {   
                        $('#hintSearch').append(value.NAME);
                    }
                );                     
                if(!$('.fs-search-results').hasClass('entered')){
                    $('#hintSearch').addClass('opened');
                }
                $('.fs-search-results').removeClass('entered');
            }
        }
    });
}
function build_query(){
    var sv = $('#searchInput').val();
    $.ajax({
        url:'/search/?q=' + sv,
        method:'GET',               
        beforeSend:function(){
            $('.fs-search-results').addClass('entered');
        },
        success:function(data){  
            $('#contentListSWrap').html($(data).find('#contentListSWrap').html()); 
            let c = $(data).find('#countSearch').html();
            if(c!=''){
                $('#countSearch').html(c);
                $('.search-results-title').show();
            }
            else{
                $('.search-results-title').hide();
            }
            
            document.querySelector('.fs-search-results').classList.add('opened');
            $('#hintSearch').removeClass('opened');
            FARBA.rebuildPager();
        }
    });
}