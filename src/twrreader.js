(function(ArmyCalc){

//Define the collection class.
ArmyCalc.TwrReader = (function(){
	// I am the constructor function.
	function TwrReader(options){
		var twrReader = Object.create(TwrReader.prototype);
		//TwrReader.injectClassMethods(twrReader);
		
		options = options || {};
		if(options.onProgress)
			twrReader.onProgress = options.onProgress;
		if(options.onLoaded)
			twrReader.onLoaded = options.onLoaded;
		
		twrReader.filesQueue = [];
		twrReader.identity = {};
		twrReader.languages = {};
		twrReader.info = {};
		twrReader.files = {};
		twrReader.armies = {};
		return( twrReader );
	}

	// ------------------------------------------------------ //
	//Define default fetch methods.

	
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
		load : function( path ){
			var that = this;
			this.path = path;
			if (this.onProgress){
				this.onProgress(0);
			}
			$.get(this.path + 'info.xml',function(data){that.loadInfoXml(data);},'xml'); 
			
			return true;
		},
		loadInfoXml : function(data){
			alert($(data).children('name').length);
			if (this.onProgress){
				this.onProgress(100);
			}
		},
		save : function(){
			var info = TwrReader.buildXml({
				'identity': this.identity,
			});
			this.putFile('info', info);
			return true;
		},
		loaded : function(){
			alert('loaded');
		},
		getFile : function( path ){
			throw "Error";
			$.get(this.path + path, callback, 'text');
		},
		getFileXml : function( path ){
			this.filesQueue.push({path:path});
			var that = this;
			$.get(this.path + path, function(data){that.processFiles(path, data);}, 'xml');
		},
		processFiles : function( path, data ){
			for (var i = 0; i < this.filesQueue.length; i++)
			{
				if(this.filesQueue[i].path == path)
					this.filesQueue[i].data = data;
			}
		}
		
	};

	// ------------------------------------------------------ //
	return( TwrReader );

}).call({});



})(ArmyCalc);
