(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(id, parent){
			//TODO xml can be id
			if (parent) {
			  this.clone( this, parent );
			  this.parent = parent;
			} else {
			  this.children = {};
			  this.enabled = true;
			  this.stats = true;
			}
			this.id = id;
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
				
			}
		};

		return Template;
	}).call({});

})(ArmyCalc);
