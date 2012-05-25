(function(ArmyCalc){
	ArmyCalc.Instance = (function(){
		
		function Instance(parent, template) {
			var that = this;
			if (parent instanceof ArmyCalc.Instance){
				this.parent = parent;
			}
			this.template = template;
			this.available = template.children;
			this.children = {};
			this.stats = {};
			for (var i in template.stats) {
			  this.stats[i] = template.stats[i];
			}
			
			this.maxTotalCosts = {};
			this.canvas = {};
			if (parent.canvas)
			{
			  this.canvas['children'] = parent.canvas['children'];
			  this.canvas['availableContainer'] = parent.canvas['availableContainer'];
			  this.canvas['detailsContainer'] = parent.canvas['detailsContainer'];
			  this.canvas['buttons'] = parent.canvas['buttons'];

			  if (typeof parent.canvas.children != 'undefined'){
				var anchor = $('<a href="#">' + template.name + '</a>');
				this.sizeSpan = $('<span></span>');
				this.folder = $('<span class="folder">&nbsp;</span>');
				anchor.prepend(this.sizeSpan);
				anchor.prepend(this.folder);
				this.li = $('<li></li>').append(anchor);
				this.canvas.children = $('<ul></ul>');
				anchor.click(function(){that.focus();});
				this.folder.click(function(){that.toggleFold();});
				parent.canvas.children.append(this.li.append(this.canvas.children));
			  }
			}

			this.canvas.available = $('<ul></ul>');	
			this.canvas.details = $('<div> ... details ... </div>');
			
			this.costs = {};
			if (this.parent)
			{
				this.setSize(template.defaultSize);
			}			
			//TODO append all required childrens
			for (var i in template.children) {
			  if(template.children[i] instanceof ArmyCalc.GroupTemplate)
			  {
				console.log('adding ' + i + ' to ' + this.template.id);
				this.children[i] = new ArmyCalc.GroupInstance(this, template.children[i]);
				//this.canvas.available.append('<li>GROUP</li>');
			  }
			  else
			  {
				console.log('adding ' + i + ' to ' + this.template.id);
				this.children[i] = [];
				this.canvas.available.append(template.children[i]._createAppender(this));
			  }
			}
			this.childrenCountChanged();
			if (this.parent)
			{
				this.parent.childrenCountChanged();
			}
		}
		
		Instance.prototype = {
			toggleFold : function( ){
				this.folder.toggleClass('unfold');
				this.canvas.children.toggle();
			},
			unfocus : function( ){
				this.li.removeClass('current');
				if (this.parent){
					this.parent.unfocus( );
				}
			},
			focus : function( depth ){
				if ((!depth) && (typeof _focused_element != 'undefined')){
					_focused_element.unfocus();
				}
				this.li.addClass('current');
				if (this.parent){
					this.parent.focus( true );
				}
				if (!depth)
				{
					this.canvas.availableContainer.html('');
					this.canvas.availableContainer.append(this.canvas.available);
				    this.canvas.detailsContainer.html('');
					this.canvas.detailsContainer.append(this.canvas.details);
					
					this.canvas.buttons.inc.toggle(true);
					this.canvas.buttons.dec.toggle(true);
					this.canvas.buttons.rem.toggle(true);
					this.canvas.buttons.up.toggle(true);
					this.canvas.buttons.down.toggle(true);
					
					_focused_element = this;
				}
			},
			getSize : function( ){
				return this.size;
			},
			setSize : function( size ){
				this.size = size;
				for (var i in this.template.costs) {
					this.costs[i] = template.costs[i] * this.size;
					this.costs[i] = template.costs[i] * this.size;
				}
				if (this.size > 1)
				{
					this.sizeSpan.text(this.size + 'x');
				}
				else
				{
					this.sizeSpan.text('');
				}
			},
			incSize : function( ){
				this.setSize(this.getSize() + 1);
			},
			decSize : function( ){
				this.setSize(this.getSize() - 1);
			},
			childrenCountChanged : function(){
				if (this.folder){
					this.folder.toggle(Object.keys(this.children).length > 0);
				}
			},
			appendElement : function( id ){
			  //TODO error handling
			  //alert( 'kaszanka' + id + this.template.children.length);
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
