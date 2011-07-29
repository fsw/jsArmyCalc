
function acInstance( calc, ruleset, parent, element ){

	var that = this;
	this.parent = parent;
	this.isArmy = ( this.parent == null );
	this.calc = calc;
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

		$.each( this.ruleset.stats, function( id, item){
		  
		    that._stats_spans[ id ] = $("<span class='st'>"+that.element.stats[id]+"</span>");
			that._anchor.append( that._stats_spans[ id ] );

		});
	  }
  

	  this._li = $("<li></li>").append(this._anchor).append(this._subul);

	  

	  //TODO
	  //should we keep submenus in memory or generate them on the fly on each click?
	  this._submenu = $("<ul></ul>");
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

	this.remove = function(){
		
		//checking if minCount was reached
		if( this.parent.child[this.element.uid].length > this.element.minCount ){

		  this.clear();
		  this.parent.child[this.element.uid].splice( this.parent.child[this.element.uid].indexOf( this ), 1 );
		  this._li.remove();
		  this._submenu.remove();

		} else
		  this.calc.flashMsg( "Minimum count of "+this.element.name+" is "+this.element.minCount );
	}

	this.append = function( uid ) {

		var element_to_append = null;

		$.each( this.element.elements, function( id, item ){
		  if(item.elements[uid])
			element_to_append = item.elements[uid];
		});
	
		if(!element_to_append)
			return;
	
		//checking if maxCount was reached
		if( (element_to_append.maxCount == null) || (this.child[uid].length < element_to_append.maxCount) ){

		  var instance = new acInstance( calc, ruleset, this, element_to_append );
		  this.child[uid].push( instance );
		  this._subul.append( instance._li );
		
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

