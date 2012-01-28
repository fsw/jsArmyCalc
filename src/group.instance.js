(function(ArmyCalc){
	
	ArmyCalc.GroupInstance = (function(){
		
		GroupInstance.prototype = new ArmyCalc.Instance({});
		GroupInstance.prototype.constructor = GroupInstance;
		function GroupInstance(template){
			ArmyCalc.Instance.call(this, template);
		}
		
		return GroupInstance;
		
	}).call({});
	
})(ArmyCalc);
