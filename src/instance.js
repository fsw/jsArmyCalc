(function(ArmyCalc){
	//template
	ArmyCalc.Instance = (function(){
		
		function Instance(template){
			var instance = {};
			instance.t = template;
			instance.children = [];
			instance.stats = {};
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
		
		Instance.prototype = {
			resize : function( size ){
				
			},
			append : function( id ){ 
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
