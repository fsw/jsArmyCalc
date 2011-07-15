

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

	calc.canvas.find('#acMaximize').click(function(){calc.setFullscreen(true); return false;});
	calc.canvas.find('#acMinimize').click(function(){calc.setFullscreen(false); return false;});
	
	calc.canvas.find('#acNew').click(function(){calc.newArmy(); return false;});
	
	
	Instance = function( data, subUL, root ){
	  
	  this.name = data.name;
	  
	  this.clear =  function() { 
		this.child={} 
	  }

	  this.data = data;
  
	  this.append = function(uid) {

		//alert(uid);
		if(!this.data.elements[uid])
		  return;
		  
		if(!this.instances[uid])
		  this.instances[uid] = [];

		var ul = $("<ul></ul>");

		var instance = new Instance(this.data.elements[uid],ul);

		this.instances[uid].push( instance );

		anchor = $("<a href='#'>"+this.data.elements[uid].name+"</a>");
		instance.submenu = $("<ul><li>submenu</li></ul>");
		  
		$.each(this.data.elements[uid].elements,function( id, item ){
			var button = $("<a href='#'>"+item.name+"</a>");
			button.click( function(){ instance.append(id);} );
			instance.submenu.append($("<li></li>").append(button));
		});
  
		this._ul.append($("<li></li>").append(anchor).append(ul));


		calc.submenuElem.append(instance.submenu);
		instance.submenu.hide();
		
		anchor.click(function(){
		  calc.submenuElem.children().hide();
		  instance.submenu.show();
		});

		//TODO error
	  }

	  this._ul = subUL;

	  this.instances = {};

	  //for( i in data.elements ){
		//this.instances[i] = {}
		//this.elements[i] = new Element(data.elements[i],null);
	  //}
	
	}
	//this is a 
	calc.army = {
	  maxCosts: {}
	};
	
	calc.units = [];
	calc.availableUnits = {};
	

	calc.closePopup = function(){
		this.canvas.find('#acPopup').fadeOut(); 
		this.canvas.find('#acPopupBg').fadeOut(); 
	}

	calc.popup = function( title, body, block ){
		
		this.canvas.find('#acPopupTitle').text( title );
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


	calc.setStatus('no TWR file loaded');			

	calc.setError = function( text ){
		this.statusElem.html('<b style="color:red">'+text+'</b>');
	}
	
	xhrError = function( jqxhr, text, error ){
		this.calc.setError( this.url+' - '+text + ' - ' + error );
	}

	getText = function( xml, lang ){

	  txt = '';

	  $(xml).contents().each(function(){
	
		if((this.nodeType==3) && (!this.isElementContentWhitespace) && (!txt))
		  txt = this.wholeText;
		if((this.nodeType!=3) && ($(this).attr('ln')==lang))
		  txt = $(this).text();
		
	  });
	
	  return $.trim(txt);
	}


	calc.loadElements = function( xml, elements, lang ){
	  

	  if($(xml).attr('src')){


		  $.ajax({
			  calc: calc,
			  url: calc.twrurl + $(xml).attr('src'),
			  success: function( xml ){ calc.loadElements( $(xml).children('elements') , elements, lang ); },
			  error: xhrError,
			  dataType: 'xml'
		  });
	  
	  } else {
	
		$(xml).children('element').each(function(){

			var element = {};
			element.uid = $(this).children('uid').text();
			

			element.name = getText($(this).children('name'),lang);
			element.description = getText($(this).children('description'),lang);

			//alert(element.uid);
			//element.child = [];
			element.elements = {};
			
			
			element.minCount = ($(this).attr('minCount')?$(this).attr('minCount'):0);
			element.maxCount = ($(this).attr('maxCount')?$(this).attr('maxCount'):null);
	
			element.stats = {};
			for(id in calc.ruleset.stats)
			  element.stats[id] = calc.ruleset.stats[id].default;

			$(this).children('stats').children('stat').each(function(){
			  element.stats[$(this).attr('id')] = $(this).text();
			});


			calc.loadElements( $(this).children('elements'), element.elements, lang );
			
			elements[ element.uid ] = element;

		});
	  
	  }

	  
	}

	calc.loadInfoXml = function( xml, textStatus, jqXHR, lang ){
		
		ruleset = {};
	

		if(!lang) {
		
		  lnSelect = $("<select></select>");
		  $(xml).children('ruleset').children('languages').children('language').each(function(){
			lnSelect.append("<option value='"+$(this).attr('id')+"'"+($(this).attr('default') == 'true' ?" selected='true'":"")+">"+$(this).find('name').text()+"</option>");
		  });
		  

		  lnButton = $("<input type='button' value='select'/>");

		  body = $("<div></div>");
		  
		  body.append(lnSelect);
		  body.append(lnButton);
		  
		  this.calc.popup("Select Language",body, function(){} );

		  lnButton.click( function(){ 
					calc.closePopup( );  
					calc.loadInfoXml( xml, textStatus, jqXHR, lnSelect.val());  
					} );
		 
		  return;
		}

		xml = $(xml).children('ruleset');

		ruleset.version = $(xml).attr('version');
		ruleset.uid = $(xml).children('uid').text();
		ruleset.revision = $(xml).children('revision').text();
	

		ruleset.name = getText($(xml).children('name'),lang);
		ruleset.description = getText($(xml).children('description'),lang);

		ruleset.costs = {};
		
		
		$(xml).children('costs').children('cost').each(function(){
		  ruleset.costs[$(this).attr('id')] = {
			name : getText($(this).children('name'),lang),
			shortname : getText($(this).children('shortname'),lang),
			unit : getText($(this).children('unit'),lang)
		  };
		});
		
		ruleset.stats = {};
		$(xml).children('stats').children('stat').each(function(){
		  ruleset.stats[$(this).attr('id')] = {
			display : ($(this).attr('display')==true?true:false),
			name : getText($(this).children('name'),lang),
			shortname : getText($(this).children('shortname'),lang),
			default : $(this).children('default').text()
		  };
		});

		ruleset.defaultArmyName = getText($(xml).children('defaultArmyName'),lang);
		
		ruleset.defaultArmySize = {};

		$(xml).children('defaultArmySize').children('cost').each(function(){
		  ruleset.defaultArmySize[$(this).attr('id')] = $(this).text();
		});

		ruleset.models = {}
		
		$(xml).children('models').find('model').each(function(){
		  
		  model_id = $(this).attr('id');
		  
		  ruleset.models[model_id] = {
			name : getText($(this).children('name'),lang),
			default : $(this).attr('default') == 'true'
		  };
		  
		  ruleset.models[model_id].elements = {};
		  
		  ruleset.models[model_id].validator = "";	
	
		  
		  $.ajax({
				calc: calc,
				url: calc.twrurl + $(this).children('validator').attr('src'),
				success: function(text){ ruleset.models[model_id].validator = text },
				error: xhrError,
				dataType: 'text'
			});

		  $(this).find('elements').each(function(){
			calc.loadElements(this,ruleset.models[model_id].elements, lang);
		  });

		  ruleset.models[model_id].defaultArmyName = ruleset.defaultArmyName;
		  ruleset.models[model_id].defaultArmySize = ruleset.defaultArmySize;
		  //overriding
		  if($(this).children('defaultArmyName').length)
			ruleset.models[model_id].defaultArmyName = getText($(this).children('defaultArmyName'),lang);
	 
		  $(this).children('defaultArmySize').children('cost').each(function(){
			ruleset.models[model_id].defaultArmySize[$(this).attr('id')] = $(this).text();
		  });
  
		});

				

		this.ruleset = ruleset;
	}

	calc.calcLoadUnitsXml = function( xml ){
		console.log(xml);
	}
	
	calc.loadTWR = function( url ){
		
		this.twrurl = url;
		this.units = [];
		this.availableUnits = [];
		
		this.setStatus( 'loading '+url );
	
		$.ajax({
			calc: this,
			url: url + 'info.xml',
			success: this.loadInfoXml,
			error: xhrError,
			dataType: 'xml'
		});

	};

	calc.newArmy = function( ){

		body = $('<div></div>');
		body.append("<p>"+this.ruleset.description+"</p>");
	
		modelSelect = $("<select></select>");
		
		for( id in this.ruleset.models )
			modelSelect.append("<option value='" + id + "'"+(this.ruleset.models[id].default ?" selected='true'":"")+">"
				+this.ruleset.models[id].name+"</option>");
		  

		createButton = $("<input type='button' value='create'/>");

		body.append(modelSelect);
	
		for( id in this.ruleset.costs ){
			this.ruleset.costs[id].input = $("<input name='cost[" + id + "]' value='0'/>");
			body.append($("<label>"+this.ruleset.costs[id].name+"</label>").append(this.ruleset.costs[id].input));
		}

		createButton.click(function(){
		  
		  calc.closePopup( );  
				
		  calc.army = new Instance( ruleset.models[modelSelect.val()], $('#acUnits'), true );

		  calc.army.maxCosts = {};
		  for( id in calc.ruleset.costs ){
			calc.army.maxCosts[id] = calc.ruleset.costs[id].input.val();
		  }


		  calc.canvas.find('#acElements').html();

		  $.each(calc.army.data.elements,function( id, item ){
			var appendButton = $("<a href='#'>"+item.name+"("+id+")</a>");
			calc.canvas.find('#acElements').append($("<li></li>").append(appendButton));
			appendButton.click( function(){ calc.army.append( id ); } );
		  });


		});

		body.append(createButton);  
	
		this.popup( "new army - " + this.ruleset.name, body );

	};

	calc.setFullscreen = function( fs ){
		
		$('body').toggleClass('acFullscreen',fs);
		this.canvas.toggleClass('acFullscreen',fs);
		this.canvas.find('#acMaximize').toggle( !fs );
		this.canvas.find('#acMinimize').toggle( fs );

	};
	
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


