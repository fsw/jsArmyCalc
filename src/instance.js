(function(ArmyCalc){
	//template
	ArmyCalc.Instance = (function(){
		
		function Instance(template){
			var instance = {};
			instance.t = template;
			return instance;
		}
		
		Instance.injectClassMethods = function( twrReader ){
			for (var method in TwrReader.prototype){
				if (TwrReader.prototype.hasOwnProperty( method )){
					twrReader[ method ] = TwrReader.prototype[ method ];
				}
			}
			return( twrReader );
		}; 
		
		return Instance;
		
	}).call({});
	
})(ArmyCalc);
