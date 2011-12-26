
console.log('starting test suite...');

var twrReader = new jsArmyCalc.TwrReader(
		{

			getFile : function(path, callback)
			{
			$.get('../twr3example/' + path, callback, 'text');
			},

			putFile : function(path, body)
			{
				console.log(path);
				console.log(body);
			}

		});

twrReader.identity.name = 'Save Test';
twrReader.save();

twrReader.load();
console.log('test suite finished');
