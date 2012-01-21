
console.log('loading twrreader test suite...');

//console.log = function(txt) { document.write(txt + '<br/>'); };

console.log('STARTING TESTS SUITE');
var twr = new ArmyCalc.TwrReader({
		'onProgress' : function(percent){ console.log('progress: ' + percent + '%'); },
		'onLoaded' : function(){ console.log('DONE'); }
});

twr.load('../examples/example2.twr/');
//uncomment this to load test1 on init


console.log('twrreader test suite loaded.');
