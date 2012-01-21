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
