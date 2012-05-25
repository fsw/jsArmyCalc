
var ArmyCalc = (function() {

	/**
	* 
	*/
	function ArmyCalc(selector, templateurl) {
		var that = this;
		this.canvas = $(selector);
		this.canvas.attr('style','');
		this.canvas.html('loading calc...');
		// calc template is loaded with AJAX	
		var template = $.ajax({ url: templateurl, async: false }).responseText;
		this.canvas.html(template);
		
		this.statusElem = this.canvas.find('#acStatus');
		this.submenuElem = this.canvas.find('.submenu');
		this.langSelect = this.canvas.find('#acLang');
		this.langSelect.change(function(){ calc.setLang($(this).val()); });

		this.canvas.find('#acMaximize').click(function(){that.setFullscreen(true); return false;});
		this.canvas.find('#acMinimize').click(function(){that.setFullscreen(false); return false;});
		this.canvas.find('#acNew').click(function(){that.newArmy(); return false;});
		this.canvas.find('#acRevalidate').click(function(){that.revalidate(); return false;});
		this.canvas.find('#acPrint').click(function(){that.print(); return false;});

		this.canvas.find('#acDec').click(function(){ _focused_element.decSize(); return false;}).hide();
		this.canvas.find('#acInc').click(function(){ _focused_element.incSize(); return false;}).hide();
		this.canvas.find('#acRem').click(function(){ _focused_element.remove(); return false;}).hide();

		this.canvas.find('#acUp').click( function(){
				_focused_element._li.prev().before(  _focused_element._li );
				calc.canvas.find('#acUp').toggle(_focused_element._li.prev().length > 0);
				calc.canvas.find('#acDown').toggle(_focused_element._li.next().length > 0);
				return false;
				}).hide();
		this.canvas.find('#acDown').click( function(){
				_focused_element._li.next().after(  _focused_element._li );
				calc.canvas.find('#acUp').toggle(_focused_element._li.prev().length > 0);
				calc.canvas.find('#acDown').toggle(_focused_element._li.next().length > 0);
				return false;
				}).hide();
		
		this.twr = new ArmyCalc.TwrReader({
		  'onProgress' : function(percent){ that.setStatus('loading ' + that.twrUrl + ' (' + Math.round(percent) + '%)'); },
		  'onLoaded' : function(){ that.setStatus(that.twrUrl + ' loaded.'); }
		});
		
		this.army = null;

	};

	ArmyCalc.prototype = {

		closePopup : function(){
			this.canvas.find('#acPopup').fadeOut(); 
			this.canvas.find('#acPopupBg').fadeOut(); 
		},
		popup : function( title, body, block ){

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

		},
		setStatus : function( text ){
			this.statusElem.text(text);
		},
		flashMsg : function( text ){

			//this.statusElem.stop();
			//this.statusElem.hide();
			this.statusElem.html( text );
			//this.statusElem.fadeIn();
			this.statusElem.stop().css("background-color", "#ff0000").animate({backgroundColor: '#000000'}, 1000);

		},

		setLang : function( lang ){

			acAddCSSRule(".trans", "display", "none");


			//if a language was already set 
			if(this.lang)
				acAddCSSRule("."+this.lang+"", "display", "none");

			this.lang = lang;

			acAddCSSRule("."+lang+"", "display", "inline");

		},
		setError : function( text ){
			this.statusElem.html('<b style="color:red">'+text+'</b>');
		},
		loadTWR : function( url ){
			this.twrUrl = url;
			this.twr.load( this.twrUrl );
		},
		revalidate : function( ){
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

		},
		print : function( ){
			if(! this.army ){
				this.flashMsg( "Please create new army first!" );
				return;
			}
			acPrintText(this.canvas.find(".unitslist").html());
		},
		newArmy : function( ){

			that = this;
			var body = $('<div></div>');
			body.append("<div class='piece'><h3>" + this.twr.info.name + "</h3>" + this.twr.info.description + "</div>");
			var armySelect = $("<select></select>");
			for( id in this.twr.armies )
				armySelect.append("<option value='" + id + "'" + ">" + this.twr.armies[id].name + "</option>");
			var createButton = $("<input type='button' value='create'/>");
			body.append($("<label>Choose Army</label>").append(armySelect));

			var costInputs = {};
			for( id in this.twr.costs ){
				costInputs[id] = $("<input name='cost[" + id + "]' value='0'/>");
				body.append($("<label>"+this.twr.costs[id].name+"</label>").append(costInputs[id]));
			}
			
			createButton.click(function(){
					that.closePopup( );  
					that.canvas.find('#acElements').html('');
					that.canvas.find('#acUnits').html('');
					
					that.armyTemplate = that.twr.armies[armySelect.val()];
					that.army = new ArmyCalc.ArmyInstance( that.armyTemplate, {
						children: that.canvas.find('#acUnits'), 
						detailsContainer: that.canvas.find('#acDetails'),
						availableContainer: that.canvas.find('#acAvailable'),
						buttons: {
							dec : that.canvas.find('#acDec'),
							inc : that.canvas.find('#acInc'),
							rem : that.canvas.find('#acRem'),
							up : that.canvas.find('#acUp'),
							down : that.canvas.find('#acDown')
						}
					});
					for (id in costInputs ) {
						that.army.maxTotalCosts[id] = costInputs[id].val();
					}
			});

			body.append($("<div class='submit'></div>").append(createButton));  
			this.popup( "New army - " + this.twr.info.name, body );
			armySelect.focus();
		},
		setFullscreen : function( fs ){

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


		},

		//this will be run after ebbedding calculator inside desktop application
		setEmbedded : function( eb ){
			if( eb ){
				this.setFullscreen(true);
				//TODO hide unnecesairy icons
				calc.canvas.find('#acMinimize').hide();
				calc.canvas.find('.buttons1').hide();
			}
		}

	}

	return ArmyCalc;

}).call({});


