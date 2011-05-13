

function print_r(theObj){
	var ret="";
	if(theObj.constructor == Array ||
			theObj.constructor == Object){
		ret+="<ul>";
		for(var p in theObj){
			if(theObj[p]!=null &&
					(theObj[p].constructor == Array||
					 theObj[p].constructor == Object)){
				ret+="<li>["+p+"] => "+typeof(theObj)+"</li>";
				ret+="<ul>";
				ret+=print_r(theObj[p]);
				ret+="</ul>";
			} else {
				ret+="<li>["+p+"] => "+theObj[p]+"</li>";
			}
		}
		ret+="</ul>";
	}
	return ret;
}

function xmlquote(s) {
	if(s)
		return String(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('\'','&apos;').replace('"','&quot;');
	else
		return '';
}


//##########################
// http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}

//#############################################################







//unique radio id
var urid = 1;
var saveimage;
var templates = [];
var uidtotid = [];
var units = [];
var category = [];

var totalspan;
var canvas;
var list;
var details;
var activeunit =false;
var info=[];
var valout;
var timeout;
var sortabletounit= [];
var ruleset = {};
var acarmyid;
var acrulesetid;
var mediapath;

var acurl;
var total = 0 ;

var sizelimit;
var armyname;
var limitspan;
var totaldiv;
var sizeedit;
var nameedit;



function setSizeLimit(l, change){
	l = Number(l);
	sizelimit = l;
	limitspan.text(l);
	totaldiv.toggleClass( 'oversized', ( total > sizelimit ) );
	sizeedit.val(l);
	if(change){
		//alert('upd');
		treeChange();
	}
}

function setArmyName( n ){
	armyname = n;	
	nameedit.val(n);
	
}

function getTWA(){

	//TODO noxml
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
	xml += "<army version='2.0'>\n";

	xml += "<ruleset>\n";
	xml += "<name>" + xmlquote( ruleset.name ) + "</name>\n"
	xml += "<uid>" + xmlquote( ruleset.uid ) + "</uid>\n"
	xml += "<revision>" + xmlquote( ruleset.revision ) + "</revision>\n"
	//xml += "<filemd5></filemd5>\n"
	xml += "</ruleset>\n";

	xml += "<name>" + xmlquote( armyname ) + "</name>\n"
	xml += "<size>" + xmlquote( sizelimit ) + "</size>\n"
	//xml += "<extraParams></extraParams>\n"
	
	xml += "<units>\n";
	
	//sortabletounit
	var result = list.sortable('toArray');


	function outBonuses(root){
		if(root.bonuses){
			for (var i=0; i< root.bonuses.length;i++){

				if(root.bonuses[i].count > 0){
					var name = 'bonus';

					if(root.bonuses[i].group)
						name = 'bonuses';

					xml += "<"+name+">\n";
		 			xml += "<uid>" + xmlquote( root.bonuses[i].uid ) + "</uid>\n";
					xml += "<count>" + root.bonuses[i].count + "</count>\n";
					outBonuses(root.bonuses[i]);
					xml += "</"+name+">\n";
				}
			}
		}

	};	

	result.forEach( function(elem,idx){

			var unit = units[sortabletounit[Number(elem)]];

			xml += "<unit>\n";
			xml += "<uid>" + xmlquote( templates[unit.tid].uid ) + "</uid>\n";
			xml += "<count>" + unit.count + "</count>\n";
			//return '<unit';

			outBonuses(unit);

			xml += "</unit>\n";
			})


	xml += "</units>\n";	
	xml += '</army>';

	return xml;

}

function getSth(what){

	//zeby sie glupio nie pytal
	window.onbeforeunload = null;
	
	$('#hiddenform').attr('action',acurl+'/calc/'+what+'.php');
	$('#hiddenformrid').val( acrulesetid );
	$('#hiddenformtwa').val( getTWA() );
	$('#hiddenformfname').val( armyname+'-'+ruleset.name+'-'+sizelimit+'pts' );
	$('#hiddenform').submit(  );
	
	window.onbeforeunload = goodbye;
	
}

function reValidate(){

if(acrulesetid){

	jQuery.ajax({
url:acurl+'/calc/validate.php',
dataType:'html',
type:'POST',
data:{ 'twa':getTWA(), 'rid':acrulesetid },
success:function(text,st){
valout.html(text);
}
});
}
else {
valout.text('validation is available only at armycalc.com');
}
}

function saveButtonClick(){
	if(! $(saveimage).hasClass('savedisabled')){
		$(saveimage).addClass('savedisabled');
		saveArmyOnline();
	}
}

function saveArmyOnline(){
	if ( acarmyid ) {	
		//zeby sie z niereavalidowala
		if(timeout)
			clearTimeout( timeout );
	
		jQuery.ajax({
			url: acurl+'/calc/save.php',
			dataType:'html',
			type:'POST',
			data:{ 'twa':getTWA(), 'armyid':acarmyid, 'size':total, 'name':armyname },
			success:function(text,st){
			valout.html(text);
			}
			});
	} else {
		
		alert('saving is available only in real editor:)');
		throw 'x';	
	}

}

function treeChange( force ){

	//alert('as:'+force);	
	if(!force){
		$(saveimage).removeClass('savedisabled')
	}	

	valout.text( 'please wait...' );	

	if(timeout)
		clearTimeout( timeout );

	var xxx = 3000;
	if( force )
		xxx = 0;
	timeout = setTimeout( 'reValidate()', xxx );

}

function UnitListClick(){
	activeunit.detailsbox.hide();
	this.detailsbox.show();
	activeunit = this;	
}

function UnitDeleteClick(){
	var toto=this;
	units.forEach(function(elem,idx){
			if(elem==toto)
			delete units[idx];
			//alert(elem.name);
			});
	this.listbox.remove();
	this.detailsbox.remove();
	RecalculateTotal();


}
function RecalculateTotal(){
	total=0;
	units.forEach(function(elem,idx){
			total += elem.cost;
			});

	totalspan.text(total);

	totaldiv.toggleClass( 'oversized', ( total > sizelimit ) );
		
	treeChange(false);
}

function UnitMinusClick(){
	if( this.count > templates[this.tid].min_count){
		this.count-=1;
		this.countChange();
	}
}
function UnitPlusClick(){
	//alert(templates[this.tid].max_count);
	if( (!templates[this.tid].max_count) || (this.count < templates[this.tid].max_count)){
		this.count+=1;
		this.countChange();
	}
}



function UnitCountChange(){

	this.countdiv.text(this.count);
	var lagaczigi = this;

	if( this.count <= templates[this.tid].min_count){
		this.minusdiv.addClass('uminusd');
		this.minusdiv.removeClass('uminus');
	} else {
		this.minusdiv.addClass('uminus');
		this.minusdiv.removeClass('uminusd');	
	}

	if( (templates[this.tid].max_count) && (this.count >= templates[this.tid].max_count)){
		this.plusdiv.addClass('uplusd');
		this.plusdiv.removeClass('uplus');
	} else {
		this.plusdiv.addClass('uplus');
		this.plusdiv.removeClass('uplusd');	
	}

	//tutaj trzeba sie dostac do wszystkich bonusow i zupdejtowac

	//this.unitCountChange();

	this.cost = ( this.count * templates[this.tid].cpu ) + templates[this.tid].base_cost;


	for (var i=0; i< this.bonuses.length; i++){
		this.cost += this.bonuses[i].getCost();
	}

	this.redrawList();
}

function UnitRedrawList(){
	this.listspan.empty();


	if(this.count!=1)
		this.listspan.append($('<span><i>'+this.count+'x</i>'+' '+this.name+' <i class="points">('+this.cost+'pts)</i></span>'));
	else	this.listspan.append($('<span>'+this.name+' <i class="points">('+this.cost+'pts)</i></span>'));

	RecalculateTotal();

}

function BonusUpdateCount(){


	//TODO
	this.unit.countChange();
	//var oldc = this.cost;
	//	this.cost
	//	if(this.par){
	//
	//	}

}

function BonusSetZero(){
	
	if(!this.group)
		if(this.extrarow)
			this.extrarow.toggle( 0 );

	if (this.bonuses)
		for (var i=0; i< this.bonuses.length; i++)
			this.bonuses[i].setZero();
		
}

function BonusGetCost(){

	this.cost = 0;


	this.subcount = 0;

	if (this.bonuses)
		if(this.count){
			//alert(this.name);
			for (var i=0; i< this.bonuses.length; i++){
				this.cost += this.bonuses[i].getCost();
				this.subcount += this.bonuses[i].count;
			}
		} else {
			for (var i=0; i< this.bonuses.length; i++)
				this.bonuses[i].setZero();
		}

	if(!this.group){
		if(this.extrarow)
			this.extrarow.toggle( this.count > 0);

		this.bul.toggle( this.count > 0 );
		this.cost += (this.base_cost+(this.unit.count * this.cpu));
		this.cost *= this.count;
	} else {

		if ((this.min_count!=1) || (this.max_count!=1))
		this.limitsspan.html(' '+
				this.min_count+' - '+this.subcount+' - '+this.max_count_disp+' &mdash; '+
				this.min_cost+' / '+this.cost+' / '+this.max_cost_disp);

		if(	(this.cost < this.min_cost) ||
				(this.subcount < this.min_count) ||
				(this.max_count && (this.subcount > this.max_count)) ||
				(this.max_cost && (this.cost > this.max_cost)))
			this.limitsspan.css('color','red');
		else
			this.limitsspan.css('color','black');



	};

	return this.cost;
	//this.unit.count
	//		this.bonuses.push( sb );

}

function BonusClearSub(){

	for (var i=0; i< this.bonuses.length;i++){
		this.bonuses[i].count = 0;
	}

}

function createBonus( unit, par , bon , xml , topradioname , first ){

	//this.total_cpu = 0;
	//this.total_base_cost = 0;

	this.unit = unit;
	this.clearSub = BonusClearSub;
  	this.updateCount = BonusUpdateCount;
	this.getCost = BonusGetCost;
	this.setZero = BonusSetZero;
	

	//this.unitCountChange=BonusUnitCountChange;

	if((bon.extra_name) && (bon.extra)){
		this.extrarow = $('<tr></tr>');
		unit.fieldsbody.append( this.extrarow );

		this.extrarow.append('<td>'+bon.extra_name+'</td>');

		for(var i = 0; i<info.display_fields.length; i++){
			var t='-';
			if(bon.extra[info.display_fields[i].name])
				t=bon.extra[info.display_fields[i].name];
			this.extrarow.append('<td>'+t+'</td>');

		}
	}

	this.name = bon.name;
	this.li=$("<li></li>");
	this.group = bon.group;	
	this.count = bon.min_count;
	
	if(topradioname && first){
		this.count = 1;
	}

	if(xml && (xml.nodeType==1)){
		this.count =  getSubNode( xml, 'count', this.count, true);
	}

	this.min_count = bon.min_count;
	this.max_count = bon.max_count;
	this.uid = bon.uid;


	var lagaczigi = this;
	var radioname = null;


	var x;
	var title;
	this.bul = $('<ul class="bul"></ul>');
	if(this.group){
		this.count = 1;
		this.base_cost = 0;
		this.cpu = 0;
		this.min_cost = bon.min_cost;
		this.max_cost = bon.max_cost;
		this.max_cost_disp = bon.max_cost_disp;
		this.max_count_disp = bon.max_count_disp;
		
		if((bon.min_count==1) && (bon.max_count==1)){
			radioname = 'radio_'+bon.uid+'_'+urid;
			urid++;
		}
		x = $('<fieldset></fieldset>');
		title = $('<legend>'+this.name+'</legend>');
		x.append( title );
		this.limitsspan = $('<span></span>')
			title.append(this.limitsspan);
	} else {
		this.base_cost = bon.base_cost;
		this.cpu = bon.cpu;
		x = $("<div></div>");		
		title = $('<div class="btitle">'+this.name+'</div>');
		this.li.append(title);
		if((this.min_count==0) && (this.max_count==1)){
		
			var c = null;
			//alert(topradioname)	
			if(topradioname){
				
				c =$("<input type='radio' name='"+xmlquote(topradioname)+"'/>")
				c.click(function(){
					par.clearSub();
					lagaczigi.count=1;
					lagaczigi.updateCount();
				});
			
			}
			else {
				c =$("<input type='checkbox'/>");	
				c.click(function(){
						if(this.checked)
						lagaczigi.count=1;
						else
						lagaczigi.count=0;
						lagaczigi.updateCount();
						});
			}
			
			if(this.count > 0)
				c.attr( 'checked', true );
			title.prepend(c);
		} else if ((this.min_count==1) && (this.max_count==1)){
			title.prepend($("<input type='checkbox' checked disabled/>"));
		} else if ( this.min_count==this.max_count ) {
			title.prepend($("<b>"+this.count+"x </b>"));		
		} else {
			this.minusdiv = $("<div class='uminus'></div>");
			this.countdiv = $("<span class='bcount'>"+this.count+"</span>");
			this.plusdiv = $("<div class='uplus'></div>");	

			//TODO: disable plus/minus buttons
			this.plusdiv.click(function(){
					if( (lagaczigi.count < lagaczigi.max_count) 
						|| (lagaczigi.max_count == null)){
					lagaczigi.count++;
					lagaczigi.countdiv.text(lagaczigi.count);
					lagaczigi.updateCount();
					}
					});
			this.minusdiv.click(function(){
					if( lagaczigi.count > lagaczigi.min_count ){
					lagaczigi.count--;
					lagaczigi.countdiv.text(lagaczigi.count);
					lagaczigi.updateCount();
					}
					});


			title.prepend( this.plusdiv );
			title.prepend( this.countdiv );
			title.prepend( this.minusdiv );

			
		
		}
		if((this.base_cost+this.cpu)>0)
			title.append($("<i class='points'> ("+(this.base_cost+this.cpu)+"p)</i>"));
		
		if (bon.description){
			var descdiv = $("<div class='udesc'></div>");
			title.append( descdiv );
			descdiv.click( function(){ 
					alert(bon.description) 
					} );
			}

		title.append($("<div style='clear:both;'></div>"));

	}

	//title.append(' c:'+this.count);
	if(bon.bonuses.length){
		/*var folder = $('<div class="unfold">f</div>');
		  title.prepend(folder);
		  folder.click(function(){
		//bul.slideToggle();
		});
		 */
		x.append(this.bul);

		this.bonuses = [];	

		var first = true;
		for (var i=0; i< bon.bonuses.length;i++){

			var bxml = null;
				if(xml){
					var y = xml.childNodes;
					for (var j=0;j<y.length;j++){
						if(y[j].nodeType==1)
						 if(getSubNode(y[j],'uid','')
							== bon.bonuses[i].uid)
						bxml = y[j];
					}
				}

	
			var sb = new createBonus(unit, this, bon.bonuses[i],bxml,radioname,first);
			first = false;
			this.bonuses.push( sb );
			//this.total_cpu += 
			//this.total_base_cost +=	
		}

	}

	this.li.append(x);
	this.par = par;	
	par.bul.append(this.li);


}

function Unit(templateid, xml, listid){

	this.cost = 0;
	this.name = templates[templateid].default_name;
	this.tid = templateid;

	this.count = templates[templateid].min_count;

	if(xml)
		this.count = getSubNode(xml, 'count', this.count, true);
	//this.unitCountChange = BonusUnitCountChange;

	this.listspan = $("<span></span>");


	this.listbox = $("<li id='"+listid+"' class='unit'>"+"</li>");


	this.listbox.append(this.listspan);
	var delbutton = $("<div class='delete'></div>");
	this.listbox.append(delbutton);
	var lagaczigi = this;
	this.listClick = UnitListClick;
	this.deleteClick = UnitDeleteClick;
	this.redrawList = UnitRedrawList;

	this.redrawList();
	//this.delete()=

	delbutton.click(function(){lagaczigi.deleteClick()});
	//this.listbox.draggable();
	//this.detailsbox = 
	//alert(templateid);
	//this.listbox.rodzic=this;
	if(activeunit){
		if(activeunit.detailsbox)
			activeunit.detailsbox.hide();
	}
	activeunit = this;
	//this.listbox.parentUnit = this;

	this.listbox.click(function(){lagaczigi.listClick()});

	/*function(){
	  activeunit.detailsbox.hide();
	  lagaczigi.detailsbox.show();
	  activeunit = lagaczigi;
	//alert(this.rodzic);	
	})*/
	list.append(this.listbox);

	this.detailsbox = $("<div class='unitdetails'></div>");
	this.maindiv = $("<div class='unitmaindiv'><h3>"+this.name+"</h3><div style='clear:both;'></div></div>");
	this.minusdiv = $("<div class='uminus'></div>");
	this.countdiv = $("<span class='ucount'></span>");
	this.plusdiv = $("<div class='uplus'></div>");

	if( (templates[this.tid].min_count != 1) || (templates[this.tid].max_count != 1) ){
		this.maindiv.prepend(this.plusdiv);
		this.maindiv.prepend(this.countdiv);
		this.maindiv.prepend(this.minusdiv);
	}
		
	this.maindiv.append( templates[templateid].description );


	this.detailsbox.append(this.maindiv);
	//this.detailsbox.append('XXX'+templates[templateid].thumbnail+'XXX');
	
	if( templates[templateid].thumbnail )
		this.detailsbox.append($("<img src='"+mediapath+templates[templateid].thumbnail+"' class='unitthumbnail'/>"));
	else
		this.detailsbox.append($("<img src='img/nothumbnail.png' class='unitthumbnail'/>"));

	

	var ftab = $("<table class='ftab'></table>");
	this.detailsbox.append(ftab);
	var row = $('<tr></tr>');
	ftab.append($('<thead></thead>').append(row));
	var dflength = info.display_fields.length;
	row.append('<th style="width:30%;"></th>');
	for( var i = 0; i < dflength ; i ++ ){
		row.append('<th style="width:'+Math.round(70/dflength)+'%;">'+info.display_fields[i].name+'</th>');
	}
	this.fieldsbody = $('<tbody></tbody>');
	ftab.append(this.fieldsbody);
	row = $('<tr></tr>');
	this.fieldsbody.append(row);

	row.append('<td>'+templates[this.tid].extra_name+'</td>');

	for(var i = 0; i<info.display_fields.length; i++){
		var t ='-';

		if ( templates[this.tid].extra[info.display_fields[i].name] )
			t = templates[this.tid].extra[info.display_fields[i].name];
		row.append('<td>'+t+'</td>');

	}




	this.bonuses = [];

	if( templates[this.tid].bonuses.length > 0 ){

		this.detailsbox.append( '<h4>additional options</h4>' );	
		this.bul=$('<ul class="bul"></ul>');
		this.detailsbox.append(this.bul);
		//this.detailsbox.append(print_r(templates[this.tid].extra));

		for (var i=0; i< templates[this.tid].bonuses.length;i++){
			var bxml = null;
			if(xml){
				var y = xml.childNodes;
				for (var j=0;j<y.length;j++){
				if(y[j].nodeType==1){
					//alert('N:'+y[j].attributes.getNamedItem('uid').nodeValue 
					//	+'  B:'+templates[this.tid].bonuses[i].uid);
		 			if( getSubNode(y[j], 'uid', '')
						== templates[this.tid].bonuses[i].uid){
					//	alert('ok');
						bxml = y[j];
					}
					}
				}
			}
	//xml.attributes.getNamedItem('count').nodeValue);
	
			this.bonuses.push( new createBonus( this, this, templates[this.tid].bonuses[i], bxml) );
		}
	} else
		this.detailsbox.append( '<p>No addons available.</p>' );	


	/*
	   this.bul.append(
	   createBonus({
group:true,
name:'bonuses',
min_count:0,
max_count:null,
min_cost:0,
max_cost:null,
bonuses:templates[this.tid].bonuses
})
);
	 */
		this.countChange = UnitCountChange;
		this.plusClick = UnitPlusClick;
		this.minusClick = UnitMinusClick;

		this.plusdiv.click(function(){lagaczigi.plusClick()});
		this.minusdiv.click(function(){lagaczigi.minusClick()});


		//var plusbutton = $("<div style></div>");
		details.append(this.detailsbox);
		this.detailsbox.disableSelection();

		this.countChange();

		//.SortableAddItem(this.listbox);
		//	list.SortableDestroy();

		/*	list.Sortable({
accept: 'unit',
activeclass : 'unitactive',
hoverclass : 'unithover',
helperclass : 'unithelper',
opacity: 0.5,
fit: false
});
		 */	
		}

function newUnit(templateid , xml){

	units.push(new Unit(templateid, xml , sortabletounit.length));

	sortabletounit.push(units.length-1);

	RecalculateTotal();

}


function getXmlParser(text){

	var xmlDoc;

	if (window.DOMParser)
	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(text,"text/xml");
	}
	else // Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(text);
	}

	return xmlDoc;

}
	function getSubNode( node,param,def,numeric ){
		
			//if(numeric)
			//	alert( param );

			//var x = node.getElementsByTagName( param );
			var y = node.childNodes;
			for (var j=0;j<y.length;j++){
			if( y[j].nodeName == param ){
			
			// alert(y[j].nodeName);
				
			 //alert(y[j].childNodes[0].nodeValue);
		//if(numeric)
			//	alert(x.length)	
				if(y[j].childNodes[0]){
				if(numeric){
					//alert(param+': '+Number(x[0].childNodes[0].nodeValue));
					if( y[j].childNodes[0].nodeValue == 'unbounded' )
						return null;
					else
						return Number( y[j].childNodes[0].nodeValue );
				}
				else
					return y[j].childNodes[0].nodeValue;
				}
			}
			}
			return def;
	
		}
		function getValue( node,param,def,numeric ){

			var at = node.attributes;

			if(at.getNamedItem(param))
				if(numeric)
					if(at.getNamedItem(param).nodeValue == 'unbounded')
						return null;
					else	
						return Number(at.getNamedItem(param).nodeValue);
				else
					return at.getNamedItem(param).nodeValue;
			else
				return def;
		}


	function templateFromXml(node){

			function pushBonuses( wat, bnode ){

			wat.bonuses=[];
			wat.extra=[];
		if(bnode){
				var y = bnode.childNodes;

				for (var j=0;j<y.length;j++){
					if( y[j].nodeName == 'extraFields' ){
						
						wat.extra_name = '';

						var z = y[j].childNodes;
						for (var i=0; i < z.length; i++){
							if( z[i].nodeName == 'field' ){
								
								wat.extra[getSubNode( z[i], 'name' , '' , false)]=
								getSubNode( z[i], 'value' , '' , false)
								//TODO
								//alert(z[i].nodeValue);
								//wat.extra[z[i].attributes.getNamedItem('name').nodeValue]=
								//	z[i].childNodes[0].nodeValue;
							}
							if(z[i].nodeName=='display'){
								//alert(z[i].childNodes[0].nodeValue);
								wat.extra_name = z[i].childNodes[0].nodeValue.replace(' ','&nbsp;');
							}
						}
					}	

					if( y[j].nodeName == 'bonuses' ){
						var bonus = {
group:true, 
      name:getSubNode(y[j],'name',''),
      uid:getSubNode(y[j],'uid',''),
      min_count:getValue(y[j],'minCount',0,true),
      max_count:getValue(y[j],'maxCount',null,true),
      min_cost:getSubNode(y[j],'minCost',0,true),
      max_cost:getSubNode(y[j],'maxCost',null,true)
						};

						if(bonus.max_count)
							bonus.max_count_disp=bonus.max_count;
						else
							bonus.max_count_disp='&#8734;';

						if(bonus.max_cost)
							bonus.max_cost_disp=bonus.max_cost;
						else
							bonus.max_cost_disp='&#8734;';



						pushBonuses(bonus, y[j]);
						wat.bonuses.push(bonus);
					}
					if( y[j].nodeName == 'bonus' ){
						var bonus = { 
group:false, 
      name:getSubNode(y[j],'name','noname'),
      uid:getSubNode(y[j],'uid',''),
      min_count:getValue(y[j],'minCount',0,true),
      description:getSubNode(y[j],'description',''),
      max_count:getValue(y[j],'maxCount',null,true),
      base_cost:getSubNode(y[j],'baseCost',0,true),
      cpu:getSubNode(y[j],'costPerUnit',0,true)
						};
						//alert(bonus.description)
						pushBonuses(bonus,y[j]);
						wat.bonuses.push(bonus);
					}

				}
			}
			//return ret;
		}

		var x = [];
		

		//var at = node.attributes;
		x.default_name = 'unnamed';
		x.base_cost = getSubNode(node,'baseCost',0,true);
		x.cpu = getSubNode(node,'costPerUnit',0,true);
		x.min_count = getValue(node,'minCount',1,true);
		x.max_count = getValue(node,'maxCount',null,true);
      		x.uid = getSubNode(node,'uid','');
 		x.thumbnail = getSubNode(node,'thumbnail',null);
		//alert(x.thumbnail);	
		x.categories = [];
		//x.extra = [];
		//x.bonuses = [];
		/*
		x.default_name = at.getNamedItem('defaultName').nodeValue.replace(' ','&nbsp;');
		x.base_cost = Number(at.getNamedItem('baseCost').nodeValue);
		x.uid = at.getNamedItem('uid').nodeValue;
		x.cpu = Number(at.getNamedItem('costPerUnit').nodeValue);
		x.min_count = Number(at.getNamedItem('minCount').nodeValue);

		if(at.getNamedItem('maxCount'))
			x.max_count = Number(at.getNamedItem('maxCount').nodeValue);
		*/
		pushBonuses(x,node);

		var y = node.childNodes;

		//x.extra={};

		for (var j=0;j<y.length;j++){
			if(y[j].nodeName=='description'){
				var txt = y[j].childNodes[0];
				if(txt)
					x.description=txt.nodeValue;
				else
					x.description='';
			}
			if(y[j].nodeName=='name'){
				var txt = y[j].childNodes[0];
				if(txt)
					x.default_name=txt.nodeValue;
				else
					x.default_name='';
			}
			if( y[j].nodeName == 'categories' ){
						
						var z = y[j].childNodes;
						for (var i=0; i < z.length; i++){
							if(z[i].nodeName=='category'){
								//alert(z[i].childNodes[0].nodeValue)
								x.categories.push( z[i].childNodes[0].nodeValue );
							}
						}
					
			}
		}
		x.display_cost = x.base_cost + ( x.min_count * x.cpu );


		//x.description = node.getElementsByTagName('description')[0].nodeValue;

		return x;
	}

