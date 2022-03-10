$.fn.Tabs = function() {
	var selector = this;

	this.each(function() {
		var obj = $(this); 
		$(obj.attr('href')).hide();
		$(obj).click(function() {
			$(selector).removeClass('selected');
			
			$(selector).each(function(i, element) {
				$($(element).attr('href')).hide();
			});
			
			$(this).addClass('selected');
			$($(this).attr('href')).fadeIn();
			return false;
		});
	});

	$(this).show();
	$(this).first().click();
	if(location.hash!='' && $('a[href="' + location.hash + '"]').length)
		$('a[href="' + location.hash + '"]').click();	
};


function setValidatorDefaults() {
  jQuery.validator.setDefaults({
    errorClass: 'invalid',
    successClass: 'valid',
    focusInvalid: false,
    errorElement: 'span',
    errorPlacement: function (error, element) {
      if ( element.parent().hasClass('jq-checkbox') ||  element.parent().hasClass('jq-radio')) {
        element.closest('label').after(error);
        
      } else if (element.parent().hasClass('jq-selectbox')) {
        element.closest('.jq-selectbox').after(error);
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function(element, errorClass, validClass) {
      if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
        $(element).parent().addClass(errorClass).removeClass(validClass);
      } else {
        $(element).addClass(errorClass).removeClass(validClass);
      }
    },
    unhighlight: function(element, errorClass, validClass) {
      if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
        $(element).parent().removeClass(errorClass).addClass(validClass);
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
      }
    }
  });
  //дефолтные сообщения, предупреждения
  jQuery.extend(jQuery.validator.messages, {
    required: "Обязательное поле",
    email: "Некорректный email адрес",
    url: "Некорректный URL",
    number: "Некорректный номер",
    digits: "Это поле поддерживает только числа",
    equalTo: "Поля не совпадают",
    maxlength: jQuery.validator.format('Максимальная длина поля {0} символа(ов)'),
    minlength: jQuery.validator.format('Минимальная длина поля {0} символа(ов)'),
    require_from_group: jQuery.validator.format('Отметьте миниммум {0} из этих полей')
  });
  //кастомные методы валидатора
  jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
  }, "Только буквы");
  
  jQuery.validator.addMethod("telephone", function(value, element) {
    return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){6,14}(\s*)?$/i.test(value);
  }, "Некорректный формат");
}

function validatorInit() {
  $('.form_auth').validate({
    rules: {
      email: {
        email: true,
        required: true
      },
      password: {
        minlength: 8,
        required: true
      }
    }
  })

  $('.form_recovery').validate({
    rules: {
      email: {
        email: true,
        required: true
      },
    }
  });

  $('.form_passwords').validate({
    rules: {
      password: {
        required: true,
        minlength: 8
      },
      password_new: {
        required: true,
        minlength: 8,
        equalTo: $('.form_passwords input[name="password"]')
      }
    }
  })

  $('.form_account').validate({
    rules: {
      phone: {
        telephone: true,
      },
      mail: {
        email: true
      },
      oldpassword: {
        minlength: 8,
      },
      password: {
        minlength: 8,
        required: function () {
          return $('.form_account input[name="oldpassword"]').val()!=""
        }
      },
      passwordretry: {
        minlength: 8,
        equalTo: $('.form_account input[name="password"]'),
        required: function () {
          return $('.form_account input[name="password"]').val()!=""
        }
      }
    }
  })
}




const FARBA = {
	//функция для навешивания изображений фоном
	backgrounded (selector) {
		$(selector).each(function(index,item){
			var $this = $(item),
			$src = $this.find('.ui-backgrounded-bg').attr('src');
			if($this.find('.ui-backgrounded-bg').length) {
				$this.addClass('backgrounded').css('backgroundImage','url('+$src+')');
			}
		});
	},

	//lazy load для сторонних либ
	lazyLibraryLoad(scriptSrc,linkHref,callback) {
		let script = document.createElement('script');
		script.src = scriptSrc;
		document.querySelector('#wrapper').after(script);
	
		if (linkHref !== '') {
			let style = document.createElement('link');
			style.href = linkHref;
			style.rel = 'stylesheet';
			document.querySelector('link').before(style);
		}
	
		script.onload = callback
	},

  //предпросмотр загружаемого изображения
  imgPreview(input, imgContainer) {
    let isFiles = false;
    if (input.files && input.files[0]){
      let reader = new FileReader();
      reader.onload = function(e) {
        const src = e.target.result
        if ($(imgContainer).find('img').length) {
          $(imgContainer).find('img').attr('src',src)
          $(imgContainer).find('img').removeAttr('srcset')
        } else {
          $(imgContainer).prepend(`<img src="${src}" alt="photo preview"/>`)
        }
      }
      isFiles = true;
      reader.readAsDataURL(input.files[0]);
    } else {
      isFiles = false;
    }
    return isFiles;
  }
}


