(function(ArmyCalc){
	
	ArmyCalc.ArmyTemplate = (function(){
		
		ArmyTemplate.prototype = new ArmyCalc.Template();
		ArmyTemplate.prototype.constructor = ArmyTemplate;
		function ArmyTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
		}

	  return ArmyTemplate;
	}).call({});

})(ArmyCalc);
