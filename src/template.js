(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(parent, id, proto){
			this.id = id;
			this.parent = parent;
			if (proto) {
			  this.stats = {};
			  this.clone( this.stats, proto.stats );
			  this.enabled = proto.enabled;
			  this.name = proto.name;
			  this.minSize = proto.minSize;
			  this.maxSize = proto.minSize;
			  this.defaultSize = proto.defaultSize;
			  
			  this.children = {};
			  for (var id in proto.children) {
				if (proto.children[id] instanceof ArmyCalc.ElementTemplate)
				  new ArmyCalc.ElementTemplate(this, id, proto.children[id]);
				else if (proto.children[id] instanceof ArmyCalc.GroupTemplate)
				  new ArmyCalc.GroupTemplate(this, id, proto.children[id]);		
			  }
			  this.proto = proto;
			} else {
			  this.children = {};
			  this.enabled = true;
			  this.stats = {};
			  this.name = 'Unnamed';
			  this.minSize = 1;
			  this.maxSize = null;
			  this.defaultSize = 1;
			}
			if(parent)
			  parent.children[this.id] = this;
		}

		Template.prototype = {
			clone : function( target, source ){
			  for(i in source)
				if (typeof source[i] != 'object')
				  target[i] = source[i];
				else
				  target[i] = this.clone({}, source[i]);
			  
			  return target;
			},
			enable : function( value ){ 
				template.enabled = true;
				return true;
			},
			disable : function(){
				template.enabled = false;
				return true;
			},
			append : function( template ){
				
			},
			_loadFromXml : function($elem){
				//this should not override prototype properties!
				(n = $elem.children('name').text()) || (n = $elem.attr('name'));
				if (typeof n != 'undefined') this.name = n;
				
				(d = $elem.children('description').text());
				if (typeof d != 'undefined') this.description = n;
				
				(min = $elem.attr('minSize'));
				if (typeof min != 'undefined') { this.minSize = parseInt(min); this.defaultSize = this.minSize; }
				
				(max = $elem.attr('maxSize'));
				if (typeof max != 'undefined') this.maxSize = parseInt(max);

				(def = $elem.attr('defaultSize'));
				if (typeof def != 'undefined') this.defaultSize = parseInt(def);
			},
			_createAppender : function(instance) {
				var a = $('<a href="#">' + this.name + '</a>');
				var that = this;
				a.click(function(){
				  instance.appendElement(that.id);
				  return false;
				});
				return $('<li></li>').append(a);
			}
		};

		return Template;
	}).call({});

})(ArmyCalc);
