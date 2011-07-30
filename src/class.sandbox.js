
function acSandbox( code, params ){
	
	//TODO safe quote!
	new Function("window", "with(window){" + code + "}")( params ); 
	
}

