Mod (
	{ 
		name : "Mods.Class.SubClass",
		pattern : "class",
		author : "Jan Kaufmann",
		description : "",
		include : ["Mods.Class"],
		extend: "Mods.Class",
		version : 0.1
		
	},
	function(parameter){
	
		this.test3 = function(){
			console.log("test 3");
			return { "test" : "irgendwas" }
		};
		
		var _testVar = 0;
		
		
		return {
			test2 : function(test){
				console.log("test2");
				
				console.log("set:" + _testVar);
			},
			getVar : function(){
				console.log("get:" + this.war);
				this.war = "test";
			}
		}
	}
);