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
		}
		
		Instance.prototype = {
			resize : function( size ){
				
			},
			appendElement : function( id ){
			  if (typeof(this.children[id]) == 'undefined')
				this.children[id] = [];
			  //TODO
			  //this.children[id].push();
			  return true;
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
