(function(ArmyCalc){
	
	ArmyCalc.ArmyTemplate = (function(){
		
		ArmyTemplate.prototype = new ArmyCalc.Template();
		ArmyTemplate.prototype.constructor = ArmyTemplate;
		function ArmyTemplate(proto){
			ArmyCalc.Template.call(this, proto);
		}

	  return ArmyTemplate;
	}).call({});

})(ArmyCalc);
