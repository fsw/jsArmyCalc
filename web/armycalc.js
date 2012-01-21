

/*
jsArmyCalc constructor
selector is a jquery selector string that is to return a single dom element
$template url can be used to customize calc template
*/


var ArmyCalc = (function(){
	
function ArmyCalc(selector, templateurl){
	
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
};

	return ArmyCalc;

}).call({});


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


(function(ArmyCalc){
	
	//this is a quick hack. this will require $ to be present in global scope. 
	//later on we will think about incorporating required jQuery functions here;
	ArmyCalc.$ = $;
	
})(ArmyCalc);
(function(ArmyCalc){
	//template
	ArmyCalc.Instance = (function(){
		
		function Instance(template){
			var instance = {};
			instance.t = template;
			instance.children = [];
			instance.stats = {};
			return instance;
		}
		
		Instance.injectClassMethods = function( twrReader ){
			for (var method in TwrReader.prototype){
				if (TwrReader.prototype.hasOwnProperty( method )){
					twrReader[ method ] = TwrReader.prototype[ method ];
				}
			}
			return( twrReader );
		};
		
		Instance.prototype = {
			resize : function( size ){
				
			},
			append : function( id ){ 
				return true;
			},
			remove : function( id ){ 
				return true;
			},
			setStat : function( id ){ 
				return true;
			},
			getStat : function( id ){ 
				return true;
			}
		};
		
		return Instance;
		
	}).call({});
	
})(ArmyCalc);
(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(type, id, parent){
			//TODO xml can be id
			var template = {};
			template.type = type;
			template.id = id;
			template.parent = parent;
			template.children = {};
			template.enabled = true;
			template.stats = true;
			return template;
		}

		Template.prototype = {
			enable : function( value ){ 
				template.enabled = true;
				return true;
			},
			disable : function(){
				template.enabled = false;
				return true;
			},
			append : function( template ){
				
			}
		};

		return Template;
	}).call({});

})(ArmyCalc);
(function(ArmyCalc){

//Define the collection class.
ArmyCalc.TwrReader = (function(){
	// I am the constructor function.
	function TwrReader(options){
		var twrReader = Object.create(TwrReader.prototype);
		//TwrReader.injectClassMethods(twrReader);
		
		options = options || {};
		if(options.onProgress)
			twrReader.onProgress = options.onProgress;
		if(options.onLoaded)
			twrReader.onLoaded = options.onLoaded;
		twrReader.clear();
		return( twrReader );
	}

	// ------------------------------------------------------ //
	//Define default fetch methods.
	TwrReader.onProgress = function( percent ){
		return null;
	};
	// ------------------------------------------------------ //
	// Define the class methods.
	TwrReader.prototype = {
		clear : function() {
			
			this.identity = {};
			this.languages = {};
			this.info = {};
			this.armies = {};
			this.elementsById = {};
			this.scripts = [];
			this.languages = {};
			this.elementsQueue = [];
			this.languagesQueue = [];
			this.toLoadCount = 0;
		},
		load : function( path ){
			var that = this;
			this.path = path;
			this.setProgress(0);
			$.get(this.path + 'info.xml',function(data){that.loadInfoXml(data);},'xml'); 
			
			return true;
		},
		setProgress : function(progress){
			if (this.onProgress){
				this.onProgress(progress);
			}
		},
		loadInfoXml : function(data){
			var that = this;
			this.clear();
			
			var data = $(data).children('ruleset');
			
			this.identity.uid = $(data).children('identity').children('uid').text();
			this.identity.revision = $(data).children('identity').children('revision').text();
			this.identity.origin = $(data).children('identity').children('origin').text();
			this.identity.url = $(data).children('identity').children('url').text();
			
			this.info.name = $(data).children('info').children('name').text();
			this.info.author = {
				name : $(data).children('info').children('author').children('name').text(),
				email : $(data).children('info').children('author').children('email').text()	
			};
			this.info.description = $(data).children('info').children('description').text();
			
			var elements = $(data).children('data').children('elements').children('elements');
			elements.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.elementsQueue.push($(elem).attr('src'));
					var index = that.elementsQueue.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						$(data).children('elements').each(function(){
							that.elementsQueue[index] = this;
						});
						that.fileLoaded();
						},'xml'); 
				} else
					that.elementsQueue.push(elem);
			});
			
			var scripts = $(data).children('data').children('scripts').children('script');
			scripts.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.scripts.push($(elem).attr('src'));
					var index = that.scripts.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						that.scripts[index] = data;
						that.fileLoaded();
						},'text'); 
				} else
					that.scripts.push($(elem).text());
			});
			
			var languages = $(data).children('data').children('languages').children('language');
			languages.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.languagesQueue.push($(elem).attr('src'));
					var index = that.languagesQueue.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						that.languagesQueue[index] = $(data).children('language').first();
						that.fileLoaded();
						},'xml'); 
				} else
					that.languagesQueue.push(elem);
			});
			this.toLoadCount++;
			this.fileLoaded();
		},
		fileLoaded : function(){
			this.toLoadCount --;
			var all = this.elementsQueue.length + this.scripts.length + this.languagesQueue.length;
			this.setProgress(((all - this.toLoadCount) / all) * 50);
			if (this.toLoadCount == 0)
				this.loadFiles();
		},
		fileProcessed : function(){
			this.toProcessCount --;
			this.setProgress(50 + (((this.toProcessAll - this.toProcessCount) / this.toProcessAll) * 50));
		},
		loadFiles : function(){
			var that = this;
			this.setProgress(50);
			this.elements = {};
			this.toProcessAll = this.toProcessCount = this.elementsQueue.length + this.languagesQueue.length + this.scripts.length;
			for (i = 0; i < this.elementsQueue.length; i++) {
				this.appendElements(this.elementsQueue[i], this);
				this.fileProcessed();
			}
			this.setProgress(100);
		},
		appendElements : function(xml, root){
			var that = this;
			alert(xml.tagName);
			$(xml).children('group element').each(function(i, elem) {
				//tu cała logika!
				var parent = null;
				if($(elem).attr('parent'))
					parent = that.elementsById[$(elem).attr('parent')];
				
				var template = new ArmyCalc.Template($(elem).tagName, $(elem).attr('id'), parent);
				
				root[template.id] = template;
				that.elementsById[template.id] = template;
				that.appendElements(elem, template.children);
			});
			$(xml).children('deadend').each(function(i, elem) {
				delete root[$(elem).attr('id')];
			});
		},
		save : function(){
			var info = TwrReader.buildXml({
				'identity': this.identity
			});
			this.putFile('info', info);
			return true;
		},
		loaded : function(){
			alert('loaded');
		}
		
	};

	// ------------------------------------------------------ //
	return( TwrReader );

}).call({});



})(ArmyCalc);

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




//clone prototype. for cloning elements with extend attribute
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



function acPrintText( content ){
  
  var WindowObject = window.open('', "TrackHistoryData",
  "width=420,height=225,top=250,left=345,toolbars=no,scrollbars=no,status=no,resizable=no");
  WindowObject.document.write( content );
  WindowObject.document.close();
  WindowObject.focus();
  WindowObject.print();
  WindowObject.close();
}



function acSandbox( code, params ){
	
	//TODO safe quote!
	new Function("window", "with(window){" + code + "}")( params ); 
	
}

