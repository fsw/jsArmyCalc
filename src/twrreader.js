(function(ArmyCalc){

//Define the collection class.
ArmyCalc.TwrReader = (function(){
	// I am the constructor function.
	function TwrReader(options){
		var twrReader = Object.create(TwrReader.prototype);
		//TwrReader.injectClassMethods(twrReader);
		
		options = options || {};
		if(options.getFile)
			twrReader.getFile = options.getFile;
		else
			twrReader.getFile = TwrReader.getFile;
		if(options.putFile)
			twrReader.putFile = options.putFile;
		else
			twrReader.putFile = TwrReader.putFile;
		
		twrReader.filesQueue = {};
		twrReader.identity = {};
		twrReader.languages = {};
		twrReader.info = {};
		twrReader.files = {};
		twrReader.armies = {};
		return( twrReader );
	}

	// ------------------------------------------------------ //
	//Define default fetch methods.
	TwrReader.getFile = function( path ){
		throw "Error";
	};
	TwrReader.putFile = function( path, body ){
		throw "Error";
	};
	
	TwrReader.parseXML = function( data ){
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			throw "Invalid XML";
		}
		return xml;
	};
	
	TwrReader.buildXml = function( data ){
		xml = '<?xml?>';
		
		
		return xml;
	}

	TwrReader.onProgress = function( percent ){
		return null;
	};
	// ------------------------------------------------------ //
	// Define the class methods.
	TwrReader.prototype = {
		load : function( value ){
			this.getFile('info.xml', function(data){
				var infoXml = TwrReader.parseXML(data);
				alert(infoXml);
			}); 
			return true;
		},
		save : function(){
			var info = TwrReader.buildXml({
				'identity': this.identity,
			});
			this.putFile('info', info);
			return true;
		}
	};

	// ------------------------------------------------------ //
	return( TwrReader );

}).call({});



})(ArmyCalc);
