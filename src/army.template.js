(function(ArmyCalc){
	
	ArmyCalc.ArmyTemplate = (function(){
		
		ArmyTemplate.prototype = new ArmyCalc.Template(1);
		ArmyTemplate.prototype.constructor = ArmyTemplate;
		function ArmyTemplate(id, proto){
			ArmyCalc.Template.call(this, id, proto);
		}

	  return ArmyTemplate;
	}).call({});

})(ArmyCalc);
