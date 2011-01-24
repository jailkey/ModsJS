Mod (
	{ 
		name : "Mods.Main",
		pattern : "app",
		author : "Jan Kaufmann",
		include : ["Mods.Pattern.App", "Mods.Class.SubClass"],
		description : "",
		version : 0.1,
		events : {
			"beforcreate" : function(mod){
				console.log("beforload:"  + mod.name);
			},
			"aftercreate" : function(mod){
				console.log("afterload:" + mod.name);
			},
			"afterinit" : function(mod){
				console.log("Mod "+mod.name+" wurde initialisiert");
			},
			"onerror" : function(fehler){
				console.log("Es ist ein Fehler aufgetreten! Fehler: "+fehler);
			}
		},
		images : [
			"images/1.jpg",
			"images/2.jpg",
			"images/3.jpg",
			"images/4.jpg",
			"images/5.jpg"
		]
	},
	function(){
		
		Mods.ready(function(){
			//Mod fertig geladen
			console.log("mods ready");
			
			var test = new Mods.Class("noch ein parameter");
			
			var test2 = new Mods.Class("ein Parameter");
		
			
			test.war = "irgendwas";
		
		});
	}
);