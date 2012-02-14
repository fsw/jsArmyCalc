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
			}
			if(parent)
			  parent.children[id] = this;
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

			  var name = null;
			  if ((name = $elem.children('name').text()) || (name = $elem.attr('name'))) {
				this.name = name;
			  }
			  var desc = null;
			  if (desc = $elem.children('description').text()) {
				this.description = desc;;
			  }
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
