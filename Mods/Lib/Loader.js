Mod (
	{ 
		name : "Mods.Lib.Loader",
		pattern : "class",
		author : "Jan Kaufmann",
		description : "",
		include : ["Mods.Lib.EventFactory"],
		version : 0.1
	},
	function(files){
		var _files = files;
		var _images = [];
		var _events = new Mods.Lib.EventFactory([
			"onload",
			"onbeforload",
			"onloading",
			"onerror"
		]);
		

		var _checkLoaded = function(files, images){
			var output = false, i;
			if(files.length === images.length){
				output = true;
				for( i = 0; i < images.length; i++){
					if(!images[i].onloadDone){
						output = false;
					}
				}
			}
			return output;
		}
		var _onLoad = function(type, func){
			var _fileobjects = {
				"image" : _images
			}[type];
			if(_checkLoaded(_files, _fileobjects)){
				if(typeof func === "function"){
					func();
				}
			}
		}
		var _whileloading = function(){
			var i, len = _onloading.length;
			_events.onloading.notify(_percentLoaded());
		}
		var _percentLoaded = function(){
			var i, counter=0;
			for( i = 0; i < _images.length; i++){
				if(!_images[i].onloadDone){
					counter++;
				}
			}
			return (100/_images.length)*(_images.length - counter);
		}
		return {
			loadImages : function(){
				var i, y;
				_events.onloading.notify(_percentLoaded());
				_events.onbeforload.notify();
				for( i = 0; i < _files.length; i++){
					var image = _files[i];
					var imageElement = new Image();
					imageElement.src = image;
					imageElement.onloadDone = false;
					var checkLoaded = function(element){
						_events.onloading.notify(_percentLoaded());
						_onLoad("image", function(){
							_events.onload.notify(element);
						});
					}
					imageElement.onload = function(){
						this.onloadDone = true;
						checkLoaded(this)
					};
					imageElement.onreadystatechange = function(){
						this.onloadDone = true;
						checkLoaded(this);
					};
					imageElement.onerror = function(){
						_events.onerror.notify("Datei konnte nicht geladen werden: "+this.src);
					};
					_images.push(imageElement);
				}
				return this;
			},
			getImages : function(){
				
			},
			onbeforload : function(){
				_events.onbeforload.addListener(func);
				return this;
			},
			onload : function(func){
				_events.onload.addListener(func);
				return this;
			},
			onerror : function(func){
				_events.onerror.addListener(func);
				return this;
			},
			onloading : function(func){
				_events.onloading.addListener(func);
				return this;
			}
		}
	}
);