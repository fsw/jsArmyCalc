(function(ArmyCalc){
	
	ArmyCalc.GroupTemplate = (function(){

		GroupTemplate.prototype = new ArmyCalc.Template();
		GroupTemplate.prototype.constructor = GroupTemplate;
		function GroupTemplate(proto){
			ArmyCalc.Template.call(this, proto);
			this.group = true;
		}


		return GroupTemplate;
	}).call({});

})(ArmyCalc);
