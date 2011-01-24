Mod (
	{ 
		name : "Mods.Class",
		pattern : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(parameter){
		
		var _test = function(){
			console.log("private funktion");
		}
		
		console.log("supercass konstruktor");
		this.funktion = function(){
			console.log("funktion")
		}
		var _testVar = "anfang";
		return {
			test : function(){
				
				console.log("SuperClass:" +parameter);
				
			},
			set war(par){
				console.log("setter");
				_testVar += par + "  anderes";
				return true;
			},
			get war (){
				console.log("getter");
				return _testVar;
			}
		}
		
	
	}
);