(function(ArmyCalc){
	
	ArmyCalc.GroupTemplate = (function(){
		function GroupTemplate(id, parent){
			return new ArmyCalc.Template(id, parent);
		}

		GroupTemplate.prototype = ArmyCalc.Template.prototype;

		return GroupTemplate;
	}).call({});

})(ArmyCalc);
