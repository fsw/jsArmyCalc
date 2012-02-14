(function(ArmyCalc){
	
	ArmyCalc.GroupTemplate = (function(){

		GroupTemplate.prototype = new ArmyCalc.Template();
		GroupTemplate.prototype.constructor = GroupTemplate;
		function GroupTemplate(parent, id, proto){
			ArmyCalc.Template.call(this, parent, id, proto);
			this.group = true;
		}


		return GroupTemplate;
	}).call({});

})(ArmyCalc);