//init function
function initCalculator( canvasid , options ){
	
	canvas = $("#"+canvasid);
	
	canvas.html("<div style='padding:20px;'>loading files<br/>please wait...</div>");	

	if( typeof options.twrurl == 'string' ){
		//console.log(options.twrurl);
		
	} 
	
	if( typeof options.infourl == 'string' ){
		//alert(options.infourl);
		$.get(options.infourl,{}, function(data){
			options.rulesetxml = data;
			delete options.infourl;
			initCalculator( canvasid, options );
 		 	//alert("Data Loaded: " + data);
		},"text");
		//rulesetxml
		return;
	}
		
	function laduj(n){
		
		if (options.unitsurls.length>n)
			$.get(options.unitsurls[n],{}, function(data){
			options.unitsxml[n] = data;
		 	laduj(n+1);
			//alert("Data Loaded: " + data);
			},"text");
		else{
			delete options.unitsurls;
			initCalculator( canvasid, options );
		}
	}

	if( typeof options.unitsurls == 'object' ){
		//alert(options.unitsurls[0]);
		//rulesetxml
		options.unitsxml = [];
		laduj(0);
		return;
	}
	
	acarmyid = options.acarmyid;
	acrulesetid = options.acrulesetid;
	mediapath = options.media;
	acurl = options.acurl;
	
	canvas.html("");	


	/*
	   text=text+"</note>";

	   if (window.DOMParser)
	   {
	   parser=new DOMParser();
	   xmlDoc=parser.parseFromString(text,"text/xml");
	   }
	   else // Internet Explorer
	   {
	   xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	   xmlDoc.async="false";
	   xmlDoc.loadXML(text);
	   }

	   document.getElementById("to").innerHTML=
	   xmlDoc.getElementsByTagName("to")[0].childNodes[0].nodeValue;
	   document.getElementById("from").innerHTML=
	   xmlDoc.getElementsByTagName("from")[0].childNodes[0].nodeValue;
	   document.getElementById("message").innerHTML=
	   xmlDoc.getElementsByTagName("body")[0].childNodes[0].nodeValue;

	 */

	//alert("Hello world!");

	canvas.addClass('aecanvas');


	var header=$('<div class="header"></div>');
	canvas.append(header);
	
	var mainmenuwrapper = $("<div class='mainmenu'></div>");
	var mainmenu = $("<ul></ul>");

	mainmenuwrapper.append(mainmenu);


	var header_size=$('<div class="size"></div>');
	sizeedit=$('<input class="sizeedit" type="edit" value="'+1000+'" />');
	header_size.append('size limit: ');
	header_size.append(sizeedit);
	sizeedit.change( function(){ setSizeLimit($(this).val(),true) } );
	
	var header_name=$('<div class="name"></div>');
	nameedit=$('<input class="nameedit" type="edit" value="'+armyname+'" />');
	header_name.append('army name: ');
	header_name.append(nameedit);
	nameedit.change( function(){ setArmyName($(this).val()) } );
	
	
	
	//var revalimage=$('<img title="Revalidate" src="img/revalidate.png" class="button" style="margin:2px; float:left;" />');
//revalimage.click(function(){treeChange(true);});
//footer.append(revalimage);

	var header_buttons=$("<div class='buttons'></div>");

	var pdfimage=$('<a class="buttonpdf"></a>');
	pdfimage.click(function(){getSth('pdf');});
	header_buttons.append(pdfimage);

	var htmlimage=$('<a class="buttonhtml"></a>');
	htmlimage.click(function(){getSth('html');});
	header_buttons.append(htmlimage);
	
	var twaimage=$('<a class="buttontwa"></a>');
	twaimage.click(function(){getSth('twa');});
	header_buttons.append(twaimage);
	
	
	
	header_buttons.append( $('<a class="buttonspacer"></a>') );
	
	
	saveimage=$('<a class="buttonsave"></a>');
	saveimage.addClass('savedisabled');	
	saveimage.click(saveButtonClick);	
	header_buttons.append(saveimage);

	var helpimage=$('<a href="'+acurl+'view_doc.php?doc=calc" target="_blank" class="buttonhelp"></a>');
	header_buttons.append(helpimage);
	
	var maximizeimage=$('<a class="buttonmaximize"></a>');
	header_buttons.append(maximizeimage);

	var firstrow = $("<div class='hrow'></div>");
	var secondrow = $("<div></div>");

	firstrow.append( header_buttons );
	firstrow.append( header_size );
	firstrow.append( header_name );
	secondrow.append( $("<div></div>").append(mainmenuwrapper) );

	header.append(firstrow);
	header.append(secondrow);






	function getCategory(name){

		//alert(name);
		if(!category[name]){
			category[name]={};
			category[name].menuitem= $( '<li>'+name+'</li>' );
			category[name].menuitemul = $('<ul></ul>');
			category[name].menuitem.append(category[name].menuitemul);
	//NARAZIE tak  potem alfabetycznie?
		
			mainmenu.append(category[name].menuitem);

			$('ul', category[name].menuitem).hide();

			category[name].menuitem.hover(
								function () {
								//$('ul', this).slideDown(500);
								$('ul', this).show();

								}, 
								function () {
								$('ul', this).hide();

								//$('ul', this).slideUp(500);
								}

							      );


		}
		return category[name];
	}

	function appendCategoriesToMenu(){
		

	}

	function addTemplate( tem ){
		//	alert('2');	
	
		//var name = category.attributes.getNamedItem('name').nodeValue;
		//return 0;
			if (tem.nodeType==1)
			{//Process only element nodes (type 1) 
				//alert(y[j].nodeName);
				var t = templateFromXml(tem);
				
				templates.push( t );
				//alert(t.uid);
				uidtotid[t.uid] = templates.length - 1;

			//alert(t.categories);
			for (var f=0;f<t.categories.length;f++){		
				//if (f==1)
					//alert('ok');
				getCategory(t.categories[f]).menuitemul.append($(
						'<li><a href="javascript:newUnit('+(templates.length-1)+')">'
						+t.default_name.replace(/ /g,'&nbsp;')+'&nbsp;('+t.display_cost+')'
							+'</a></li>'));
				}
		} 
			 	

						/*	category.templates.forEach(function(template,idx){
							templates.push(template);

							menuitemul.append($(
							'<li><a href="javascript:newUnit('+(templates.length-1)+')">'
							+template.default_name.replace(' ','&nbsp;')
							+'</a></li>'));
							});		
						 */

							/*	menuitem.click(
							function () {
							$('ul', this).slideDown(100);
						//     $('ul', this).show();
						} 
						);
						 */
						//menuitemul.click( function(){ this.hide() });



	}
	//print_r(rulesetdata);

	var rinfo = getXmlParser(options.rulesetxml).documentElement;
	var tmpinfo = rinfo.childNodes;
	
	ruleset.defaultArmySize = 1000;
	ruleset.defaultArmyName = 'army';


	info.display_fields = [];
	for (var i=0;i<tmpinfo.length;i++){

		if( tmpinfo[i].nodeName == 'uid' ){
			//alert(tmpinfo[i].nodeValue);
			ruleset.uid = tmpinfo[i].childNodes[0].nodeValue;
		}
		if( tmpinfo[i].nodeName == 'revision' )
			ruleset.revision = tmpinfo[i].childNodes[0].nodeValue;
		if( tmpinfo[i].nodeName == 'name' )
			ruleset.name = tmpinfo[i].childNodes[0].nodeValue;
		if( tmpinfo[i].nodeName == 'defaultArmyName' )
			ruleset.defaultArmyName = tmpinfo[i].childNodes[0].nodeValue;
		if( tmpinfo[i].nodeName == 'defaultArmySize' )
			if( Number(tmpinfo[i].childNodes[0].nodeValue) > 0 )
				ruleset.defaultArmySize = Number(tmpinfo[i].childNodes[0].nodeValue);


		if( tmpinfo[i].nodeName == 'displayFields' ){
			var z = tmpinfo[i].childNodes;
			for (var j=0; j < z.length; j++){
				if(z[j].nodeName=='field')
					info.display_fields.push({
							'name' : z[j].getElementsByTagName('name')[0].childNodes[0].nodeValue,
							'default' : z[j].getElementsByTagName('default')[0].childNodes[0].nodeValue
					});
			}
		}	
	}

	//rulesetunits.forEach(addCategory);
		//TODO if not list parse 1 file
	for (var f=0;f<options.unitsxml.length;f++){
		//alert(options.unitsxml[f]);
		var x=getXmlParser(options.unitsxml[f]);
		//alert(x);
		x = x.documentElement.childNodes;
		//alert(x.length)	
		for (var i=0;i<x.length;i++)
		{
			//alert(x[i].nodeValue); 
			if (x[i].nodeType==1)
			{//Process only element nodes (type 1) 
				//  if(x[i].nodeName=='Category')
				addTemplate(x[i]);
			} 
		}
	}
	
	var unitslist = $('<div class="unitslist"></div>');
	list = $('<ul></ul>');
	unitslist.append(list);
	totaldiv=$('<div style="text-align:right;margin:10px;">total:</div>');
	totalspan= $('<span></span>');
	limitspan= $('<span></span>');
	totaldiv.append(totalspan);
	totaldiv.append(' / ');
	totaldiv.append(limitspan);

	unitslist.append(totaldiv);
	/*	list.Sortable({
accept: 'unit',
activeclass : 'unitactive',
hoverclass : 'unithover',
helperclass : 'unithelper',
opacity: 0.5,
fit: false
});*/
	list.sortable({
placeholder: 'unit-placeholder',
change: function(){treeChange(false)}
});
list.disableSelection();

canvas.append(unitslist);
//for(i=0;i<100;i++)
//unitslist.append('bla bla bla<br/>');
details=$('<div class="details"></div>');
canvas.append(details);

var footer=$('<div class="footer">...</div>');
canvas.append(footer);

maximizeimage.click( function(){
		canvas.toggleClass('aecanvas-fullscreen');
		maximizeimage.toggleClass('buttonmaximize-active',canvas.hasClass('aecanvas-fullscreen'));

		if(canvas.hasClass('aecanvas-fullscreen')){
			var hhh = $(window).height()-130;
			unitslist.height(hhh);
			details.height(hhh);
		}
		else {
			unitslist.height(400);
			details.height(400);		
		}
	});




canvas.append($('<form id="hiddenform" method="post" style="display:none;" action="">'+
		'<input id="hiddenformtwa" type="hidden" name="twa"/>'+
		'<input id="hiddenformrid" type="hidden" name="rid"/>'+
		'<input id="hiddenformfname" type="hidden" name="fname"/>'+
		'</form>'));

//if(acarmyid)
//{


footer.append('<div style="clear:both;"></div>');
valout = $('<div class="valout" id="valout">...</div>');
canvas.append( valout );

var sizetoset = ruleset.defaultArmySize;
var nametoset = ruleset.defaultArmyName;
//alert('rulesetdefault:'+nametoset);

//load twa
if(options.armyxml){
	var twa = getXmlParser(options.armyxml).documentElement;
	var sizetoset = getSubNode( twa , 'size', sizetoset, true);
	var nametoset = getSubNode( twa , 'name', nametoset, false);
	//alert('army:'+nametoset);


	var sunits = twa.getElementsByTagName('units')[0].childNodes;
	//TODO check ruleset uid
	for(var i=0;i<sunits.length;i++){
		if (sunits[i].nodeName=='unit'){

			var uid = getSubNode( sunits[i] , 'uid', 0 );
			//alert(uid)
			if( !(uidtotid[uid] == null) ){
				//alert('is');
				newUnit( uidtotid[uid], sunits[i] );
			}
			//newUnit();
		}
	
	}
		

	
}

setSizeLimit(sizetoset, false);
setArmyName(nametoset);
//tu sie przestawia jak sie dodaja jednostki
$(saveimage).addClass('savedisabled');	

}


function goodbye(e) {

if( acarmyid && ( ! ($(saveimage).hasClass('savedisabled')))){
				
	if(!e) e = window.event;
	
	e.cancelBubble = true;
	e.returnValue = 'Army have unsaved changes that will be lost.\nTo save army press cancel and use save button.';
	
	if (e.stopPropagation) {
		e.stopPropagation();
		e.preventDefault();
	}
}
}

// in IE this will also work on javascript: anchors
if (navigator.appName != 'Microsoft Internet Explorer') 
	window.onbeforeunload=goodbye;


