
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

		this.canvas.find('#acDec').click( function(){ _focused_element.size(_focused_element.size()-1); return false;}).hide();
		this.canvas.find('#acInc').click( function(){ _focused_element.size(_focused_element.size()+1); return false;}).hide();
		this.canvas.find('#acRem').click( function(){ _focused_element.remove(); return false;}).hide();

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

