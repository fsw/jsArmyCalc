(function(ArmyCalc){
	ArmyCalc.Instance = (function(){
		
		function Instance(parent, template) {
			var that = this;
			this.parent = parent;
			this.template = template;
			this.available = template.children;
			this.children = {};
			this.stats = {};
			for (var i in template.stats) {
			  this.stats[i] = template.stats[i];
			}
			this.size = template.defaultSize;
			this.costs = {};
			for (var i in template.costs) {
			  this.costs[i] = template.costs[i] * this.size;
			  this.costs[i] = template.costs[i] * this.size;
			}
			this.maxTotalCosts = {};
			this.canvas = {};
			if (parent.canvas)
			{
			  this.canvas['children'] = parent.canvas['children'];
			  this.canvas['availableContainer'] = parent.canvas['availableContainer'];
			  this.canvas['detailsContainer'] = parent.canvas['detailsContainer'];
			
			  if (typeof parent.canvas.children != 'undefined'){
				var anchor = $('<a href="#">' + template.name + '</a>');
				this.sizeSpan = $('<span> size </span>');
				this.li = $('<li></li>').append(anchor.prepend(this.sizeSpan));
				this.canvas.children = $('<ul></ul>');
				anchor.click(function(){that.focus()});
				parent.canvas.children.append(this.li.append(this.canvas.children));
			  }
			}

			this.canvas.available = $('<ul></ul>');	
			this.canvas.details = $('<div> ... details ... </div>');
			
			//TODO append all required childrens
			for (var i in template.children) {
			  if(template.children[i] instanceof ArmyCalc.GroupTemplate)
			  {
				this.children[i] = new ArmyCalc.GroupInstance(this, template.children[i]);
				this.canvas.available.append('<li>GROUP</li>');
			  }
			  else
			  {
				this.children[i] = [];
				this.canvas.available.append(template.children[i]._createAppender(this));
			  }
			}
		}
		
		Instance.prototype = {
			focus : function( ){
			  if (typeof this.canvas != 'undefined'){
				this.li.parent().find('li').removeClass('current');
				this.li.addClass('current');
			    this.canvas.availableContainer.html('');
				this.canvas.availableContainer.append(this.canvas.available);
			    this.canvas.detailsContainer.html('');
				this.canvas.detailsContainer.append(this.canvas.details);
			  }
			},
			resize : function( size ){

			},
			appendElement : function( id ){
			  //TODO error handling
			  var instance = new ArmyCalc.ElementInstance(this, this.template.children[id]);
			  this.children[id].push(instance);
			  return instance;
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
