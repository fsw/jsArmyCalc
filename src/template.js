(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(id, parent){
			//TODO xml can be id
			if (parent) {
			  this.stats = {};
			  this.clone( this.stats, parent.stats );
			  this.enabled = parent.enabled;
			  this.name = parent.name;
			  this.children = {};
			  for (var id in parent.children) {
				if (parent.children[id] instanceof ArmyCalc.ElementTemplate)
				  this.children[id] = new ArmyCalc.ElementTemplate(id, parent.children[id]);
				else if (parent.children[id] instanceof ArmyCalc.GroupTemplate)
				  this.children[id] = new ArmyCalc.ElementTemplate(id, parent.children[id]);		
			  }
			  this.parent = parent;
			} else {
			  this.children = {};
			  this.enabled = true;
			  this.stats = true;
			  this.name = 'Unnamed';
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
