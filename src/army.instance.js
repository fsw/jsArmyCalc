(function(ArmyCalc){
	
	ArmyCalc.ArmyInstance = (function(){
		
		//TODO is there a better way?
		ArmyInstance.prototype = new ArmyCalc.Instance({}, {});
		ArmyInstance.prototype.constructor = ArmyInstance;
		
		function ArmyInstance(template, canvas){
			ArmyCalc.Instance.call(this, {canvas:canvas}, template);
		}
		
		ArmyInstance.prototype.getHtml = function( ){
			return "Not <b>yet</b> implemented.HTML";
		};
		
		ArmyInstance.prototype.getTwa = function( ){
			return "Not <b>yet</b> implemented.TWA";
		};
		return ArmyInstance;
		
	}).call({});
	
})(ArmyCalc);
