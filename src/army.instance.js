(function(ArmyCalc){
	
	ArmyCalc.ArmyInstance = (function(){
		
		ArmyInstance.prototype = new ArmyCalc.Instance({}, {});
		ArmyInstance.prototype.constructor = ArmyInstance;
		
		function ArmyInstance(template, canvas){
			this.canvas = canvas;
			ArmyCalc.Instance.call(this, {}, template);
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
