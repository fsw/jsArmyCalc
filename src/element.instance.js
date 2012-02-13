(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({},{});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
			var that = this;
			if (typeof parent.canvas != 'undefined'){
			  var anchor = $('<a href="#">' + template.name + '</a>');
			  this.sizeSpan = $('<span> size </span>');
			  this.li = $('<li></li>').append(anchor.prepend(this.sizeSpan));
			  this.childrenUl = $('<ul></ul>');
			  anchor.click(function(){that.focus()});
			  parent.canvas.ul.append(this.li.append(this.childrenUl));
			  this.canvas = {ul: this.childrenUl, available: parent.canvas.available, details: parent.canvas.details};
			  this.availableUl = $('<ul></ul>');
			  for(var id in this.available){
				this.availableUl.append(this.available[id]._createAppender(this));
			  }
			  this.detailsDiv = $('<div> ... details ... </div>');
			}

		}
		
		ElementInstance.prototype.focus = function( ){
			if (typeof this.canvas != 'undefined'){
			  this.li.parent().find('li').removeClass('current');
			  this.li.addClass('current');
			  this.canvas.available.html('');
			  this.canvas.available.append(this.availableUl);
			  this.canvas.details.html('');
			  this.canvas.details.append(this.detailsDiv);
			}
		};

		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