if (document.querySelector('.profile-notify-toggler')) {
  document.querySelector('.profile-notify-toggler').addEventListener('click',()=>{
    if (!document.querySelector('.notifications')) return;
    document.querySelector('.notifications').classList.toggle('active');
  })
}

if (document.querySelector('.profile-menu-toggler')) {
  document.querySelector('.profile-menu-toggler').addEventListener('click',()=>{
    document.querySelector('.profile-menu-toggler').classList.toggle('active');
    document.querySelector('.profile-menu-drop').classList.toggle('active');
  })
}
$(document).on('mouseup',function(e){
  if ($('.profile-menu').has(e.target).length === 0){
    $('.profile-menu-drop').removeClass('active');
  }
});

if (document.querySelector('.profile-menu-notify')) {
  document.querySelector('.profile-menu-notify').addEventListener('click',(e)=>{
    e.preventDefault();
    document.querySelector('.profile-menu-drop').classList.remove('active');
    document.querySelector('.notifications').classList.add('active');
  })
}
$(document).on('mouseup',function(e){
  if ($('.profile-notify').has(e.target).length === 0){
    $('.notifications').removeClass('active');
  }
});


jQuery(document).ready(function($){

  //лениво тянем формстайлер для темизации элементов форм
  if(document.querySelector('.ui-styler')) {
    FARBA.lazyLibraryLoad(
      '//cdnjs.cloudflare.com/ajax/libs/jQueryFormStyler/2.0.2/jquery.formstyler.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/jQueryFormStyler/2.0.2/jquery.formstyler.min.css',
      () => {
        $('.ui-styler').styler()
      }
    )
  }

  if(document.querySelector('.ui-form')) {
    FARBA.lazyLibraryLoad(
      '//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.3/jquery.validate.min.js',
      '',
      () => {
        setValidatorDefaults()
        validatorInit()
      }
    )
  }


  if (document.querySelector('.mfp-link')) {
    FARBA.lazyLibraryLoad(
      '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css',
      null
    )
  }

  if (document.querySelector('.mfp-link')) {
    FARBA.lazyLibraryLoad(
      '//cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css',
      null
    )
  }

  $(document).on('click','.mfp-link',function(e){
		e.preventDefault();
		let link = $(this);
		let href = link.attr('data-href');

		if (href && href.length) {
			$.magnificPopup.open({
				items: { src: href },
				type: 'ajax',    
				overflowY: 'scroll',
				// removalDelay: 610,
				mainClass: 'my-mfp-zoom-in',
				ajax: {
					tError: 'Ошибка. <a href="%url%">Контент</a> не может быть загружен',
				},
				callbacks: {
					open: function () {
						setTimeout(function(){
							$('.mfp-wrap, .mfp-bg').addClass('delay-back');
							$('.mfp-popup').addClass('delay-back');
						},700);
					}
				}
			});
		}
	});


  //inputs and "live" labels
  $(document).on('click','.ui-field-labeled',function(){
    $(this).find('input').focus();
    $(this).addClass('filled');
  })
  $(document).on('blur','.ui-field-labeled input',function(){
    if (!this.value.length) {
      $(this).closest('.ui-field-labeled').removeClass('filled')
    }
  })
  $('.ui-field-labeled').each(function(index,el){
    const input = $(el).find('input');
    if (input.val() && input.val().length) {
      $(el).addClass('filled');
    }
  })


  //предпросмотр фото профиля
  $(document).on('change','.account-photo-input',function(e){
    FARBA.imgPreview(this, '.account-photo-preview');
  })


  $(document).on('change','.student-card-input',function(e){
    const container = $(this).closest('.student-card-photo');
    const imgContainer = container.find('.student-card-img');
    const isImg = FARBA.imgPreview(this, container);
    if (isImg) {
      container.find('.student-card-upload')[0].childNodes[0].nodeValue = 'Изменить фото';
    }
  })
});