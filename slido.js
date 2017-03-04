(function(Q) {
	
	Q.fn.slido = 
		
		function(quantity,margin,speed,type,
				  controls,pager,auto,autoWay,autoSpeed,autoHover,
				  	ticker,tickerSpeed,adaptive,bigImg,nominalWidth,adminClass)
	{
		var settings = Q.extend({
			
			quantity : 1,
			margin : 0,
			speed : 0.8,
			type: "img",			
			controls : true,			
			pager : true,
			auto : true,
			autoWay: "right",
			autoSpeed : 10,
			autoHover : true,
			ticker: false,
			tickerSpeed: 10,			
            adaptive: true,
			bigImg: false,
			nominalWidth: 1024,			
			adminClass: "ltr ipHasAdminNavbar ipHasAdminPanel"
			
		},quantity,margin,speed,type,
				  controls,pager,auto,autoWay,autoSpeed,autoHover,
				  	ticker,tickerSpeed,adaptive,bigImg,nominalWidth,adminClass);
		return this.each(function(){
			
			//////////BASE//////////
			var
		    quantity = settings.quantity,
			margin = settings.margin,
			speed = settings.speed,
			type = settings.type,
			autoSpeed = settings.autoSpeed,
			nominalWidth = settings.nominalWidth,
			bigImg = settings.bigImg,				
			pager = settings.pager,
			controls = settings.controls,
			auto = settings.auto,
			autoWay = settings.autoWay,
			autoHover = settings.autoHover,
			adaptive = settings.adaptive,
			adminClass = settings.adminClass,
			ticker = settings.ticker,
			tickerSpeed = settings.tickerSpeed,
			width = Q(this).parent().width(),
			height = Q(this).find("li").children().height(),
            
			difference,
			indexPos = quantity,		
			interval,
			direction,
			currentPos = 0;

			var $slido = Q(this).addClass("slido");
			var $li = $slido.find("li");
			$slido.parent().css("position","relative");

			var $viewport = Q("<div>").addClass('slidoViewport')
                .css({"overflow":"hidden","height":"auto"});
			$slido.wrap($viewport);
            
			var over = $li.length % quantity;
	
			var $left = Q("<div>").addClass('leftControl controls');
			var $right = Q("<div>").addClass('rightControl controls');
			$left.prependTo(Q(this).parent().parent());
			$right.appendTo(Q(this).parent().parent());
			
			Q("<ul>").addClass('pager').appendTo(Q(this).parent().parent());
			var $pager = Q(this).parent().nextAll('ul');
			
            //////////SIZE MEASUREMENT//////////
			
			var insideBaseWidth,insideBaseHeight,$cloneToLeftSlides,$cloneToRightSlides;
						
			function varyingWidth(){
				return (width - (margin*2*quantity)) / quantity;}
			
			function addLayers(quantity,type){
				
				$li.width(varyingWidth()); //только для базового расчёта ширины внутреннего элемента
				insideBaseWidth = parseInt($li.children(type).width());				
				insideBaseHeight = parseInt($li.children(type).height());
				$cloneToLeftSlides = $li.slice($li.length - quantity).clone();
				$cloneToRightSlides = $li.slice(0,quantity).clone();
				$cloneToLeftSlides.prependTo($slido).addClass("leftLayer");
				$cloneToRightSlides.appendTo($slido).addClass("rightLayer");
				
				if($(window).width() < insideBaseWidth){
					insideBaseWidth = parseInt($(window).width());
				}
			}
			function clearLayers(){
				$cloneToLeftSlides.add($cloneToRightSlides).remove();
			}
			
			if(type == "img" && $li.find("img").length > 0){
				
				addLayers(quantity,type);
			}
			else if(type == "div" && $li.children("div").length > 0){
				
				addLayers(quantity,type);
			}
			else if(type == "widget" && $li.find(".ipWidget").length > 0){
				
				insideBaseWidth = parseInt($li.find(Q("img.ipsImage")).width());
				insideBaseHeight = parseInt($li.find(Q("img.ipsImage")).height());
				$cloneToLeftSlides = $li.slice($li.length - quantity).find("img.ipsImage").clone();
				$cloneToRightSlides = $li.slice(0,quantity).find("img.ipsImage").clone();
				$cloneToLeftSlides.prependTo($slido).wrap("<li>")
					.removeClass("ipsImage").parent().addClass("leftLayer");
				$cloneToRightSlides.appendTo($slido).wrap("<li>")
					.removeClass("ipsImage").parent().addClass("rightLayer");				
			}
			else{var noImg = true;}
						
            if(adaptive == true){
								
                Q(window).on('resize load',function(){

					width = $slido.parent().width();
                    $slido.width(($li.length * width / quantity) + "px");					
					$slido.parent().height(((width / insideBaseWidth * height) / quantity) + "px");
					
					if(noImg == true){
						moveSlide(0);
					}
					else{
						if(type == "widget"){
							$li.add($cloneToLeftSlides.parent("li")).add($cloneToRightSlides.parent("li")).width(varyingWidth());							
						}
						else{
							$li.add($cloneToLeftSlides).add($cloneToRightSlides).width(varyingWidth());							
						}

						currentPos = 0 - width;
                    	moveSlide(currentPos,0);
					}
					$pager.find("li").removeClass("active");
					indexPos = quantity;
					$pager.find("li").first().addClass("active");
					
					if (bigImg == true){
						
						if(Q(window).width() < nominalWidth){
							$slido.parent().height((insideBaseHeight * width / nominalWidth) + "px");
						}
						else{
							$slido.parent().height(insideBaseHeight + "px");
						}                       
					}
					//console.log($slido.parent().height(),$slido.width());
                });
            }
            else if(adaptive == false){
				
				Q(window).on('resize load',function(){
					
					width = $slido.parent().width();//определяем ширину
					clearLayers();addLayers(quantity,type);//удаляем старые слои, ставим новые ПРОТИВ ГЛЮКОВ С РЕСАЙЗОМ
					
					quantity = Math.floor(width / insideBaseWidth);//определяем количество слайдов в области видимости
					quantity = Math.floor((width - (margin*2*quantity)) / insideBaseWidth);//делаем перерасчёт, но уже с учётом margin
					over = $li.length % quantity;//снова вычисляем количество элементов не кратных области видимости
					
					clearLayers();addLayers(quantity,type);//удаляем старые слои, ставим новые
					
					$li.add($cloneToLeftSlides).add($cloneToRightSlides).width(varyingWidth());//устанавливаем ширину для всех слайдов					
					$slido.width(($li.length * width / quantity) + "px");
					currentPos = 0 - width;
                	moveSlide(currentPos,0);
					$pager.find("li").removeClass("active");
					indexPos = quantity;
					$pager.find("li").first().addClass("active");
					//console.log(width,quantity,insideBaseWidth);
				});
            }
			///////////MARGIN////////////
			if(margin > 0){	
				Q.each({$li,$cloneToLeftSlides,$cloneToRightSlides},function(){
					Q(this).css({"margin": "0px\u0020" + margin + "px"});
				});
			}
			//////////ADMIN//////////
			if($("body").hasClass(adminClass) && type == "widget"){
				
				Q("<form>").appendTo($(this).parent());
				Q("<button>").appendTo($(this).nextAll('form')).addClass("addSlide");
				Q("<button>").appendTo($(this).nextAll('form')).addClass("deleteSlide");
				
				Q(".addSlide").attr({
					'type': 'submit',
					'formmethod': 'post',
					'formaction':' ',
					'name':'slider',
					'value':'1'
				});
				Q(".deleteSlide").attr({
					'type': 'submit',
					'formmethod': 'post',
					'formaction':' ',
					'name':'slider',
					'value':'-1'
				});	
			}
			///////////TICKER////////////
			if(ticker == true){
				auto=false,controls=false,pager=false;
				window.setTimeout(function(){
					$slido.css({
					"transform":" translate3d(" + (-$li.length * width / quantity) + "px, 0px , 0px)",
					"transitionDuration": tickerSpeed + "s",
					"transitionTimingFunction": "linear"
					});
					console.log(-$li.length * width / quantity);
				},speed * 1000);				
			}
            ///////////AUTOPLAY////////////
			function autoplay(){
				interval = window.setInterval(function(){
					if(autoWay == "left"){$left.trigger('click');}
					else if(autoWay == "right"){$right.trigger('click');}
				},autoSpeed * 1000);
			}
			if(auto == true){autoplay();}

			if(autoHover == true && auto == true){
				Q(this).parent().parent().hover(
					function() {window.clearInterval(interval);},
					function() {autoplay();});
			}
            //////////CONTROLS//////////
			if(controls == false){
				Q(this).parent().siblings(".controls").css("display","none");
			}
			function leftArrowClick(){
				
				direction = "left";
				$pager.find("li").removeClass("active");
				
				if (indexPos == 1 * quantity){				
					currentPos = (currentPos - (-width));
					indexPos = 0;					
					moveSlide(currentPos,speed,direction);
					currentPos = (-width * $li.length) / quantity;
					$pager.find("li").eq(((indexPos - over)/quantity) - 1 + Math.ceil(over/quantity)).addClass("active");	
				}
				else if (indexPos % quantity != 0){
					currentPos = (currentPos + (over * width / quantity));
					moveSlide(currentPos,speed);
					indexPos = indexPos - over;
					$pager.find("li").eq((indexPos/quantity) - 1).addClass("active");
				}
				else {
					currentPos = (currentPos - (-width));
					moveSlide(currentPos,speed);
					indexPos = indexPos - 1 * quantity;
					$pager.find("li").eq((indexPos/quantity) - 1).addClass("active");
				}
				//console.log(currentPos,indexPos);
			}		
			function rightArrowClick(){
				
				direction = "right";
				$pager.find("li").removeClass("active");
				
				if (indexPos == $li.length){
					
					currentPos = (currentPos + (-width));
					indexPos = indexPos + 1 * quantity;
					moveSlide(currentPos,speed,direction);
					currentPos = (-width);
					$pager.find("li").eq(0).addClass("active");
				}
				else if (indexPos == $li.length - over && over > 0){
					currentPos = (currentPos - (over * width / quantity));
					moveSlide(currentPos,speed);
					indexPos = indexPos + over;
					$pager.find("li").eq((indexPos - over)/quantity).addClass("active");
				}
				else {
					currentPos = (currentPos + (-width));
					moveSlide(currentPos,speed);
					indexPos = indexPos + 1 * quantity;
					$pager.find("li").eq((indexPos/quantity) - 1).addClass("active");
				}
				//console.log(currentPos,indexPos);
			}
			$left.on('click',leftArrowClick);
			$right.on('click',rightArrowClick);
			//////////ACTION/////////
			
			function moveSlide(currentPos,speed,direction){

				$slido.css({
					"transform":" translate3d(" + currentPos + "px, 0px , 0px)",
					"transitionDuration": speed + "s"
				});
				
				if(indexPos == 0 && direction == "left"){
					$left.off('click');
					currentPos = (-width * $li.length / quantity);
					indexPos = $li.length;					
					window.setTimeout(function(){						
						moveSlide(currentPos,0);
						$left.on('click',leftArrowClick);
					},(speed * 1000) + 200);
				}
				if(indexPos == $li.length + (1*quantity) && direction =="right"){
					$right.off('click');
					currentPos = (-width);
					indexPos = 1 * quantity;
					window.setTimeout(function(){
						moveSlide(currentPos,0);
						$right.on('click',rightArrowClick);
					},(speed * 1000) + 200);
				}
			}
			//////////PAGER//////////
			if(pager == false){
				Q(this).parent().nextAll("ul").css("display","none");
			}
			else if(pager == true){

				$li.each(function(i){
					Q("<li>").appendTo(Q(this).parent("ul").parent().nextAll('ul'));
					if (i + 1 >= $li.length / quantity){return false;}
				});				
				$pager.find("li").first().addClass("active");
				$pager.find("li").on('click', function(){
					
					difference = Q(this).index() - Q(this).parent("ul").find("li.active").index();
					
					if(over > 0 && Q(this).index() == ($pager.find("li").length-1) && indexPos % quantity == 0) {

						currentPos = (currentPos + difference*(-width) - ((quantity - over) * (-width / quantity)));
						moveSlide(currentPos,speed);
						indexPos = (Q(this).index() * quantity) + over;
					}
                    else if(Q(this).index() == ($pager.find("li").length-1) && Q(this).hasClass("active")){}
					else if(indexPos % quantity != 0){
						
						currentPos = (currentPos + difference*(-width) - ((quantity - over) * (width / quantity)));
						moveSlide(currentPos,speed);
						indexPos = (Q(this).index() + 1) * quantity;
					}
					else {
						currentPos = (currentPos + difference*(-width));
						moveSlide(currentPos,speed);
						indexPos = (Q(this).index() * quantity) + quantity;
					}
					
					$pager.find("li").removeClass("active");
					Q(this).addClass("active");
					//console.log(currentPos,indexPos);
				});
			}
		});	
	};
	
}(jQuery));