(function(ArmyCalc){
	
	ArmyCalc.GroupInstance = (function(){
		
		GroupInstance.prototype = new ArmyCalc.Instance({},{});
		GroupInstance.prototype.constructor = GroupInstance;
		function GroupInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
			this.canvas = parent.canvas;	
		}
		
		return GroupInstance;
		
	}).call({});
	
})(ArmyCalc);
