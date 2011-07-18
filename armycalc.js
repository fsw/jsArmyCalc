
function acAddCSSRule(sel, prop, val) {
    for(var i = 0; i < document.styleSheets.length; i++){
        var ss    = document.styleSheets[i];
        var rules = (ss.cssRules || ss.rules);
        var lsel  = sel.toLowerCase();

        for(var i2 = 0, len = rules.length; i2 < len; i2++){
            if(rules[i2].selectorText && (rules[i2].selectorText.toLowerCase() == lsel)){
                if(val != null){
                    rules[i2].style[prop] = val;
                    return;
                }
                else{
                    if(ss.deleteRule){
                        ss.deleteRule(i2);
                    }
                    else if(ss.removeRule){
                        ss.removeRule(i2);
                    }
                    else{
                        rules[i2].style.cssText = '';
                    }
                }
            }
        }
    }

    var ss = document.styleSheets[0] || {};
    if(ss.insertRule) {
        var rules = (ss.cssRules || ss.rules);
        ss.insertRule(sel + '{ ' + prop + ':' + val + '; }', rules.length);
    }
    else if(ss.addRule){
        ss.addRule(sel, prop + ':' + val + ';', 0);
    }
}



function acGetText( xml ){

	txt = '';

	$(xml).contents().each(function(){

			if((this.nodeType==3) && (!this.isElementContentWhitespace))
			txt += this.wholeText;
			if((this.nodeType!=3))
			txt += "<span class='trans "+$(this).attr('ln')+"'>"+$(this).text()+"</span>";

			/*if((this.nodeType==3) && (!this.isElementContentWhitespace) && (!txt))
			  txt = this.wholeText;
			  if((this.nodeType!=3) && ($(this).attr('ln')==lang))
			  txt = $(this).text();*/

			});

	return $.trim(txt);
}




