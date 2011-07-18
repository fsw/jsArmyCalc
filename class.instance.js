
function acInstance( parent, element ){

	var that = this;
	this.parent = parent;
	this.isArmy = ( this.parent == null );

	this.element = element;
	this.name = element.name;


	this.size = 0;


	if(! this.isArmy ){
	
	  this._subul = $("<ul></ul>");
	  this._anchor = $("<a href='#'>"+this.name+"</a>");
  
	  this._li = $("<li></li>").append(this._anchor).append(this._subul);

	  //TODO
	  //should we keep submenus in memory or generate them on the fly on each click?
	  this._submenu = $("<ul><li>submenu</li></ul>");
	
	  $.each(this.element.elements,function( id, item ){
			  var button = $("<a href='#'>"+item.name+"</a>");
			  button.click( function(){ that.append(id);} );
			  that._submenu.append($("<li></li>").append(button));
	  });
	  
	  calc.submenuElem.append(this._submenu);
	
	  this._submenu.hide();
	  
	  this._anchor.click(function(){
				calc.submenuElem.children().hide();
				that._submenu.show();
			});


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


	this.append = function( uid ) {

		//alert(uid);
		if(!this.element.elements[uid])
			return;


		var instance = new acInstance( this, this.element.elements[uid] );
		this.child[uid].push( instance );
		this._subul.append( instance._li );

	}
	
}

