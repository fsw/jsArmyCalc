(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({},{});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
			var that = this;
			if (typeof parent.childrenUl != 'undefined'){
			  var anchor = $('<a href="#">' + template.name + '</a>');
			  this.sizeSpan = $('<span></span>');
			  this.li = $('<li></li>').append(anchor.prepend(this.sizeSpan));
			  this.childrenUl = $('<ul></ul>');
			  anchor.click(function(){that.focus()});
			  parent.childrenUl.append(this.li.append(this.childrenUl));
			  this.availableUl = $('<ul></ul>');
			  for(var id in this.available){
				this.availableUl.append('<li>' + this.available[id].name + '</li>');
			  }
			}

		}
		
		ElementInstance.prototype.focus = function( ){
			if (typeof this.li != 'undefined'){
			  this.li.addClass('current');
			  alert(this.template.name);
			}
		};

		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
