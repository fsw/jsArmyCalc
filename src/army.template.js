(function(ArmyCalc){
	
	ArmyCalc.ArmyTemplate = (function(){
		
		ArmyTemplate.prototype = new ArmyCalc.Template(1);
		ArmyTemplate.prototype.constructor = ArmyTemplate;
		function ArmyTemplate(id, proto){
			ArmyCalc.Template.call(this, id, proto);
		}

		ArmyTemplate.prototype.getHtml = function( ){
			return "Not <b>yet</b> implemented.HTML";
		};

		ArmyTemplate.prototype.getTwa = function( ){
			return "Not <b>yet</b> implemented.TWA";
		};

		return ArmyTemplate;
	}).call({});

})(ArmyCalc);
