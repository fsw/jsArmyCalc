(function(ArmyCalc){
	
	ArmyCalc.ElementInstance = (function(){
		
		ElementInstance.prototype = new ArmyCalc.Instance({},{});
		ElementInstance.prototype.constructor = ElementInstance;
		
		function ElementInstance(parent, template){
			ArmyCalc.Instance.call(this, parent, template);
			if (typeof parent.childrenUl != 'undefined'){
			  var anchor = $('<a href="#">' + template.name + '</a>');
			  this.sizeSpan = $('<span></span>');
			  this.li = $('<li></li>').append(anchor.prepend(sizeSpan));
			  this.childrenUl = $('<ul></ul>');
			  parent.childrenUl.append(this.li.append(this.childrenUl));
			}

		}
		
		ElementInstance.prototype.focus = function( ){
			if (typeof parent.childrenUl != 'undefined'){
			  this.li.addClass('current'); 
			}
		};

		return ElementInstance;
		
	}).call({});
	
})(ArmyCalc);
