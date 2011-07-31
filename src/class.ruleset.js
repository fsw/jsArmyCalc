

function acRuleset( calc ){

  this.calc = calc;
  //this.rootElement = new Element();

  
  //
  this.loadFromUrl = function( url ){

	that = this;

	$.ajax({
	  url: url + 'info.xml',
	  success: function( xml, textStatus, jqXHR ){ that.loadFromXml( url, xml ); },
	  error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
	  dataType: 'xml'
	});

  }

  //
  this.loadFromXml = function( baseurl, xml ){
  
	that = this;

	xml = $(xml).children('ruleset');
	
	
	this.calc.langSelect.html();

	$(xml).children('languages').children('language').each(function(){
		that.calc.langSelect.append("<option value='"+$(this).attr('id')+"'"+($(this).attr('default') == 'true' ?" selected='true'":"")+">"+$(this).find('name').text()+"</option>");
		if($(this).attr('default') == 'true')
		  that.calc.setLang($(this).attr('id'));
	});
		  

	this.version = $(xml).attr('version');
	this.uid = $(xml).children('uid').text();
	this.revision = $(xml).children('revision').text();
	

	this.name = acGetText($(xml).children('name'));
	this.description = acGetText($(xml).children('description'));

	this.costs = {};
		
	$(xml).children('costs').children('cost').each(function(){
		  that.costs[$(this).attr('id')] = {
			name : acGetText($(this).children('name')),
			'default' : parseFloat($(this).children('default').text()),
			shortname : acGetText($(this).children('shortname')),
			unit : acGetText($(this).children('unit'))
		  };
	});
		
	this.stats = {};
	
	$(xml).children('stats').children('stat').each(function(){
		  that.stats[$(this).attr('id')] = {
			display : ($(this).attr('display')==true?true:false),
			name : acGetText($(this).children('name')),
			shortname : acGetText($(this).children('shortname')),
			'default' : parseInt($(this).children('default').text())
		  };
	});
	
	this.defaultArmyName = acGetText($(xml).children('defaultArmyName'));
		
	this.defaultArmySize = {};

	$(xml).children('defaultArmySize').children('cost').each(function(){
		  that.defaultArmySize[$(this).attr('id')] = $(this).text();
	});

	this.models = {}
		

	this.mainmenu = {}
	$(xml).children('mainmenu').children('menu').each(function(){
		  
		  menu_id = $(this).attr('id');

		  that.mainmenu[menu_id] = {};
		  that.mainmenu[menu_id]['name'] = acGetText( $(this).children('name') );
		  that.mainmenu[menu_id]['submenus'] = {};
		  
		  $(this).children('menu').each(function(){	
			that.mainmenu[menu_id]['submenus'][$(this).attr('id')] = {};
			that.mainmenu[menu_id]['submenus'][$(this).attr('id')]['name'] = acGetText( $(this).children('name') );
		  });

	});
	
	//Loading errors
	this.errors = {}
	$(xml).children('errors').children('error').each(function(){

		  that.errors[$(this).children('uid').text()] = {
			'class': $(this).attr('class'),
			'message': acGetText( $(this).children('message') )
			}
	});


	
	$(xml).children('models').find('model').each(function(){
		  
		  model_id = $(this).attr('id');
		  
		  that.models[model_id] = {
			name : acGetText($(this).children('name')),
			'default' : $(this).attr('default') == 'true'
		  };
		  
		  that.models[model_id].elements = [];
		  that.models[model_id].elements_by_uid = {};
		  
		  that.models[model_id].validator = "";	
	
		  $.ajax({
				model_id: model_id,
				url: baseurl + $(this).children('validator').attr('src'),
				success: function(text){ that.models[this.model_id].validator = text },
				error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
				dataType: 'text'
		  });

		  $(this).find('elements').each(function(){
			that.appendElements( baseurl, this, that.models[model_id].elements, that.models[model_id].elements_by_uid);
		  });

		  
		  that.models[model_id].mainmenu = that.mainmenu;	

		  that.models[model_id].defaultArmyName = that.defaultArmyName;
		  that.models[model_id].defaultArmySize = that.defaultArmySize;
		  //overriding
		  if($(this).children('defaultArmyName').length)
			that.models[model_id].defaultArmyName = acGetText($(this).children('defaultArmyName'));
	 
		  $(this).children('defaultArmySize').children('cost').each(function(){
			that.models[model_id].defaultArmySize[$(this).attr('id')] = $(this).text();
		  });
  
	});

  
  }

  this.appendElements = function( baseurl, xml, elements, elements_by_uid){
	 
	  that = this;

	  if($(xml).attr('src')){

		  $.ajax({
			  url: baseurl + $(xml).attr('src'),
			  success: function( xml ){ that.appendElements( baseurl, $(xml).children('elements') , elements, elements_by_uid); },
			  error: function( jqxhr, text, error ){ that.calc.setError( this.url+' - '+text + ' - ' + error ); },
			  dataType: 'xml'
		  });
	  
	  } else {

		var elements_group = {};

		//TODO overloading this options with
		elements_group.minTotalCount = ($(xml).attr('minTotalCount')?parseInt($(xml).attr('minTotalCount')):0);
		elements_group.maxTotalCount = ($(xml).attr('maxTotalCount')?parseInt($(xml).attr('maxTotalCount')):null);
		elements_group.minTotalSize = ($(xml).attr('minTotalSize')?parseInt($(xml).attr('minTotalSize')):0);
		elements_group.maxTotalSize = ($(xml).attr('maxTotalSize')?parseInt($(xml).attr('maxTotalSize')):null);
		elements_group.elements = {};
		
		//this by default will contain concatenated elements names
		elements_group.name = "";

		$(xml).children('element').each(function(){

			
			if($(this).attr('extend') && ($(this).attr('extend') in elements_by_uid) ){
				var element = acClone( elements_by_uid[$(this).attr('extend')] );
			} else {
				var element = {};
			}

			if( $(this).children('uid').length > 0 )
			  element.uid = $(this).children('uid').text();

			if( $(this).children('menu').length > 0 )
			  element.menu_id = $(this).children('menu').attr('id');

			if( $(this).children('name').length > 0 )
			  element.name = acGetText($(this).children('name'));
			
			elements_group.name = elements_group.name + element.name + ", ";
			
			if( $(this).children('description').length > 0 )
			  element.description = acGetText($(this).children('description'));

			if( $(this).children('thumbnail').length > 0 )
			  element.thumbnail = "<img src='" + baseurl + $(this).children('thumbnail').attr('src') + "' />";

			//HOOKS
			if(! ('afterAppend' in element ))
			  element.afterAppend = ($(this).attr('afterAppend')?$(this).attr('afterAppend'):0);
			if(! ('beforeRemove' in element ))
			  element.beforeRemove = ($(this).attr('beforeRemove')?$(this).attr('beforeRemove'):0);

			//alert(element.uid);
			//element.child = [];
			if(! ('elements' in element ))
			  element.elements = [];
			
		
			function loadAttr( element, xml, name, def, parse ){
				if(!(name in element))
				  element[name] = def;

				if( xml.attr( name ) )
				  if( parse )
					element[name] = parseInt(xml.attr(name));
				  else
					element[name] = xml.attr(name);

			}

			loadAttr( element, $(this), 'minCount', 0, true );
			loadAttr( element, $(this), 'maxCount', null, true );
			loadAttr( element, $(this), 'minSize', 1, true );
			loadAttr( element, $(this), 'maxSize', null, true );
			loadAttr( element, $(this), 'defaultSize', element.minSize, true );
			loadAttr( element, $(this), 'size', 'custom', false );


			//element.minCount = ($(this).attr('minCount')?parseInt($(this).attr('minCount')):0);
			//element.maxCount = ($(this).attr('maxCount')?parseInt($(this).attr('maxCount')):null);	
			//element.minSize = ($(this).attr('minSize')?parseInt($(this).attr('minSize')):1);
			//element.maxSize = ($(this).attr('maxSize')?parseInt($(this).attr('maxSize')):null);
			//element.defaultSize = ($(this).attr('defaultSize')?parseInt($(this).attr('defaultSize')):element.minSize);
			//element.size = ($(this).attr('size')?$(this).attr('size'):'custom');
			

			element.cost = {};
			for(id in that.costs)
			  element.cost[id] = that.costs[id]['default'];
			
			$(this).children('cost').each(function(){
			  element.cost[$(this).attr('id')] = parseFloat( $(this).text() );
			});
			
			if( $(this).children('stats').length > 0 ){

			  element.stats = {};
			  for(id in that.stats)
				element.stats[id] = that.stats[id]['default'];

			  $(this).children('stats').children('stat').each(function(){
				element.stats[$(this).attr('id')] = parseInt($(this).text());
			  });
			}

			$.each( $(this).children('elements'), function( id, item){
			  
			  that.appendElements( baseurl, item, element.elements, elements_by_uid );
			  
			});

			elements_group.elements[ element.uid ] = element;
			elements_by_uid[ element.uid ] = element;
		});

	  elements.push( elements_group );
	  
	}

	  
  }


}

