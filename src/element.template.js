(function(ArmyCalc){
	
	ArmyCalc.ElementTemplate = (function(){
		function ElementTemplate(id, parent){
			return new ArmyCalc.Template(id, parent);
		}

		ElementTemplate.prototype = ArmyCalc.Template.prototype;

		return ElementTemplate;
	}).call({});

})(ArmyCalc);
