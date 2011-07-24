
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
			
			element.minSize = ($(this).attr('minSize')?$(this).attr('minSize'):1);
			element.maxSize = ($(this).attr('maxSize')?$(this).attr('maxSize'):null);
			element.defaultSize = ($(this).attr('defaultSize')?$(this).attr('defaultSize'):element.minSize);
			
			element.size = ($(this).attr('size')?$(this).attr('size'):'custom');
	


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


function acInstance( parent, element ){

	var that = this;
	this.parent = parent;
	this.isArmy = ( this.parent == null );

	this.element = element;
	this.name = element.name;


	this._size = parseInt( element.defaultSize );

	this.size = function( newsize ){
	  if( typeof newsize === 'undefined' )
		return this._size;

	  
	  this._size = newsize;
	  this._dom_size.html( this._size );

	  $.each( this.child, function( id, item ){
		  $.each( item, function( id, item ){
			if(item.element.size === 'inherit')
			  item.size(newsize);
		  });
	  });

	  if((typeof(_focused_element) !== 'undefined') && (_focused_element == this )){
	    $('#acDec').toggle( this.size() != this.element.minSize );
		$('#acInc').toggle( this.size() != this.element.maxSize );
	  }
	  //$each()

	}


	this._rebuildSubmenu = function(){
	  
	  
	}
	
	this._rebuildListElem = function(){
	  
	}


	if(! this.isArmy ){
	
	  this._subul = $("<ul></ul>");
	  this._dom_size = $("<span>" + this._size + "</span>");

	  this._anchor = $("<a href='#'> x "+this.name+"</a>").prepend( this._dom_size );
  
	  this._li = $("<li></li>").append(this._anchor).append(this._subul);

	  //TODO
	  //should we keep submenus in memory or generate them on the fly on each click?
	  this._submenu = $("<ul><li><b>description:</b></li></ul>");
	  this._submenu.append($("<li>"+this.element.description+"</li>"));

 
	  this._submenu.append($("<li><b>append:</b></li>"));
	
	  $.each(this.element.elements,function( id, item ){
			  var button = $("<a href='#'>"+item.name+"</a>");
			  button.click( function(){ that.append(id);} );
			  that._submenu.append($("<li></li>").append(button));
	  });
	  
	  calc.submenuElem.append(this._submenu);
	
	  this._submenu.hide();
	  
	  this._anchor.click(function(){ that._focus(); return false; });


	} else {

	  this._subul = $('#acUnits');

	}

	
	this.clear =  function() { 
		this.child={} 
		var that = this;
		$.each( this.element.elements, function( id, item ){
		  that.child[id] = [];
		} );
		
	}

	this.clear();

	this.remove = function(){
		
		//checking if minCount was reached
		if( this.parent.child[this.element.uid].length > this.element.minCount ){

		  this.clear();
		  this.parent.child[this.element.uid].splice( this.parent.child[this.element.uid].indexOf( this ), 1 );
		  this._li.remove();
		  this._submenu.remove();

		}
	}

	this.append = function( uid ) {

		//alert(uid);
		if(!this.element.elements[uid])
			return;

		//checking if maxCount was reached
		if( (this.element.elements[uid].maxCount == null) || (this.child[uid].length < this.element.elements[uid].maxCount) ){

		  var instance = new acInstance( this, this.element.elements[uid] );
		  this.child[uid].push( instance );
		  this._subul.append( instance._li );
		
		}
	}
	
	
	this._focus = function(){

	  calc.submenuElem.children().hide();
	  that._submenu.show();

	  if(typeof(_focused_element) !== 'undefined') 
		_focused_element._anchor.removeClass('focus');

	  _focused_element = this;
	  _focused_element._anchor.addClass('focus');

	  $('#acDec').toggle( (that.element.size === 'custom') && (that.size() != that.element.minSize) );
	  $('#acInc').toggle( (that.element.size === 'custom') && (that.size() != that.element.maxSize) );
	  $('#acRem').toggle( true );
	
	}
	
	//we check if any child element has minCount and append it if so.
	$.each( this.element.elements,function( id, item ){
	  for(var i=0;i<item.minCount;i++)
		that.append(id);
	});


	if(! this.isArmy )
	  this.size( parseInt( element.defaultSize ) );

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
	
	calc.canvas.find('#acDec').click( function(){ _focused_element.size(_focused_element.size()-1); return false;});
	calc.canvas.find('#acInc').click( function(){ _focused_element.size(_focused_element.size()+1); return false;});
	calc.canvas.find('#acRem').click( function(){ _focused_element.remove(); return false;});
	  
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

		  calc.army = new acInstance( null, that.ruleset.models[modelSelect.val()] );

		  calc.army.maxCosts = {};
		  for( id in calc.ruleset.costs ){
			calc.army.maxCosts[id] = that.ruleset.costs[id].input.val();
		  }

		  $.each(calc.army.element.elements,function( id, item ){
			var appendButton = $("<a href='#'>"+item.name+"</a>");
			calc.canvas.find('#acElements').append($("<li></li>").append(appendButton));
			appendButton.click( function(){ calc.army.append( id ); } );
		  });


		});

		body.append($("<div class='submit'></div>").append(createButton));  
	
		this.popup( "New army - " + this.ruleset.name, body );

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


