
function acInstance( parent, data, subUL ){
	  
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

		var instance = new acInstance( this, this.data.elements[uid], ul );

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
	
