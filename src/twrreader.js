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
		twrReader.clear();
		return( twrReader );
	}

	// ------------------------------------------------------ //
	//Define default fetch methods.
	TwrReader.onProgress = function( percent ){
		return null;
	};
	// ------------------------------------------------------ //
	// Define the class methods.
	TwrReader.prototype = {
		clear : function() {
			
			this.identity = {};
			this.languages = {};
			this.info = {};
			this.armies = {};
			this.elementsById = {};
			this.scripts = [];
			this.languages = {};
			this.elementsQueue = [];
			this.languagesQueue = [];
			this.toLoadCount = 0;
		},
		load : function( path ){
			var that = this;
			this.path = path;
			this.setProgress(0);
			$.get(this.path + 'info.xml',function(data){that.loadInfoXml(data);},'xml'); 
			
			return true;
		},
		setProgress : function(progress){
			if (this.onProgress){
				this.onProgress(progress);
			}
		},
		loadInfoXml : function(data){
			var that = this;
			this.clear();
			
			var data = $(data).children('ruleset');
			
			this.identity.uid = $(data).children('identity').children('uid').text();
			this.identity.revision = $(data).children('identity').children('revision').text();
			this.identity.origin = $(data).children('identity').children('origin').text();
			this.identity.url = $(data).children('identity').children('url').text();
			
			this.info.name = $(data).children('info').children('name').text();
			this.info.author = {
				name : $(data).children('info').children('author').children('name').text(),
				email : $(data).children('info').children('author').children('email').text()	
			};
			this.info.description = $(data).children('info').children('description').text();
			
			var elements = $(data).children('data').children('elements').children('elements');
			elements.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.elementsQueue.push($(elem).attr('src'));
					var index = that.elementsQueue.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						$(data).children('elements').each(function(){
							that.elementsQueue[index] = this;
						});
						that.fileLoaded();
						},'xml'); 
				} else
					that.elementsQueue.push(elem);
			});
			
			var scripts = $(data).children('data').children('scripts').children('script');
			scripts.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.scripts.push($(elem).attr('src'));
					var index = that.scripts.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						that.scripts[index] = data;
						that.fileLoaded();
						},'text'); 
				} else
					that.scripts.push($(elem).text());
			});
			
			var languages = $(data).children('data').children('languages').children('language');
			languages.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.languagesQueue.push($(elem).attr('src'));
					var index = that.languagesQueue.length - 1;
					that.toLoadCount ++;
					$.get(that.path + $(elem).attr('src'), function(data){
						that.languagesQueue[index] = $(data).children('language').first();
						that.fileLoaded();
						},'xml'); 
				} else
					that.languagesQueue.push(elem);
			});
			this.toLoadCount++;
			this.fileLoaded();
		},
		fileLoaded : function(){
			this.toLoadCount --;
			var all = this.elementsQueue.length + this.scripts.length + this.languagesQueue.length;
			this.setProgress(((all - this.toLoadCount) / all) * 50);
			if (this.toLoadCount == 0)
				this.loadFiles();
		},
		fileProcessed : function(){
			this.toProcessCount --;
			this.setProgress(50 + (((this.toProcessAll - this.toProcessCount) / this.toProcessAll) * 50));
		},
		loadFiles : function(){
			var that = this;
			this.setProgress(50);
			this.elements = {};
			this.toProcessAll = this.toProcessCount = this.elementsQueue.length + this.languagesQueue.length + this.scripts.length;
			for (i = 0; i < this.elementsQueue.length; i++) {
				this.appendElements(this.elementsQueue[i], this);
				this.fileProcessed();
			}
			this.setProgress(100);
		},
		appendElements : function(xml, root){
			var that = this;
			alert(xml.tagName);
			$(xml).children('element').each(function(i, elem) {
				//tu cała logika!
				var parent = null;
				if($(elem).attr('parent'))
					parent = that.elementsById[$(elem).attr('parent')];
				
				var template = new ArmyCalc.Template($(elem).tagName, $(elem).attr('id'), parent);
				
				root[template.id] = template;
				that.elementsById[template.id] = template;
				that.appendElements(elem, template.children);
			});
			$(xml).children('deadend').each(function(i, elem) {
				delete root[$(elem).attr('id')];
			});
		},
		save : function(){
			var info = TwrReader.buildXml({
				'identity': this.identity
			});
			this.putFile('info', info);
			return true;
		},
		loaded : function(){
			alert('loaded');
		}
		
	};

	// ------------------------------------------------------ //
	return( TwrReader );

}).call({});



})(ArmyCalc);
