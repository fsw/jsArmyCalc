(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(template){
			ArmyCalc.Instance.call(this, template);
		}
		
		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
