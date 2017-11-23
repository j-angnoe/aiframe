function aiframe(elem) {

	var self = this;

	function init() {
		if (typeof elem === 'string') {
			elem = document.querySelector(elem);
		}
		self.elem = elem;
		
		elem.aiframeInstance = self;

		self.handleEvents();

		self.defaultSelector = null;
	}

	self.setSelector = function (selector) {
		this.defaultSelector = selector;
	};

	this.load = function (url, data, selector) {
		// console.log('load url ' + url);
		
		selector = selector || this.defaultSelector;

		this.createXhr(url, data, function (error, xhr) {
			if (error) {
				return console.error(xhr);
			}

			if (!selector) {
				self.elem.innerHTML = xhr.responseText;
			} else {
				var tmp = document.createElement('div');
				tmp.innerHTML = xhr.responseText;

				while(self.elem.firstChild) {
					self.elem.removeChild(self.elem.firstChild);
				}

				var match = tmp.querySelector(selector);

				if (match) {
					self.elem.appendChild(match);
				} else {
					self.elem.appendChild(tmp);

					// console.log('aiframe: loaded ajax does not contain ' + selector);
				}
			}

			self.handleEvents();
		})
	}

	this.handleEvents = function () {
		this.elem.removeEventListener('click', this.clickHandler);
		this.elem.addEventListener('click', this.clickHandler);

		var forms = this.elem.querySelectorAll('form');
		Array.prototype.forEach.call(forms, function (form) {
			form.addEventListener('submit', self.submitHandler);
			// console.log(form, 'forms');
		})
	}

	this.clickHandler = function (event) {
		var closestAnchor = findClosestElement(event.target, 'a');
		if (!closestAnchor) {
			// could not find an anchor tag.
			if (elementMatches(event.target, 'input[type=submit]')) {
				event.target.setAttribute('checked', true);
			}
			return;
		}

		if (!closestAnchor.href) {
			// link has no href, do nothing.
			return;
		}

		var target = closestAnchor.getAttribute('target');

		if (target && target !== '_self') {
			// link has a target, skip.
			return;
		}

		var href = closestAnchor.getAttribute('href',2);
		if (self.isExternalLink(href)) {
			// link to external, dont handle it.
			return;
		}

		event.preventDefault();

		getaiframe(closestAnchor).load(href);
	}

	this.submitHandler = function (event) {
		var form = event.target;

		var action = form.getAttribute('action');

		if (self.isExternalLink(action)) {
			return;
		}

		event.preventDefault();

		var formData =  new FormData(form);

		var clickedSubmitButton = form.querySelector('input[type=submit][checked]');

		if (clickedSubmitButton) {
			formData.append(clickedSubmitButton.name, clickedSubmitButton.value);
		}



		getaiframe(form).load(action, formData);
	}

	this.isExternalLink = function (url) {
		// @todo - implementation
		return false;
	}

	function getaiframe(elem) {
		while(elem) {
			if (elem.aiframeInstance) {
				return elem.aiframeInstance;
			}
			elem = elem.parentNode;
		}
		return false;
	}

	function elementMatches(elem, selector) {
	    var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
	        i = matches.length;
	    while (--i >= 0 && matches.item(i) !== elem) {}
	    return i > -1;            
	}

	function findClosestElement(elem, match) {
		while(!elementMatches(elem, match)) {
			if (!elem.parentNode){
				return false;
			}
			elem = elem.parentNode;
		}
		return elem;
	}

	init();
}

aiframe.reactive = function () {
	function scan(target) {
		if (target && !target.querySelectorAll) {
			// in case of #text nodes.
			return;
		}
		(target||document).querySelectorAll('[aiframe], [aiframe-load]').forEach(function (elem) {
			console.log('aiframe');

			var aiframeInstance = new aiframe(elem);

			if (elem.hasAttribute('aiframe-select')) {
				aiframeInstance.setSelector(elem.getAttribute('aiframe-select'));
			}
			if (elem.hasAttribute('aiframe-load')) {
				aiframeInstance.load(elem.getAttribute('aiframe-load'));
			}
		})	
	}

	scan(document);

	document.addEventListener('DOMNodeInserted', function (event) {
		scan(event.target);
	})
};

aiframe.setReactive = function () {
	document.addEventListener('DOMContentLoaded', aiframe.reactive);
}

aiframe.prototype.createXhr = function (url, data, callback) {
	if (typeof data === 'function') {
		callback = data;
		data = null;
	}

	var xhrObject = new XMLHttpRequest();
	var method = data ? 'POST' : 'GET';

	xhrObject.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status === 200) {
				callback(null, this);
			} else {
				callback(true, this);
			}
		}
	}

	xhrObject.open(method, url, true);

	// if (data) {
		// xhrObject.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// }

	xhrObject.send(data);

	return xhrObject;
}


if (typeof module === 'undefined') {
	aiframe.setReactive();
} else {
	// commonjs compatible.
	module.exports = aiframe;
	// import compatible.
	module.exports.default = aiframe;
}
