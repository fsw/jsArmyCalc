(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(id, parent){
			//TODO xml can be id
			var template;
			if (parent) {
			  template = Template.clone(parent);
			  template.parent = parent;
			} else {
			  template = {};
			  template.children = {};
			  template.enabled = true;
			  template.stats = true;
			}
			template.id = id;
			return template;
		}

		Template.clone = function( x ){
		  if (typeof x != 'object') return x;
		  n = {};
		  for(i in x) n[i] = this.clone(x[i]);
		  return n;
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
