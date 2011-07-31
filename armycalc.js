// IE fixes for armycalc to work
//##########################
// credits: http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}



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



//jQuery required extensions
//color
(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.curCSS(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);




//clone prototype. for cloning elements with extedn attribute
function acClone( object ){
  var newObj = (this instanceof Array) ? [] : {};
  for (i in object) {
    if (typeof object[i] == "object") 
      newObj[i] = acClone(object[i]);
    else 
	  newObj[i] = object[i];
  } 
  return newObj;
};



function acSandbox( code, params ){
	
	//TODO safe quote!
	new Function("window", "with(window){" + code + "}")( params ); 
	
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
			'default' : parseFloat($(this).children('default').text()),
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
			'default' : parseInt($(this).children('default').text())
		  };
	});
	
	this.defaultArmyName = acGetText($(xml).children('defaultArmyName'));
		
	this.defaultArmySize = {};

	$(xml).children('defaultArmySize').children('cost').each(function(){
		  that.defaultArmySize[$(this).attr('id')] = $(this).text();
	});

	this.models = {}
		

	this.mainmenu = {}
	$(xml).children('mainmenu').children('menu').each(function(){
		  
		  menu_id = $(this).attr('id');

		  that.mainmenu[menu_id] = {};
		  that.mainmenu[menu_id]['name'] = acGetText( $(this).children('name') );
		  that.mainmenu[menu_id]['submenus'] = {};
		  
		  $(this).children('menu').each(function(){	
			that.mainmenu[menu_id]['submenus'][$(this).attr('id')] = {};
			that.mainmenu[menu_id]['submenus'][$(this).attr('id')]['name'] = acGetText( $(this).children('name') );
		  });

	});
	
	//Loading errors
	this.errors = {}
	$(xml).children('errors').children('error').each(function(){

		  that.errors[$(this).children('uid').text()] = {
			'class': $(this).attr('class'),
			'message': acGetText( $(this).children('message') )
			}
	});


	
	$(xml).children('models').find('model').each(function(){
		  
		  model_id = $(this).attr('id');
		  
		  that.models[model_id] = {
			name : acGetText($(this).children('name')),
			'default' : $(this).attr('default') == 'true'
		  };
		  
		  that.models[model_id].elements = [];
		  that.models[model_id].elements_by_uid = {};
		  
		  that.models[model_id].validator = "";	
	
		  $.ajax({
				model_id: model_id,
				url: baseurl + $(this).children('validator').attr('src'),
				success: function(text){ that.models[this.model_id].validator = text },
				error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
				dataType: 'text'
		  });

		  $(this).find('elements').each(function(){
			that.appendElements( baseurl, this, that.models[model_id].elements, that.models[model_id].elements_by_uid);
		  });

		  
		  that.models[model_id].mainmenu = that.mainmenu;	

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

  this.appendElements = function( baseurl, xml, elements, elements_by_uid){
	 
	  that = this;

	  if($(xml).attr('src')){

		  $.ajax({
			  url: baseurl + $(xml).attr('src'),
			  success: function( xml ){ that.appendElements( baseurl, $(xml).children('elements') , elements, elements_by_uid); },
			  error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
			  dataType: 'xml'
		  });
	  
	  } else {

		var elements_group = {};

		//TODO overloading this options with
		elements_group.minTotalCount = ($(xml).attr('minTotalCount')?parseInt($(xml).attr('minTotalCount')):0);
		elements_group.maxTotalCount = ($(xml).attr('maxTotalCount')?parseInt($(xml).attr('maxTotalCount')):null);
		elements_group.minTotalSize = ($(xml).attr('minTotalSize')?parseInt($(xml).attr('minTotalSize')):0);
		elements_group.maxTotalSize = ($(xml).attr('maxTotalSize')?parseInt($(xml).attr('maxTotalSize')):null);
		elements_group.elements = {};
		
		//this by default will contain concatenated elements names
		elements_group.name = "";

		$(xml).children('element').each(function(){

			
			if($(this).attr('extend') && ($(this).attr('extend') in elements_by_uid) ){
				var element = acClone( elements_by_uid[$(this).attr('extend')] );
			} else {
				var element = {};
			}

			if( $(this).children('uid').length > 0 )
			  element.uid = $(this).children('uid').text();

			if( $(this).children('menu').length > 0 )
			  element.menu_id = $(this).children('menu').attr('id');

			if( $(this).children('name').length > 0 )
			  element.name = acGetText($(this).children('name'));
			
			elements_group.name = elements_group.name + element.name + ", ";
			
			if( $(this).children('description').length > 0 )
			  element.description = acGetText($(this).children('description'));

			if( $(this).children('thumbnail').length > 0 )
			  element.thumbnail = "<img src='" + baseurl + $(this).children('thumbnail').attr('src') + "' />";

			//HOOKS
			if(! ('afterAppend' in element ))
			  element.afterAppend = ($(this).attr('afterAppend')?$(this).attr('afterAppend'):0);
			if(! ('beforeRemove' in element ))
			  element.beforeRemove = ($(this).attr('beforeRemove')?$(this).attr('beforeRemove'):0);

			//alert(element.uid);
			//element.child = [];
			if(! ('elements' in element ))
			  element.elements = [];
			
		
			function loadAttr( element, xml, name, def, parse ){
				if(!(name in element))
				  element[name] = def;

				if( xml.attr( name ) )
				  if( parse )
					element[name] = parseInt(xml.attr(name));
				  else
					element[name] = xml.attr(name);

			}

			loadAttr( element, $(this), 'minCount', 0, true );
			loadAttr( element, $(this), 'maxCount', null, true );
			loadAttr( element, $(this), 'minSize', 1, true );
			loadAttr( element, $(this), 'maxSize', null, true );
			loadAttr( element, $(this), 'defaultSize', element.minSize, true );
			loadAttr( element, $(this), 'size', 'custom', false );


			//element.minCount = ($(this).attr('minCount')?parseInt($(this).attr('minCount')):0);
			//element.maxCount = ($(this).attr('maxCount')?parseInt($(this).attr('maxCount')):null);	
			//element.minSize = ($(this).attr('minSize')?parseInt($(this).attr('minSize')):1);
			//element.maxSize = ($(this).attr('maxSize')?parseInt($(this).attr('maxSize')):null);
			//element.defaultSize = ($(this).attr('defaultSize')?parseInt($(this).attr('defaultSize')):element.minSize);
			//element.size = ($(this).attr('size')?$(this).attr('size'):'custom');
			

			element.cost = {};
			for(id in that.costs)
			  element.cost[id] = that.costs[id]['default'];
			
			$(this).children('cost').each(function(){
			  element.cost[$(this).attr('id')] = parseFloat( $(this).text() );
			});
			
			if( $(this).children('stats').length > 0 ){

			  element.stats = {};
			  for(id in that.stats)
				element.stats[id] = that.stats[id]['default'];

			  $(this).children('stats').children('stat').each(function(){
				element.stats[$(this).attr('id')] = parseInt($(this).text());
			  });
			}

			$.each( $(this).children('elements'), function( id, item){
			  
			  that.appendElements( baseurl, item, element.elements, elements_by_uid );
			  
			});

			elements_group.elements[ element.uid ] = element;
			elements_by_uid[ element.uid ] = element;
		});

	  elements.push( elements_group );
	  
	}

	  
  }


}


function acInstance( calc, ruleset, parent, element ){

	var that = this;
	this.parent = parent;
	this.isArmy = ( this.parent == null );
	this.calc = calc;
	this.army = calc.army;
	this.ruleset = ruleset;


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



	  $.each( this._costs_spans, function( id, item){
		if( that._size * that.element.cost[id] > 0 )
		  item.text( that._size * that.element.cost[id] );
		else 
		  item.html( '&nbsp;' );
	  });
	
	  //$each()

	}

	this.stat = function( statid, newvalue ){
	

		if( typeof newvalue === 'undefined' )
			return this._stats[ statid ];
		
		if( statid in this._stats ){
			this._stats[ statid ] = newvalue;
			this._stats_spans[ statid ].text( this._stats[statid] );
		}
	  	
	}

	this._rebuildSubmenu = function(){
	  
	  
	}
	
	this._rebuildListElem = function(){
	  
	}


	if(! this.isArmy ){
	
	  this._subul = $("<ul></ul>");
	  this._dom_size = $("<span>" + this._size + "</span>");

	  this._anchor = $("<a href='#'> x "+this.name+"</a>").prepend( this._dom_size );
 
	  this._costs_spans = {};

	  $.each( this.ruleset.costs, function( id, item){
		  
		  that._costs_spans[ id ] = $("<span class='cst'>"+"</span>");
		  that._anchor.append( that._costs_spans[ id ] );

	  } );


	  this._stats_spans = {};
	
	  if( this.element.stats ){

		this._stats = {};
		for(id in this.element.stats)
				this._stats[id] = this.element.stats[id];
		
		$.each( this.ruleset.stats, function( id, item){
		  
		    that._stats_spans[ id ] = $("<span class='st'>"+that._stats[id]+"</span>");
			that._anchor.append( that._stats_spans[ id ] );

		});
	  }
  

	  this._li = $("<li></li>").append(this._anchor).append(this._subul);

	  

	  //TODO
	  //should we keep submenus in memory or generate them on the fly on each click?
	  this._submenu = $("<ul></ul>");
	  
	  if(this.element.thumbnail)
		this._submenu.append($("<li>"+this.element.thumbnail+"</li>"));

	  if(this.element.description)
		this._submenu.append($("<li>"+this.element.description+"</li>"));


	  //this._submenu.append($("<li><b>append:</b></li>"));
	
	  $.each(this.element.elements,function( id, item ){
		  $.each( item.elements, function( id, item ){
			  var button = $("<a href='#'>"+item.name+"</a>");
			  button.click( function(){ that.append(id);} );
			  that._submenu.append($("<li></li>").append(button));
		  });
	  });
	  
	  calc.submenuElem.append(this._submenu);
	
	  this._submenu.hide();
	  
	  this._anchor.click(function(){ that._focus(); return false; });


	} else {

	  this._subul = $('#acUnits');

	}

	this._errorsul = $("<ul class='errors'></ul>");
	  
	
	this.clear =  function() { 
		this.child={} 
		var that = this;
		$.each( this.element.elements, function( id, item ){
		  $.each( item.elements, function( id, item ){
			that.child[id] = [];
		  });
		});
		
	}

	this.clear();

	this.toggleError = function( uid, on ){

		this._errorsul.find( '.' + uid ).remove();
		if(on)
		  this._errorsul.append( "<li class='" + uid + " " + this.ruleset.errors[uid]['class'] + "'>" + this.ruleset.errors[uid]['message'] + "</li>" );
	}

	this.remove = function(){
		
		//checking if minCount was reached
		if( this.parent.child[this.element.uid].length > this.element.minCount ){
		  
		  if( this.element.beforeRemove )
			  acSandbox( this.element.beforeRemove, { 'that':this, 'army':this.army } );

		  this.clear();
		  this.parent.child[this.element.uid].splice( this.parent.child[this.element.uid].indexOf( this ), 1 );
		  this._li.remove();
		  this._submenu.remove();

		} else
		  this.calc.flashMsg( "Minimum count of "+this.element.name+" is "+this.element.minCount );
	}

	
	this.count = function( uid ) {
	  
	  if( typeof uid === 'undefined' )
		return this.parent.child[this.element.uid].length;
	
	  if(uid in this.child)
		return this.child[uid].length;

	  return 0;
	}

	this.append = function( uid ) {

		var element_to_append = null;
		var that = this;

		$.each( this.element.elements, function( id, item ){
		  if(item.elements[uid]){
			element_to_append = item.elements[uid];
			//check if element group total count is reached
			var elements_group_count = 0;
			$.each( item.elements, function( id, item){
				elements_group_count += that.child[id].length;
			});
			//if so we do not append
			if( elements_group_count === item.maxTotalCount){
			  that.calc.flashMsg("Maximum total count of group "+item.name+" reached ("+item.maxTotalCount+")");
			  element_to_append = null;
			}  
		  }
		});
	
		if(!element_to_append)
			return;
	
		//checking if maxCount was reached
		if( (element_to_append.maxCount == null) || (this.child[uid].length < element_to_append.maxCount) ){

		  var instance = new acInstance( calc, ruleset, this, element_to_append );
		  this.child[uid].push( instance );
		  this._subul.append( instance._li );
		  if(element_to_append.size === 'inherit')
			  instance.size(this._size);

		  //HOOKS
		  if( element_to_append.afterAppend )
			acSandbox( element_to_append.afterAppend, { 'that':instance, 'army':this.army } );
		
		} else
		  this.calc.flashMsg("Maximum count of "+element_to_append.name+" reached ("+element_to_append.maxCount+")");
	}
	
	
	this._focus = function(){

	  calc.submenuElem.children().hide();
	  that._submenu.show();

	  if(typeof(_focused_element) !== 'undefined') 
		_focused_element._anchor.removeClass('focus');

	  _focused_element = this;
	  _focused_element._anchor.addClass('focus');

	  $('#acUp').toggle(_focused_element._li.prev().length > 0);
	  $('#acDown').toggle(_focused_element._li.next().length > 0);
	
	  $('#acDec').toggle( (that.element.size === 'custom') && (that.size() != that.element.minSize) );
	  $('#acInc').toggle( (that.element.size === 'custom') && (that.size() != that.element.maxSize) );
	  $('#acRem').toggle( true );
	
	}
	
	//we check if any child element has minCount and append it if so.
	$.each( this.element.elements,function( id, item ){
	  $.each( item.elements, function( id, item ){
		for(var i=0;i<item.minCount;i++)
		  that.append(id);
	  });
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
	calc.canvas.find('#acRevalidate').click(function(){calc.revalidate(); return false;});
	
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


