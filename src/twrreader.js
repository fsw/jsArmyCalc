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
		/**
		* clears previously loaded data
		*/
		clear : function() {
			this.identity = {};
			this.languages = {};
			this.info = {};
			this.armies = {};
			this.templatesById = {};
			this.scripts = [];
			this.languages = {};
			this.templatesQueue = [];
			this.languagesQueue = [];
			this.toLoadCount = 0;
			this.noIdsCounter = 0;
		},
		load : function( path ){
			var that = this;
			this.path = path;
			this.setProgress(0);
			$.get(this.path + 'info.xml',function(data){that.loadInfoXml(data);},'xml'); 	
			return true;
		},
		issueWarning : function( text ){
			console.log('WARNING: ' + text);
		},
		setProgress : function( progress ){
			if (this.onProgress){
				this.onProgress(progress);
			}
		},
		/**
		* Processing info.xml file
		*/
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
			
			var templates = $(data).children('data').children('templates').children('templates');
			templates.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.templatesQueue.push($(elem).attr('src'));
					var index = that.templatesQueue.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'),
					  success : function(data){
						$(data).children('templates').each(function(){
							that.templatesQueue[index] = this;
						});
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.templatesQueue[index] = null;
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'xml'
					}); 
				} else
					that.templatesQueue.push(elem);
			});
			
			var scripts = $(data).children('data').children('scripts').children('script');
			scripts.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.scripts.push($(elem).attr('src'));
					var index = that.scripts.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'), 
					  success : function(data) {
						that.scripts[index] = data;
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.scripts[index] = '';
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'text'
					});
				} else
					that.scripts.push($(elem).text());
			});
			
			var languages = $(data).children('data').children('languages').children('language');
			languages.each(function(i, elem) {
				if($(elem).attr('src')) {
					that.languagesQueue.push($(elem).attr('src'));
					var index = that.languagesQueue.length - 1;
					that.toLoadCount ++;
					$.ajax({
					  url : that.path + $(elem).attr('src'), 
					  success : function( data ) {
						that.languagesQueue[index] = $(data).children('language').first();
						that.fileLoaded();
					  },
					  error : function( jqXHR, textStatus ) {
						that.languagesQueue[index] = null;
						that.issueWarning('error loading file ' + $(elem).attr('src') + '(' + textStatus + ')');
						that.fileLoaded();
					  },
					  dataType : 'xml'
					}); 
				} else
					that.languagesQueue.push(elem);
			});
			this.toLoadCount++;
			this.fileLoaded();
			this.armiesXml = $(data).children('armies').children('army');
	
		},
		fileLoaded : function(){
			this.toLoadCount --;
			var all = this.templatesQueue.length + this.scripts.length + this.languagesQueue.length;
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
			this.templates = {};
			this.toProcessAll = this.toProcessCount = this.templatesQueue.length + this.languagesQueue.length + this.scripts.length;
			for (i = 0; i < this.templatesQueue.length; i++) {
				this.appendTemplates(this.templatesQueue[i], {});
				this.fileProcessed();
			}
			//after all templates are processed we can add armies data
			$(this.armiesXml).each(function(i, elem){
			  var parent = null;
			  if($(elem).attr('parent'))
				parent = that.armies[$(elem).attr('parent')];
			  
			  var template = new ArmyCalc.Template($(elem).attr('id'), parent);
			  that.armies[template.id] = template;
			  that.appendTemplates(elem, template.children);
			});

			this.setProgress(100);
		},
		templateFromXml : function(elem){
			var type = elem.nodeName.toLowerCase();
			var parent = null;
			if($(elem).attr('parent'))
			  parent = this.templatesById[$(elem).attr('parent')];
			
			var id = $(elem).attr('id');
			if(!id)
			  id = this.noIdsCounter++;
			
			switch( type ){
			  case 'element' : 
				var template = new ArmyCalc.ElementTemplate(id, parent);
				break;
			  case 'group' : 
				var template = new ArmyCalc.GroupTemplate(id, parent);
				break;
			  case 'deadend' : 
				return false;
			  default :
				return false;
			};
		
			template.name = $(elem).children('name').text();
			template.description = $(elem).children('description').text();
			
			return template;
		},
		appendTemplates : function(xml, root){
			var that = this;
			$(xml).children().each(function(i, elem) {
			  if (elem.nodeName.toLowerCase() == 'deadend') {
				//delete root[$(elem).attr('id')];
				alert('deadend');
			  } else {
				var template = that.templateFromXml(elem);
				if (template) {
				  root[template.id] = template;
				  that.templatesById[template.id] = template;
				  that.appendTemplates(elem, template.children);
				}
			  }
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
