(function(ArmyCalc){
	
	ArmyCalc.ElementTemplate = (function(){
		
		ElementTemplate.prototype = new ArmyCalc.Template();
		ElementTemplate.prototype.constructor = ElementTemplate;
		function ElementTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
			this.element = true;
		}

		return ElementTemplate;
	}).call({});

})(ArmyCalc);