// in IE this will also work on javascript: anchors
if (navigator.appName != 'Microsoft Internet Explorer') { 
	window.onbeforeunload = function(e){
		/*if( acarmyid && ( ! ($(saveimage).hasClass('savedisabled')))){
		  if(!e) e = window.event;
		  e.cancelBubble = true;
		  e.returnValue = 'Army have unsaved changes that will be lost.\nTo save army press cancel and use save button.';
		  if (e.stopPropagation) {
		  e.stopPropagation();
		  e.preventDefault();
		  }
		  }*/
	};
}

(function(ArmyCalc){
	
	//this is a quick hack. this will require $ to be present in global scope. 
	//later on we will think about incorporating required jQuery functions here;
	ArmyCalc.$ = $;
	
})(ArmyCalc);
(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(parent, id, proto){
			this.id = id;
			this.parent = parent;
			if (proto) {
			  this.stats = {};
			  this.clone( this.stats, proto.stats );
			  this.enabled = proto.enabled;
			  this.name = proto.name;
			  this.minSize = proto.minSize;
			  this.maxSize = proto.minSize;
			  this.defaultSize = proto.defaultSize;
			  
			  this.children = {};
			  for (var id in proto.children) {
				if (proto.children[id] instanceof ArmyCalc.ElementTemplate)
				  new ArmyCalc.ElementTemplate(this, id, proto.children[id]);
				else if (proto.children[id] instanceof ArmyCalc.GroupTemplate)
				  new ArmyCalc.GroupTemplate(this, id, proto.children[id]);		
			  }
			  this.proto = proto;
			} else {
			  this.children = {};
			  this.enabled = true;
			  this.stats = {};
			  this.name = 'Unnamed';
			  this.minSize = 1;
			  this.maxSize = null;
			  this.defaultSize = 1;
			}
			if(parent)
			  parent.children[this.id] = this;
		}

		Template.prototype = {
			clone : function( target, source ){
			  for(i in source)
				if (typeof source[i] != 'object')
				  target[i] = source[i];
				else
				  target[i] = this.clone({}, source[i]);
			  
			  return target;
			},
			enable : function( value ){ 
				template.enabled = true;
				return true;
			},
			disable : function(){
				template.enabled = false;
				return true;
			},
			append : function( template ){
				
			},
			_loadFromXml : function($elem){
				//this should not override prototype properties!
				(n = $elem.children('name').text()) || (n = $elem.attr('name'));
				if (typeof n != 'undefined') this.name = n;
				
				(d = $elem.children('description').text());
				if (typeof d != 'undefined') this.description = n;
				
				(min = $elem.attr('minSize'));
				if (typeof min != 'undefined') { this.minSize = parseInt(min); this.defaultSize = this.minSize; }
				
				(max = $elem.attr('maxSize'));
				if (typeof max != 'undefined') this.maxSize = parseInt(max);

				(def = $elem.attr('defaultSize'));
				if (typeof def != 'undefined') this.defaultSize = parseInt(def);
			},
			_createAppender : function(instance) {
				var a = $('<a href="#">' + this.name + '</a>');
				var that = this;
				a.click(function(){
				  instance.appendElement(that.id);
				  return false;
				});
				return $('<li></li>').append(a);
			}
		};

		return Template;
	}).call({});

})(ArmyCalc);
(function(ArmyCalc){
	ArmyCalc.Instance = (function(){
		
		function Instance(parent, template) {
			var that = this;
			if (parent instanceof ArmyCalc.Instance){
				this.parent = parent;
			}
			this.template = template;
			this.available = template.children;
			this.children = {};
			this.stats = {};
			for (var i in template.stats) {
			  this.stats[i] = template.stats[i];
			}
			
			this.maxTotalCosts = {};
			this.canvas = {};
			if (parent.canvas)
			{
			  this.canvas['children'] = parent.canvas['children'];
			  this.canvas['availableContainer'] = parent.canvas['availableContainer'];
			  this.canvas['detailsContainer'] = parent.canvas['detailsContainer'];
			  this.canvas['buttons'] = parent.canvas['buttons'];

			  if (typeof parent.canvas.children != 'undefined'){
				var anchor = $('<a href="#">' + template.name + '</a>');
				this.sizeSpan = $('<span></span>');
				this.folder = $('<span class="folder">&nbsp;</span>');
				anchor.prepend(this.sizeSpan);
				anchor.prepend(this.folder);
				this.li = $('<li></li>').append(anchor);
				this.canvas.children = $('<ul></ul>');
				anchor.click(function(){that.focus();});
				this.folder.click(function(){that.toggleFold();});
				parent.canvas.children.append(this.li.append(this.canvas.children));
			  }
			}

			this.canvas.available = $('<ul></ul>');	
			this.canvas.details = $('<div> ... details ... </div>');
			
			this.costs = {};
			if (this.parent)
			{
				this.setSize(template.defaultSize);
			}			
			//TODO append all required childrens
			for (var i in template.children) {
			  if(template.children[i] instanceof ArmyCalc.GroupTemplate)
			  {
				console.log('adding ' + i + ' to ' + this.template.id);
				this.children[i] = new ArmyCalc.GroupInstance(this, template.children[i]);
				//this.canvas.available.append('<li>GROUP</li>');
			  }
			  else
			  {
				console.log('adding ' + i + ' to ' + this.template.id);
				this.children[i] = [];
				this.canvas.available.append(template.children[i]._createAppender(this));
			  }
			}
			this.childrenCountChanged();
			if (this.parent)
			{
				this.parent.childrenCountChanged();
			}
		}
		
		Instance.prototype = {
			toggleFold : function( ){
				this.folder.toggleClass('unfold');
				this.canvas.children.toggle();
			},
			unfocus : function( ){
				this.li.removeClass('current');
				if (this.parent){
					this.parent.unfocus( );
				}
			},
			focus : function( depth ){
				if ((!depth) && (typeof _focused_element != 'undefined')){
					_focused_element.unfocus();
				}
				this.li.addClass('current');
				if (this.parent){
					this.parent.focus( true );
				}
				if (!depth)
				{
					this.canvas.availableContainer.html('');
					this.canvas.availableContainer.append(this.canvas.available);
				    this.canvas.detailsContainer.html('');
					this.canvas.detailsContainer.append(this.canvas.details);
					
					this.canvas.buttons.inc.toggle(true);
					this.canvas.buttons.dec.toggle(true);
					this.canvas.buttons.rem.toggle(true);
					this.canvas.buttons.up.toggle(true);
					this.canvas.buttons.down.toggle(true);
					
					_focused_element = this;
				}
			},
			getSize : function( ){
				return this.size;
			},
			setSize : function( size ){
				this.size = size;
				for (var i in this.template.costs) {
					this.costs[i] = template.costs[i] * this.size;
					this.costs[i] = template.costs[i] * this.size;
				}
				if (this.size > 1)
				{
					this.sizeSpan.text(this.size + 'x');
				}
				else
				{
					this.sizeSpan.text('');
				}
			},
			incSize : function( ){
				this.setSize(this.getSize() + 1);
			},
			decSize : function( ){
				this.setSize(this.getSize() - 1);
			},
			childrenCountChanged : function(){
				if (this.folder){
					this.folder.toggle(Object.keys(this.children).length > 0);
				}
			},
			appendElement : function( id ){
			  //TODO error handling
			  //alert( 'kaszanka' + id + this.template.children.length);
			  var instance = new ArmyCalc.ElementInstance(this, this.template.children[id]);
			  this.children[id].push(instance);
			  return instance;
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
	
	ArmyCalc.ElementTemplate = (function(){
		
		ElementTemplate.prototype = new ArmyCalc.Template();
		ElementTemplate.prototype.constructor = ElementTemplate;
		function ElementTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
			this.element = true;
		}

		return ElementTemplate;
	}).call({});

})(ArmyCalc);
(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({},{});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
		}
		
		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
(function(ArmyCalc){
	
	ArmyCalc.GroupTemplate = (function(){

		GroupTemplate.prototype = new ArmyCalc.Template();
		GroupTemplate.prototype.constructor = GroupTemplate;
		function GroupTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
			this.group = true;
		}


		return GroupTemplate;
	}).call({});

})(ArmyCalc);
(function(ArmyCalc){
	
	ArmyCalc.GroupInstance = (function(){
		
		GroupInstance.prototype = new ArmyCalc.Instance({},{});
		GroupInstance.prototype.constructor = GroupInstance;
		function GroupInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
		}
		
		return GroupInstance;
		
	}).call({});
	
})(ArmyCalc);
(function(ArmyCalc){
	
	ArmyCalc.ArmyTemplate = (function(){
		
		ArmyTemplate.prototype = new ArmyCalc.Template();
		ArmyTemplate.prototype.constructor = ArmyTemplate;
		function ArmyTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
		}

	  return ArmyTemplate;
	}).call({});

})(ArmyCalc);
(function(ArmyCalc){
	
	ArmyCalc.ArmyInstance = (function(){
		
		//TODO is there a better way?
		ArmyInstance.prototype = new ArmyCalc.Instance({}, {});
		ArmyInstance.prototype.constructor = ArmyInstance;
		
		function ArmyInstance(template, canvas){
			ArmyCalc.Instance.call(this, {canvas:canvas}, template);
		}
		
		ArmyInstance.prototype.getHtml = function( ){
			return "Not <b>yet</b> implemented.HTML";
		};
		
		ArmyInstance.prototype.getTwa = function( ){
			return "Not <b>yet</b> implemented.TWA";
		};
		return ArmyInstance;
		
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
		/**
		* clears previously loaded data
		*/
		clear : function() {
			this.identity = {};
			this.languages = {};
			this.info = {};
			this.armies = {};
			this.templatesByPath = {};
			this.scripts = [];
			this.languages = {};

			this.costs = {};
			this.stats = {};

			this.templatesQueue = [];
			this.languagesQueue = [];
			this.toLoadCount = 0;
			this.noIdsCounter = 0;
		},
		load : function( path ){
			var that = this;
			this.path = path;
			this.setProgress(0);
			$.get(this.path + 'info.xml',function(data){that.loadInfoXml(data);},'xml'); 	
			return true;
		},
		issueWarning : function( text ){
			console.log('WARNING: ' + text);
		},
		setProgress : function( progress ){
			if (this.onProgress){
				this.onProgress(progress);
			}
		},
		/**
		* Processing info.xml file
		*/
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

			$(data).children('costs').children('cost').each(function(){
			  $this = $(this);
			  var c = {};
			  c.name = $this.children('name').text();
			  c.shortname = $this.children('shortname').text();
			  c.suffix = $this.children('suffix').text();
			  c.prefix = $this.children('prefix').text();
			  c['default'] = $this.children('default').text();
			  that.costs[$this.attr('id')] = c;
			});
			
			$(data).children('stats').children('stat').each(function(){
			  $this = $(this);
			  var s = {};
			  s.name = $this.children('name').text();
			  s.shortname = $this.children('shortname').text();
			  s.suffix = $this.children('suffix').text();
			  s.prefix = $this.children('prefix').text();
			  s['default'] = ($this.attr('default') == 'true');
			  that.stats[$this.attr('id')] = s;
			});


			var templates = $(data).children('data').children('templates').children('templates');
			templates.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.templatesQueue.push($(elem).attr('src'));
					var index = that.templatesQueue.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'),
					  success : function(data){
						$(data).children('templates').each(function(){
							that.templatesQueue[index] = this;
						});
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.templatesQueue[index] = null;
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'xml'
					}); 
				} else
					that.templatesQueue.push(elem);
			});
			
			var scripts = $(data).children('data').children('scripts').children('script');
			scripts.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.scripts.push($(elem).attr('src'));
					var index = that.scripts.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'), 
					  success : function(data) {
						that.scripts[index] = data;
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.scripts[index] = '';
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'text'
					});
				} else
					that.scripts.push($(elem).text());
			});
			
			var languages = $(data).children('data').children('languages').children('language');
			languages.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.languagesQueue.push($(elem).attr('src'));
					var index = that.languagesQueue.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'), 
					  success : function( data ) {
						that.languagesQueue[index] = $(data).children('language').first();
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.languagesQueue[index] = null;
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'xml'
					}); 
				} else
					that.languagesQueue.push(elem);
			});
			this.toLoadCount++;
			this.fileLoaded();
	
		},
		fileLoaded : function(){
			this.toLoadCount --;
			var all = this.templatesQueue.length + this.scripts.length + this.languagesQueue.length;
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
			this.children = {};
			this.toProcessAll = this.toProcessCount = this.templatesQueue.length + this.languagesQueue.length + this.scripts.length;
			for (var i = 0; i < this.templatesQueue.length; i++) {
				this.appendTemplates(this.templatesQueue[i], this, '');
				this.fileProcessed();
			}
			this.setProgress(100);
		},
		appendTemplates : function(xml, root, path){
			var that = this;
			var noIdsCounter = 0;
			$(xml).children('army, group, element, deadend').each(function(i, elem) {
				noIdsCounter ++;
				var type = elem.nodeName.toLowerCase();
				var proto = null;
				var protoPath;
				if(protoPath = $(elem).attr('prototype')){
				  proto = that.templatesByPath[protoPath];
				  if (!proto) {
					that.issueWarning('cant find prototype ' + protoPath);
				  }
				}
				var id = id = $(elem).attr('id');
				if(!id && proto) id = proto.id;
				if(!id) id = noIdsCounter;

				//that.issueWarning('appending ' + path + id);

				switch ( type ){
				  case 'element' : 
					var template = new ArmyCalc.ElementTemplate(root, id, proto);
					break;
				  case 'group' : 
					var template = new ArmyCalc.GroupTemplate(root, id, proto);
					break;
				  case 'army' : 
					var template = new ArmyCalc.ArmyTemplate(root, id, proto);
					break;
				  case 'deadend' :
					delete root.children[id];
					return;
				  default :
					return;
				};
	
				template._loadFromXml($(elem));
				that.templatesByPath[path + id] = template;
				that.appendTemplates(elem, template, path + id + '.');
				if (template instanceof ArmyCalc.ArmyTemplate)
					that.armies[id] = template;
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

