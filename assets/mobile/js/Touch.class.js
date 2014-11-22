function Touch(){};

Touch.prototype = {
	init: function(controller) {
		if (window.navigator.msPointerEnabled) {
			window.addEventListener('MSPointerDown', this.handleTouchStart.bind(this), false);
			window.addEventListener('MSPointerMove', this.handleTouchMove.bind(this), false);
			window.addEventListener('MSPointerUp', this.handleTouchEnd.bind(this), false);
		}
		window.addEventListener('touchstart', this.handleTouchStart.bind(this), false);        
		window.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
		window.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
		this.controller = controller;
		this.xDown = null;                                                        
		this.yDown = null;   
		this.touchTime = null;
		this.singleTap = 200;
	},
	handleTouchStart: function(evt) {                                         
		if (window.navigator.msPointerEnabled) {
			this.xDown = evt.clientX;                                      
			this.yDown = evt.clientY; 
		} else {
			this.xDown = evt.touches[0].clientX;                                      
			this.yDown = evt.touches[0].clientY; 
		}
		this.touchTime = new Date().getTime();
	},
	handleTouchMove: function(evt) {
		if (window.navigator.msPointerEnabled) {
			var xUp = evt.clientX;                                    
			var yUp = evt.clientY;
		} else {
			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;
		}
		var yDiff = this.yDown - yUp;
		var xDiff = this.xDown - xUp;

		/* Avoid problems with non-linear swipe */
		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
			if ( xDiff > 0 ) {
				this.controller.emitAction('swipe-left');
				this.controller.emitSocket('mobilePassIntro',{action: 'swipe-left'});
			} else {
				this.controller.emitAction('swipe-right');
				this.controller.emitSocket('mobilePassIntro',{action: 'swipe-right'});
			}                       
		} else {
			if ( yDiff > 0 ) {
				this.controller.emitAction('swipe-up');
				this.controller.emitSocket('mobilePassIntro',{action: 'swipe-up'});
			} else { 
				this.controller.emitAction('swipe-down');
				this.controller.emitSocket('mobilePassIntro',{action: 'swipe-down'});
			}                                                                 
		}
	},
	handleTouchEnd: function(evt) {
		var actualTime = new Date().getTime();
		var timeDiff = actualTime-this.touchTime;
		if(timeDiff < this.singleTap) {
			this.controller.emitAction('tap');
			this.controller.emitSocket('mobilePassIntro',{action: 'tap'});
		} else {
			this.controller.emitAction('hold');
			this.controller.emitSocket('mobilePassIntro',{action: 'hold'});
		}
	}
};