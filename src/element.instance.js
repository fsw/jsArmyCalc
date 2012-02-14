(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({},{});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
		}
		
		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
