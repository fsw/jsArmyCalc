

/*
jsArmyCalc constructor
selector is a jquery selector string that is to return a single dom element
$template url can be used to customize calc template
*/
function jsArmyCalc( selector, templateurl ){
	
	calc = {};
	
	calc.canvas = $(selector);
	calc.canvas.attr('style','');
	
	calc.canvas.html('loading calc...');
	
	// calc template is loaded with AJAX	
	var template = $.ajax({
				url: templateurl,
				async: false
				}).responseText;
		
	calc.canvas.html(template);

	calc.statusElem = calc.canvas.find('#acStatus');
	calc.submenuElem = calc.canvas.find('.submenu');
	
	calc.langSelect = calc.canvas.find('#acLang');
	calc.langSelect.change(function(){ calc.setLang($(this).val()); });

	calc.canvas.find('#acMaximize').click(function(){calc.setFullscreen(true); return false;});
	calc.canvas.find('#acMinimize').click(function(){calc.setFullscreen(false); return false;});
	
	calc.canvas.find('#acNew').click(function(){calc.newArmy(); return false;});
	calc.canvas.find('#acRevalidate').click(function(){calc.revalidate(); return false;});
		
	calc.canvas.find('#acPrint').click(function(){calc.print(); return false;});
	
	calc.canvas.find('#acDec').click( function(){ _focused_element.size(_focused_element.size()-1); return false;}).hide();
	calc.canvas.find('#acInc').click( function(){ _focused_element.size(_focused_element.size()+1); return false;}).hide();
	calc.canvas.find('#acRem').click( function(){ _focused_element.remove(); return false;}).hide();
	
	calc.canvas.find('#acUp').click( function(){
		_focused_element._li.prev().before(  _focused_element._li );
		calc.canvas.find('#acUp').toggle(_focused_element._li.prev().length > 0);
		calc.canvas.find('#acDown').toggle(_focused_element._li.next().length > 0);
		return false;
	}).hide();
	calc.canvas.find('#acDown').click( function(){
		_focused_element._li.next().after(  _focused_element._li );
		calc.canvas.find('#acUp').toggle(_focused_element._li.prev().length > 0);
		calc.canvas.find('#acDown').toggle(_focused_element._li.next().length > 0);
		return false;
	}).hide();
	
	//this is a 
	calc.army = null;
	
	calc.units = [];
	calc.availableUnits = {};
	

	calc.closePopup = function(){
		this.canvas.find('#acPopup').fadeOut(); 
		this.canvas.find('#acPopupBg').fadeOut(); 
	}

	calc.popup = function( title, body, block ){
		
		this.canvas.find('#acPopupTitle').html( title );
		this.canvas.find('#acPopupContent').html( '' ); 
		this.canvas.find('#acPopupContent').append( body );
		
		if(block)
			this.canvas.find('#acClosePopup').hide( );
		else
			this.canvas.find('#acClosePopup').show( );
		
		this.canvas.find('#acPopupBg').fadeIn();
		this.canvas.find('#acPopup').fadeIn();
	
		this.canvas.find('#acClosePopup').click(function(){ 
			  calc.canvas.find('#acPopup').fadeOut(); 
			  calc.canvas.find('#acPopupBg').fadeOut(); 
			  return false;});
	   
	}

	calc.setStatus = function( text ){
		this.statusElem.text(text);
	}

	calc.flashMsg = function( text ){

		//this.statusElem.stop();
		//this.statusElem.hide();
		this.statusElem.html( text );
		//this.statusElem.fadeIn();
		this.statusElem.stop().css("background-color", "#ff0000").animate({backgroundColor: '#000000'}, 1000);

	}


	calc.setLang = function( lang ){
	
	  acAddCSSRule(".trans", "display", "none");


	  //if a language was already set 
	  if(this.lang)
		acAddCSSRule("."+this.lang+"", "display", "none");

	  this.lang = lang;
	  
	  acAddCSSRule("."+lang+"", "display", "inline");
 
	}

	calc.setStatus('no TWR file loaded');			

	calc.setError = function( text ){
		this.statusElem.html('<b style="color:red">'+text+'</b>');
	}
	
	xhrError = function( jqxhr, text, error ){
		this.calc.setError( this.url+' - '+text + ' - ' + error );
	}


	calc.calcLoadUnitsXml = function( xml ){
		console.log(xml);
	}
	
	calc.loadTWR = function( url ){
		
		this.twrurl = url;
		this.units = [];
		this.availableUnits = [];
		
		this.setStatus( 'loading '+url );

		this.ruleset = new acRuleset( this );
		this.ruleset.loadFromUrl( url );
	  
	};

	calc.revalidate = function( ){
		if(! this.army ){
		  	this.flashMsg( "Please create new army first!" );
			return;
		}

		if(! this.model.validator ){
		  	this.flashMsg( "This model do not provide a validator!" );
			return;
		}

		acSandbox( this.model.validator, { army: this.army });
		this.popup( "validation result", this.army._errorsul );
	
	}


	calc.getArmyHtml = function( ){
		if(! this.army ){
		  	this.flashMsg( "Please create new army first!" );
			return false;
		}
		return "Not <b>yet</b> implemented.HTML";
	}
	
	calc.getArmyTwa = function( ){
		if(! this.army ){
		  	this.flashMsg( "Please create new army first!" );
			return false;
		}
		return "Not <b>yet</b> implemented.TWA";
	}



	calc.print = function( ){
	
		if(! this.army ){
		  	this.flashMsg( "Please create new army first!" );
			return;
		}

	  
		acPrintText(this.canvas.find(".unitslist").html());

	}

	calc.newArmy = function( ){

		that = this;

		body = $('<div></div>');
		body.append("<div class='piece'><h3>"+this.ruleset.name+"</h3>"+this.ruleset.description+"</div>");
	
		modelSelect = $("<select></select>");
		
		for( id in this.ruleset.models )
			modelSelect.append("<option value='" + id + "'"+(this.ruleset.models[id]['default'] ?" selected='true'":"")+">"
				+this.ruleset.models[id].name+"</option>");
		  

		createButton = $("<input type='button' value='create'/>");

		body.append($("<label>Model</label>").append(modelSelect));
	
		for( id in this.ruleset.costs ){
			this.ruleset.costs[id].input = $("<input name='cost[" + id + "]' value='0'/>");
			body.append($("<label>"+this.ruleset.costs[id].name+"</label>").append(this.ruleset.costs[id].input));
		}

		createButton.click(function(){
		  
		  calc.closePopup( );  
			
		  calc.canvas.find('#acElements').html('');
		  calc.canvas.find('#acUnits').html('');
		  


		  var list_header = $("<div class='title'></div>");
		  $.each( that.ruleset.costs, function( id, item){
			list_header.append("<span class='cst'>"+item.shortname+"</span>");
		  });

		  $.each( that.ruleset.stats, function( id, item){
		    list_header.append("<span class='st'>"+item.shortname+"</span>");
		  });
  

		  calc.canvas.find('#acUnitsHeader').html( "" );
		  calc.canvas.find('#acUnitsHeader').append( list_header );
		  
		  calc.model = that.ruleset.models[modelSelect.val()];
		  calc.army = new acInstance( that, that.ruleset, null, calc.model );

		  calc.army.maxCosts = {};
		  for( id in calc.ruleset.costs ){
			calc.army.maxCosts[id] = that.ruleset.costs[id].input.val();
		  }
		  
		
		  var menu_ul_by_id = {};
		  /* we are buliding the menu and populating the menu_ul_by_id table */
		  /* TODO make this recurrent to populate multiple menu levels? */
		  $.each(calc.model.mainmenu,function( id, item ){
			
			menu_ul_by_id[id] = $("<ul class='submm'></ul>");

			var menu_elem = $("<a href='#'>"+item.name+"</a>");

			calc.canvas.find('#acElements').append(
				$("<li></li>")
				  .append(menu_elem)
				  .append(menu_ul_by_id[id])
				  .hover(function(){ $(this).children("ul").show();},function(){$(this).children("ul").hide();})
			);
			
			$.each(item.submenus,function( child_id, child ){
				menu_ul_by_id[child_id] = $("<ul class='submm'></ul>");
				var menu_elem = $("<a href='#'>"+child.name+"</a>");
				
				menu_ul_by_id[id].append(
					$("<li></li>")
					  .append(menu_elem)
					  .append(menu_ul_by_id[child_id])
					  .hover(function(){ $(this).children("ul").show();},function(){$(this).children("ul").hide();})
				);
			  
			});
		  
		  });

		  /* we are appending all elements that have menu defined to the menu*/
		  $.each(calc.army.element.elements,function( id, item ){
			$.each(item.elements,function( id, item ){
			  if(item.menu_id){
				var appendButton = $("<a href='#'>"+item.name+"</a>");
				menu_ul_by_id[item.menu_id].append($("<li></li>").append(appendButton));
				appendButton.click( function(){ 
					calc.army.append( id ); 
					$('.submm').hide();
				} );
			  }
			});
		  });

		  //in case a model does not define any units for a menu we remove it from the dom tree
		  $.each(menu_ul_by_id,function( id, item ){
				if($(item).children('li').length == 0)
				  $(item).parent().remove();
		  });




		});

		body.append($("<div class='submit'></div>").append(createButton));  
	
		this.popup( "New army - " + this.ruleset.name, body );

	};

	calc.setFullscreen = function( fs ){
		
		var that = this;
		$('body').toggleClass('acFullscreen',fs);
		this.canvas.toggleClass('acFullscreen',fs);
		this.canvas.find('#acMaximize').toggle( !fs );
		this.canvas.find('#acMinimize').toggle( fs );
	
		if(fs){
			$(window).resize(function(){
				var hhh = $(window).height()-80;
				that.canvas.find('.unitslist').height(hhh);
			});
			$(window).resize();
		}
		else {
			this.canvas.find('.unitslist').height(200);
			$(window).unbind('resize');
		}


	};

	//this will be run after ebbedding calculator inside desktop application
	calc.setEmbedded = function( eb ){
		if( eb ){
			this.setFullscreen(true);
			//TODO hide unnecesairy icons
			calc.canvas.find('#acMinimize').hide();
			calc.canvas.find('.buttons1').hide();
		}
	}

	return calc;
}


/*
Prevent user to close a browser tab with an unsaced army.
*/
function goodbye(e) {

/*if( acarmyid && ( ! ($(saveimage).hasClass('savedisabled')))){
				
	if(!e) e = window.event;
	
	e.cancelBubble = true;
	e.returnValue = 'Army have unsaved changes that will be lost.\nTo save army press cancel and use save button.';
	
	if (e.stopPropagation) {
		e.stopPropagation();
		e.preventDefault();
	}
}*/

}

// in IE this will also work on javascript: anchors
if (navigator.appName != 'Microsoft Internet Explorer') 
	window.onbeforeunload = goodbye;


