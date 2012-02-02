(function(ArmyCalc){
	ArmyCalc.Instance = (function(){
		
		function Instance(template) {
			this.template = template;
			this.availabe = template.children;
			this.children = {};
			this.stats = {};
			for (var i in template.stats) {
			  this.stats[i] = template.stats[i];
			}
			this.size = template.defaultSize;
			this.costs = {};
			for (var i in template.costs) {
			  this.costs[i] = template.costs[i] * this.size;
			  this.costs[i] = template.costs[i] * this.size;
			}
			this.maxTotalCosts = {};
			//TODO append all required childrens
			for (var i in template.children) {
			  if(template.children[i] instanceof ArmyCalc.GroupTemplate)
				this.children[i] = new ArmyCalc.GroupInstance(template.children[i]);
			  else
				this.children[i] = [];
			}
		}
		
		Instance.prototype = {
			resize : function( size ){

			},
			appendElement : function( id ){
			  //TODO error handling
			  var instance = new ArmyCalc.ElementInstance(this.template.children[id]);
			  this.children[id].push(instance);
			  return instance;
			},
			remove : function( id ){ 
				return true;
			},
			setStat : function( id ){ 
				return true;
			},
			getStat : function( id ){ 
				return true;
			}
		};
		
		return Instance;
		
	}).call({});
	
})(ArmyCalc);
