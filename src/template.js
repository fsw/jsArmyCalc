(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(xml){
			var template = {};
			template.parent = null;
			template.children = {};
			template.id = '';
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
