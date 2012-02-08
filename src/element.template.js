(function(ArmyCalc){
	
	ArmyCalc.ElementTemplate = (function(){
		
		ElementTemplate.prototype = new ArmyCalc.Template();
		ElementTemplate.prototype.constructor = ElementTemplate;
		function ElementTemplate(proto){
			ArmyCalc.Template.call(this, proto);
			this.element = true;
		}

		return ElementTemplate;
	}).call({});

})(ArmyCalc);
