Mod (
	{ 
		name : "Mods.Lib.Event",
		pattern : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(){
		var _listener = [];
		var _removeListener = function(listener){
			var newList = [], len = _listener.length,  i;
			for( i = 0; i < len; i++){
				if(_listener[i] !== listener){
					newList.push(_listener[i]);
				}
			}
			_listener = newList;
		}
		return {
			addListener : function(callback){
				_listener.push(callback);
			},
			removeListener : function(callback){
				_removeListener(callback);
			},
			notify : function(data){
				var i, len = _listener.length;
				for( i = 0; i < len; i++){
					_listener[i](data);
				}
			}
		}
	}
);