
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

