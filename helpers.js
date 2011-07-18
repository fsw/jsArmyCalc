
function acAddCSSRule(sel, prop, val) {
    for(var i = 0; i < document.styleSheets.length; i++){
        var ss    = document.styleSheets[i];
        var rules = (ss.cssRules || ss.rules);
        var lsel  = sel.toLowerCase();

        for(var i2 = 0, len = rules.length; i2 < len; i2++){
            if(rules[i2].selectorText && (rules[i2].selectorText.toLowerCase() == lsel)){
                if(val != null){
                    rules[i2].style[prop] = val;
                    return;
                }
                else{
                    if(ss.deleteRule){
                        ss.deleteRule(i2);
                    }
                    else if(ss.removeRule){
                        ss.removeRule(i2);
                    }
                    else{
                        rules[i2].style.cssText = '';
                    }
                }
            }
        }
    }

    var ss = document.styleSheets[0] || {};
    if(ss.insertRule) {
        var rules = (ss.cssRules || ss.rules);
        ss.insertRule(sel + '{ ' + prop + ':' + val + '; }', rules.length);
    }
    else if(ss.addRule){
        ss.addRule(sel, prop + ':' + val + ';', 0);
    }
}



function acGetText( xml ){

	txt = '';

	$(xml).contents().each(function(){

			if((this.nodeType==3) && (!this.isElementContentWhitespace))
			txt += this.wholeText;
			if((this.nodeType!=3))
			txt += "<span class='trans "+$(this).attr('ln')+"'>"+$(this).text()+"</span>";

			/*if((this.nodeType==3) && (!this.isElementContentWhitespace) && (!txt))
			  txt = this.wholeText;
			  if((this.nodeType!=3) && ($(this).attr('ln')==lang))
			  txt = $(this).text();*/

			});

	return $.trim(txt);
}


