(function(ArmyCalc){
	//template
	ArmyCalc.Template = (function(){
		function Template(proto){
			if (proto) {
			  this.stats = {};
			  this.clone( this.stats, proto.stats );
			  this.enabled = proto.enabled;
			  this.name = proto.name;
			  this.children = {};
			  for (var id in proto.children) {
				if (proto.children[id] instanceof ArmyCalc.ElementTemplate)
				  this.children[id] = new ArmyCalc.ElementTemplate(proto.children[id]);
				else if (proto.children[id] instanceof ArmyCalc.GroupTemplate)
				  this.children[id] = new ArmyCalc.ElementTemplate(proto.children[id]);		
			  }
			  this.proto = proto;
			} else {
			  this.children = {};
			  this.enabled = true;
			  this.stats = {};
			  this.name = 'Unnamed';
			}
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
				return $('<li>' + this.name + '</li>');
			}
		};

		return Template;
	}).call({});

})(ArmyCalc);
