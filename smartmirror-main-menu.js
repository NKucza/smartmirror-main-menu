Module.register("smartmirror-main-menu", {
   
	menuObjPointer:  0,
	selectedNum: -1,
	currentMenuAmount : 1,

	 defaults: {

		menuObj:{
			none: {
				menu: {title: "Menu" , icon: "bars" },
			},			
			main: {
				camera: {title: "Camera Demonstration", icon: "television"},
				applications: {title: "Available Applications" , icon: "clone"},
				preferences: {title: "Preferences" , icon: "cogs"},
				close: {title: "Close" , icon: "times-circle" },
            	//monitorOff: { title: "Turn Off Monitor", icon: "television", source: "SERVER" },
           		//restart: { title: "Restart MagicMirror", icon: "recycle", source: "ALL" },
            	//refresh: { title: "Refresh MagicMirror", icon: "refresh", source: "LOCAL" },
            	//reboot: { title: "Reboot", icon: "spinner", source: "ALL" },
            	//shutdown: { title: "Shutdown", icon: "power-off", source: "ALL" },
        	},
			camera: {
				image: {title: "Toggle Camera Image", icon: "eye"},
				distance: {title: "Toggle short distance", icon: "compress"},
				face: {title: "Show / Hide Face Detec.", icon: "user-circle"},
				objects: {title: "Show / Hide Object Detec.", icon: "coffee"},
				gesture: {title: "Show / Hide Gesture Rec.", icon: "thumbs-up"},
				hideALL: {title: "Hide All / Remove All", icon: "eye-slash"},
				back: {title: "Back" , icon: "undo" },
				close: {title: "Close" , icon: "times-circle" }
			},
			application: {
				clock: {title: "Clock", icon: "clock-o" },
				weather: {title: "Weather", icon: "cloud"},
				crypto: {title: "Crypto Stock Values", icon: "bitcoin" },
				calendar: {title: "Calendar", icon: "calendar"},
				mensa: {title: "Mensa Offer", icon: "apple" },
				transportation: {title: "Public Transportation", icon: "bus" },
				speech: {title: "Speech Recogn. Output", icon: "comment"},
				newsfeed: {title: "Heise Newsfeed", icon: "rss-square" },
				bivital: {title: "Vital Data" , icon: "heart"},
				back: {title: "Back" , icon: "undo" },
				close: {title: "Close" , icon: "times-circle" }
			},
			preferences: {
				back: {title: "Back" , icon: "undo" },
				close: {title: "Close" , icon: "times-circle" }
			}
		}

	},

		doMenuAction: function(action) {
		var actionDetail = {};
		if (typeof action === "object") {
			actionDetail = action;
			actionName = actionDetail.actionName;
		} else {
			actionName = action;
			actionDetail = this.menuObjPointer[action]['title'];
		}

		this.sendNotification("MENU_CLICKED", actionName);
		//console.log(`OSM Menu Item Clicked: ${actionName}\n${actionDetail}`);

/*		var nodeActions = ["monitorOn", "monitorOff", "monitorToggle", "restart", "reboot", "shutdown", "stop", "minimize", "toggleFullscreen", "openDevTools"];

		// Module Actions
		if (actionName.startsWith("module")) {
			this.handleModuleAction(actionName);
		} else if (actionName.startsWith("notify")) {
			this.sendNotification(actionDetail.notification,actionDetail.payload);
		} else if (nodeActions.indexOf(actionName) !== -1) {
			this.sendSocketNotification("PROCESS_ACTION", actionName);
		} else if (actionName === "refresh") {
			window.location.reload(true);
		} else if (actionName === "toggleTouchMode") {
			this.toggleTouchMode();
		} else if (actionName.startsWith("changeMenuPosition_")) {
			this.changeMenuPosition(actionName.replace("changeMenuPosition_", ""));
		} else if (actionName.startsWith("delayed")) {
			if (!("actionName" in actionDetail)) {
				actionDetail.actionName = actionName;  
			}
			this.delayedAction(actionDetail);
		} else {
			alert(`Unknown OSM Menu Item Clicked: ${actionName}`);
		}

		this.toggleMenu(true); */
	},

	start: function() {
		console.log(this.name + " has started...");
		this.menuObjPointer = this.config.menuObj.none;

	},

	/**
     * @function getDom
     * @description Creates the UI as DOM for displaying in MagicMirror application.
     * @override
     *
     * @returns {Element}
     */
    getDom() {
		var self = this;
		var wrapper = document.createElement("div");
		wrapper.className = "mediumMenu";

		var table = document.createElement("table");
		var tbody = document.createElement("tbody");

		table.className = "table";
		table.className = "tbody";


		this.data.header = 'Main Menue'

		function makeOnClickHandler(a) {
			return function() {
				self.doMenuAction(a);
			};
		}

		if(this.selectedNum > -1){
			var selectedObject =  Object.keys(this.menuObjPointer)[this.selectedNum];
		}

		Object.keys(this.menuObjPointer).forEach(k => {
		//	var row = this.getMenuItem(this.menuObjPointer[k]);
			var row = document.createElement("tr");
			var namecell = document.createElement("namecell");
			var cellText = document.createTextNode(this.menuObjPointer[k].title);
			namecell.appendChild(cellText);
			//namecell.className =  "namecell";
			namecell.className =  "valuecell";
			namecell.onclick = makeOnClickHandler(k);
			row.appendChild(namecell);

			var span = document.createElement("span");
	        span.innerHTML = `<i class="fa fa-${this.menuObjPointer[k].icon}" aria-hidden="true"></i>`;
			if (k == selectedObject){
				span.classList.add('pulse'); 
				namecell.classList.add('pulse'); 
			}

			
			span.onclick = makeOnClickHandler(k);
		
			row.appendChild(span);
			row.className = "tablerow";
			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		wrapper.appendChild(table);

		return wrapper;
    },
		
	getStyles() {
        return ['font-awesome.css', 'smartmirror-main-menu.css'];
    },

	notificationReceived: function(notification, payload, sender) {
		if(notification === 'MAIN_MENU') {
			console.log("[" + this.name + "] " + "received: " + payload);
			if(payload === 'menu'){
				this.menuObjPointer = this.config.menuObj.main;
				this.currentMenuAmount = Object.keys(this.menuObjPointer).length;
				this.selectedNum = -1;
				this.updateDom();
			}else if(payload === 'camera'){
				this.menuObjPointer = this.config.menuObj.camera;
				this.currentMenuAmount = Object.keys(this.menuObjPointer).length;
				this.selectedNum = -1;
				this.updateDom();
			}else if(payload === 'application'){
				this.menuObjPointer = this.config.menuObj.application;
				this.currentMenuAmount = Object.keys(this.menuObjPointer).length;
				this.selectedNum = -1;
				this.updateDom();
			}else if(payload === 'preferences'){
				this.menuObjPointer = this.config.menuObj.preferences;
				this.currentMenuAmount = Object.keys(this.menuObjPointer).length;
				this.selectedNum = -1;
				this.updateDom();
			}else if(payload === 'none'){
				this.menuObjPointer = this.config.menuObj.none;
				this.currentMenuAmount = Object.keys(this.menuObjPointer).length;
				this.selectedNum = -1;
				this.updateDom();
			}
		}else if (notification === 'MAIN_MENU_SELECT'){
			if(payload < 0.25)
				payload = 0;
			else
				payload = (payload - 0.25) * 2;

			if(payload > 1)
				payload = 0.9;
			

			var selectedItem = parseInt(payload * this.currentMenuAmount);

			if(this.selectedNum != selectedItem){
				this.selectedNum = selectedItem;
				console.log("[" + this.name + "] " + "flashing item should be: " + this.selectedNum );
				this.updateDom();
			}
		}else if (notification === 'MAIN_MENU_CLICK_SELECTED'){
			if(this.selectedNum > -1){
				var actionName = Object.keys(this.menuObjPointer)[this.selectedNum];
				this.sendNotification("MENU_CLICKED", actionName);
				this.selectedNum = -1;
				this.updateDom();
			}
		}else if (notification === 'MAIN_MENU_UP'){
			this.selectedNum = this.selectedNum -1;
			if(this.selectedNum < 0)
				this.selectedNum = this.currentMenuAmount -1 ;
			this.updateDom();
		}else if (notification === 'MAIN_MENU_DOWN'){
			this.selectedNum = this.selectedNum +1;
			if(this.selectedNum == this.currentMenuAmount)
				this.selectedNum = 0;
			this.updateDom();
		}
	},


});
