
var Mods = (function(config){
	var _config = (config) ? config :  "CONFIG FAILED";
	var _errors = [];
	var _log = [];
	var _pattern = {};
	var _events = {};
	var _failed = [];
	var _plugin = {};
	var _mods = {};
	var _targetWrapper = {};
	var _notCreated = {};
	var _createdMods = {};
	var isDom = false;
	var _documentHead = document.getElementsByTagName("head")[0];
	var _testError = function(error){
		if(typeof error === "object"){
			error.level = (typeof error.level === "number") ? error : 0;
			var isPluginError = (typeof _plugin.error === "function") ? _plugin.onerror(error) : true;
			if(isPluginError){
				
			}
			_errors[_errors.length] = error;
		}else{
			_failed[_failed.length] = error;
		}
	};
	
	var _createTarget = function(targets){
		var path = targets;
		var chain = window;
		for( var i = 0; i < path.length; i++ ){
			if( typeof chain[path[i]] === "undefined" ){
				chain[path[i]] = {}
			}
			chain = chain[path[i]];
		}
		return chain;
	};
	
	var _getModChain = function( target ){
		var path = target.split(".");
		var chain = window;
		for( var i = 0; i < path.length; i++ ){
			if( typeof chain[path[i]] === "undefined" ){
				return false;
			}else{
				chain = chain[path[i]];
			}
		}
		return chain;
	}
	
	var _isModAdded = function(target){
		return ( _createdMods[ target ] ) ? true : false;
	};
	
	
	var _areModsAdded = function(included){
		var output = true;
		for(var i = 0; i < included.length; i++){
			if(! _isModAdded(included[i])){
				output =  false;
			}
		}
		return output;
	};
	
	var _loader = function(name){
		var _name = name;
		var _actions = [];
		this.bind = function ( callback ){
			_actions[_actions.length] = callback;
			return this;
		};
		
		this.loaded = function(){
			var newactions = [];
			for(var i = 0; i < _actions.length; i++){
				if( typeof _actions[i] === "function" ){
					_actions[i]();
				}else{
					newactions.push(actions[i]);
				}
			}
			_actions = newactions;
		}
		
		this.name = function(){
			return _name;
		}
	};
	
	var _ready = function(callback){
		if(!isDom){
			if(window.attachEvent){
				window.attachEvent("onload", callback);
			}else if(window.addEventListener) {
				window.addEventListener("load", callback, false);
			}
		}else{
			callback();
		}
	};
	
	_ready(function(){
		isDom = true;
	});
	
	return {
		
		isMod : false,
		isOnLoad : false,
		ready : function(callback){
			_ready(callback);
		},
		addPattern : function(pattern){
			_pattern[pattern.name] = pattern;
		},
		getPattern : function(patternName){
			if(_pattern[patternName]){
				return _pattern[patternName];
			}else{
				throw "Der Patternhandler f&uuml;r "+patternName+" fehlt!";
				return false;
			}
		},
		getModChain : function(target){
			return _getModChain(target);
		},
		createChain : function(targets){
			return _createTarget(targets.split("."));
		},
		log : function(message){
			_log[_log.length] = message;
		},
		checkNotCreated : function(){
			
			for(var modName in _notCreated){
				Mods.addMod(_notCreated[modName]);
			}
		},
		addMod : function(mod){
			if(!mod.loaded){
				mod.loaded = true;
				if(mod.events){
					if(mod.events.beforcreate){
						mod.events.beforcreate(mod);
					}
				}
			}
			if(mod){
				
		
				var startCreating = true;
				if(typeof mod.include === "object"){
					if(mod.include instanceof  Array){
						startCreating = _areModsAdded(mod.include);
						if(!startCreating){
							for(var i = 0; i < mod.include.length; i++){
								if( !_mods[mod.include[i]] ){
									Mods.load({ name : mod.include[i] });
								}
							}
						}
					}
				}
				var target = (_targetWrapper[mod.name]) ? _targetWrapper[mod.name] : mod.name;
				var targets = target.split(".");
				_createTarget(targets);
				if(startCreating){
					if(Mods.getPattern(mod.pattern).create){
						if(!_createdMods[mod.name]){
							_createdMods[mod.name] = true;
							Mods.getPattern(mod.pattern).create(mod);
							console.log("loaded: "+mod.name);
							if(mod.events){
								if(mod.events.aftercreate){
									mod.events.aftercreate(mod);
								}
							}
							if( typeof _mods[mod.name].loader  === "object" ){
								_mods[mod.name].loader.loaded();
							}
						}
					}
					if(_notCreated[mod.name]){
						_notCreated[mod.name] = null;
						delete _notCreated[mod.name];
						Mods.checkNotCreated();
					}
					_mods[mod.name].isLoaded = true;
				}else{
					_notCreated[mod.name] = mod;
				}
			}
		},
		load : function(mod){
			var modName = mod.name;
			if(!_mods[modName]){
				if(!modName){
					throw "Mod Name kann nicht gefunden werden!";
				}
				if( modName!="" ) {
					Mods.isMod = false;
					var scriptTag = document.createElement("script");
					var path = modName.split(".");
					scriptTag.src = _config.modPath + path.join("/") + ".js";
					scriptTag.type = "text/javascript";
					_documentHead.appendChild(scriptTag);
					mod.isLoaded = false;
					mod.isCreated = true;
					_mods[modName] = mod;
					if( typeof _mods[modName].loader !== "object" ){
						_mods[modName].loader = new _loader(modName);
					}
					scriptTag.onloadDone = false;
					scriptTag.onload = function(){
						scriptTag.onloadDone = true;
						Mods.checkNotCreated(); 
					};
					scriptTag.onreadystatechange = function(){
						scriptTag.onloadDone = true;
						Mods.checkNotCreated(); 
					};
					scriptTag.onerror = function(){
						throw "Datei konnte nicht geladen werden: "+this.src;
					};
					Mods.checkNotCreated();
				}
			}
			
			return _mods[modName].loader;
			
		},
		addMethod : function(name, method){
			if( typeof Mods[name] === "undefined" ){
				Mods[name] = method;
			}
		},
		extend : function(superClass, subClass){
			var helperFunction = function(){};
			helperFunction.prototype = superClass.prototype;
			subClass.prototype = new helperFunction();
			subClass.prototype.constructor = subClass;
			subClass.superclass = superClass.prototype;
			if(superClass.prototype.constructor === Object.prototype.constructor){
				superClass.prototype.constructor = superClass;
			}
			return subClass;
		}
	};
})({
	modPath : "",
	timeout : 1000
});


