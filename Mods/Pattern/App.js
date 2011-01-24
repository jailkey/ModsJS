Mod(
	{
		name : "Mods.Pattern.App",
		pattern : "pattern",
		include : ["Mods.Lib.Loader", "Mods.Lib.EventFactory"]
	},
	{
		name : "app",
		create : function(mod){
			//Event Listener delegieren
			var events = new Mods.Lib.EventFactory([
				"afterinit",
				"onerror",
				"onloading"
			]).addListeners(mod.events);
						
						

			if(mod.images){
				var imageLoader = new Mods.Lib.Loader(mod.images)
				imageLoader.onload(function(){
					mod.func();
					events.afterinit.notify(mod);
				}).onerror(function(message){
					events.onerror.notify(message);
				}).onloading(function(percent){
					events.onloading.notify("Es wurden "+percent+"% der Bilder geladen!");
				}).loadImages();
			}else{
				mod.func();
			}
		}
	}
);