function acRuleset( calc ){

  this.calc = calc;
  //this.rootElement = new Element();

  
  //
  this.loadFromUrl = function( url ){

	that = this;

	$.ajax({
	  url: url + 'info.xml',
	  success: function( xml, textStatus, jqXHR ){ that.loadFromXml( url, xml ); },
	  error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
	  dataType: 'xml'
	});

  }

  //
  this.loadFromXml = function( baseurl, xml ){
  
	that = this;

	xml = $(xml).children('ruleset');
	
	
	this.calc.langSelect.html();

	$(xml).children('languages').children('language').each(function(){
		that.calc.langSelect.append("<option value='"+$(this).attr('id')+"'"+($(this).attr('default') == 'true' ?" selected='true'":"")+">"+$(this).find('name').text()+"</option>");
		if($(this).attr('default') == 'true')
		  that.calc.setLang($(this).attr('id'));
	});
		  

	this.version = $(xml).attr('version');
	this.uid = $(xml).children('uid').text();
	this.revision = $(xml).children('revision').text();
	

	this.name = acGetText($(xml).children('name'));
	this.description = acGetText($(xml).children('description'));

	this.costs = {};
		
	$(xml).children('costs').children('cost').each(function(){
		  that.costs[$(this).attr('id')] = {
			name : acGetText($(this).children('name')),
			shortname : acGetText($(this).children('shortname')),
			unit : acGetText($(this).children('unit'))
		  };
	});
		
	this.stats = {};
	
	$(xml).children('stats').children('stat').each(function(){
		  that.stats[$(this).attr('id')] = {
			display : ($(this).attr('display')==true?true:false),
			name : acGetText($(this).children('name')),
			shortname : acGetText($(this).children('shortname')),
			'default' : $(this).children('default').text()
		  };
	});
	
	this.defaultArmyName = acGetText($(xml).children('defaultArmyName'));
		
	this.defaultArmySize = {};

	$(xml).children('defaultArmySize').children('cost').each(function(){
		  that.defaultArmySize[$(this).attr('id')] = $(this).text();
	});

	this.models = {}
		
	
	$(xml).children('models').find('model').each(function(){
		  
		  model_id = $(this).attr('id');
		  
		  that.models[model_id] = {
			name : acGetText($(this).children('name')),
			'default' : $(this).attr('default') == 'true'
		  };
		  
		  that.models[model_id].elements = {};
		  
		  that.models[model_id].validator = "";	
	
		  $.ajax({
				url: baseurl + $(this).children('validator').attr('src'),
				success: function(text){ that.models[model_id].validator = text },
				error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
				dataType: 'text'
		  });

		  $(this).find('elements').each(function(){
			that.appendElements( baseurl, this, that.models[model_id].elements );
		  });

		  that.models[model_id].defaultArmyName = that.defaultArmyName;
		  that.models[model_id].defaultArmySize = that.defaultArmySize;
		  //overriding
		  if($(this).children('defaultArmyName').length)
			that.models[model_id].defaultArmyName = acGetText($(this).children('defaultArmyName'));
	 
		  $(this).children('defaultArmySize').children('cost').each(function(){
			that.models[model_id].defaultArmySize[$(this).attr('id')] = $(this).text();
		  });
  
	});

  
  }

  this.appendElements = function( baseurl, xml, elements ){
	 
	  that = this;

	  if($(xml).attr('src')){

		  $.ajax({
			  url: baseurl + $(xml).attr('src'),
			  success: function( xml ){ that.appendElements( baseurl, $(xml).children('elements') , elements ); },
			  error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
			  dataType: 'xml'
		  });
	  
	  } else {
	
		$(xml).children('element').each(function(){

			var element = {};
			element.uid = $(this).children('uid').text();
			

			element.name = acGetText($(this).children('name'));
			element.description = acGetText($(this).children('description'));

			//alert(element.uid);
			//element.child = [];
			element.elements = {};
			
			
			element.minCount = ($(this).attr('minCount')?$(this).attr('minCount'):0);
			element.maxCount = ($(this).attr('maxCount')?$(this).attr('maxCount'):null);
	
			element.stats = {};
			for(id in that.stats)
			  element.stats[id] = that.stats[id]['default'];

			$(this).children('stats').children('stat').each(function(){
			  element.stats[$(this).attr('id')] = $(this).text();
			});


			that.appendElements( baseurl, $(this).children('elements'), element.elements );
			
			elements[ element.uid ] = element;

		});
	  
	  }

	  
	}


}




function acElement( ){


}






function acArmy(){


}


acArmy.prototype = new acInstance();



function acInstance( parent, element ){

  this.parent = parent;
  
  this.available = [];
  this.children = [];

  this.childCount = function(){
	
  }

  this.append = function( uid ){
	
  }

  this.stat = function( id, value ){
	
  }

}






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

	calc.newArmy = function( ){

		that = this;

		body = $('<div></div>');
		body.append("<p>"+this.ruleset.description+"</p>");
	
		modelSelect = $("<select></select>");
		
		for( id in this.ruleset.models )
			modelSelect.append("<option value='" + id + "'"+(this.ruleset.models[id]['default'] ?" selected='true'":"")+">"
				+this.ruleset.models[id].name+"</option>");
		  

		createButton = $("<input type='button' value='create'/>");

		body.append(modelSelect);
	
		for( id in this.ruleset.costs ){
			this.ruleset.costs[id].input = $("<input name='cost[" + id + "]' value='0'/>");
			body.append($("<label>"+this.ruleset.costs[id].name+"</label>").append(this.ruleset.costs[id].input));
		}

		createButton.click(function(){
		  
		  calc.closePopup( );  
				
		  calc.army = new Instance( that.ruleset.models[modelSelect.val()], $('#acUnits'), true );

		  calc.army.maxCosts = {};
		  for( id in calc.ruleset.costs ){
			calc.army.maxCosts[id] = that.ruleset.costs[id].input.val();
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


