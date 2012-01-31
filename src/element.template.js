(function(ArmyCalc){
	
	ArmyCalc.ElementTemplate = (function(){
		
		ElementTemplate.prototype = new ArmyCalc.Template(1);
		ElementTemplate.prototype.constructor = ElementTemplate;
		function ElementTemplate(id, proto){
			ArmyCalc.Template.call(this, id, proto);
			this.element = true;
		}

		return ElementTemplate;
	}).call({});

})(ArmyCalc);
