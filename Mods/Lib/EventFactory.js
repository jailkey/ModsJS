Mod (
	{ 
		name : "Mods.Lib.EventFactory",
		pattern : "class",
		author : "Jan Kaufmann",
		description : "",
		include : ["Mods.Lib.Event"],
		version : 0.1
	},
	function(eventList){
		var _that = this;
		var _addItem = function(name){
			_that[name] = new Mods.Lib.Event();
		}
		var _addItems = function(items){
			var i, len = items.length;
			for( i = 0; i < len; i++ ){
				_addItem( items[i] );
			}
		}
		_addItems(eventList);
		
		this.getItem = function(name){
			return _that[name];
		}
		this.addItem = function(name){
			_addItem(name);
			return this;
		}
		this.addItems = function(items){
			_addItems(_addItems);
			return this;
		}
		this.addListeners = function(listeners){
			var prop;
			for(prop in listeners){
				if(this.getItem(prop)){
					this.getItem(prop).addListener(listeners[prop]);
				}
			}
			return this;
		}
		
	}
)