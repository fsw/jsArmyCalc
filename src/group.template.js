(function(ArmyCalc){
	
	ArmyCalc.GroupTemplate = (function(){

		GroupTemplate.prototype = new ArmyCalc.Template(1);
		GroupTemplate.prototype.constructor = GroupTemplate;
		function GroupTemplate(id, proto){
			ArmyCalc.Template.call(this, id, proto);
			this.group = true;
		}


		return GroupTemplate;
	}).call({});

})(ArmyCalc);