Mods.addPattern({ 
	name :  "pattern", 
	create : function(mod) {
		Mods.addPattern(mod.func);
	}
});


Mods.addPattern({ 
	name :  "singelton", 
	create : function(mod) {
		try {
		
			var target = Mods.createChain(mod.name.substring(0, mod.name.lastIndexOf(".")));
			
			target[mod.name.substring(mod.name.lastIndexOf(".")+1, mod.name.length)] = mod.func();
			
			if( Mods.getModChain(mod.name).install ){
				Mods.getModChain(mod.name).install();
			}
			
		}catch(e){
			throw "Pattern create() f&uuml;r 'singelton' fehlgeschlagen. " + e;
		}
	}
});

Mods.addPattern({ 
	name :  "class", 
	create : function(mod) {
		try {
			if(mod.extend){
				var codeBase = mod.func;
				var constructorExtension = " \n var superClassMethodes = "+mod.name+".superclass.constructor.apply(this, arguments); \n var that=this; \n";
				constructorExtension += "var addMethodes = function(objekt){ \n for(var prop in objekt){ \n that[prop] = objekt[prop];\n }; \n };\n console.log('test'); \n addMethodes(superClassMethodes);";
				var methodes = mod.func();
				var methode = false, search = "";
				for(methode in methodes){
					search += "[\\s\\S]*?" +methode;
				}
				var reg = new RegExp("(function\\s*\(([\\s\\S]*?)\)\\s*\{)([\\s\\S]*)return[\\s\\n]*?\{("+search+"[\\s\\S]*?)\}[\\s;\\n]*\}\\s*$", "g");
				if(reg.test(codeBase)){
					var parameter = RegExp.$3.replace(")","").replace("(", "").replace(" ", "").split(",")
					var newCode = "{" + constructorExtension + RegExp.$4 + " addMethodes({"+RegExp.$5+"}) }";
				}else{
					throw "Pattern create() f&uuml;r 'class' fehlgeschlagen. Die Methoden k&ouml;nnen nicht hinzugef&uuml;gt werden.";
				}
				var newObjekt = new Function(parameter, newCode);				
				var superClass = Mods.getModChain(mod.extend);
				var subClass = Mods.extend(superClass, newObjekt);
				var target = Mods.createChain(mod.name.substring(0, mod.name.lastIndexOf(".")));
				target[mod.name.substring(mod.name.lastIndexOf(".")+1, mod.name.length)] = subClass;
			}else{
				var target = Mods.createChain(mod.name.substring(0, mod.name.lastIndexOf(".")));
				target[mod.name.substring(mod.name.lastIndexOf(".")+1, mod.name.length)] = mod.func;
			}
		}catch(e){
			throw "Pattern create() f&uuml;r 'class' fehlgeschlagen. "+e;
		}
	}
});

Mods.addPattern({
	name : "action",
	create : function(mod){
		try{
			if(typeof mod.func === "function"){
				mod.func()
			}
		}catch(e){
			throw "Pattern create() f&uuml;r 'action' fehlgeschlagen. "+e;
		}
	}
});



var Mod = function(mod, func){
	mod.func = func;
	Mods.addMod(mod);
};


var loader = Mods.load({ name : "Mods.Main"});
loader.bind(function(){});
	

