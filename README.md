# Aiframe - An ajax frame instead of iframes.

With aiframe you can denote sections in your site which should be ajax-enabled and stay isolated. Within an aiframe all link clicks and form submissions will stay inside the aiframe. Written with zero dependencies.


## Live example:

- http://fluxfx.nl/aiframe/example/
- https://jsfiddle.net/reLqxhLw/  (JsFiddle is not the best solution to demo ajax clicks / posts)



```
<html>
<head>
	<script src="https://unpkg.com/aiframe@latest/aiframe.js"></script>
</head>
<body>
	<div>
		<p>Hello welcome</p>

		<div class="container" aiframe>
			<!-- 
				whatever happens here (link clicks / form submits) will stay within this container 	
			-->

			<a href="somepage.html">Somepage</a>

			<div aiframe>
				<form method="POST" action="/action">

					<!-- It is possible to nest aiframes. The results of posting will stay within the div above. -->

					<input type="text" name="my_text_input">

					<input type="submit" value="submit">

					<!--
						my_text_input AND submit=Submit will be posted to the server.
					-->
				</form>
			</div>
		</div>
	</div>
</body>
</html>
```

## Usage:

* Include aiframe.js

```
<script src="aiframe.js"></script>
```

* Declare an aiframe:

```
<div class="my-container" aiframe>
	...	
</div>
```

* Or: Define a section which must be loaded from the server via ajax `on-load`:

```
<div aiframe-load="mypartial.html"></div>
```

* When you want to select a section from the loaded document, you can use the option aiframe-select, like so:
```
<div aiframe-load="someurl.html" aiframe-select=".main-container"></div>
```

## Selectors (aiframe-select or aiframe.setSelector)
If you want to cut out a part of the ajax documents you receive, you either use the aiframe-select attribute, (or aiframe.setSelector programmatically). The selector you define will be active on 
all subsequent ajax calls that are run from within this aiframe.

If the selector you defined is not found inside the ajax document, it will default to loading the entire ajax document.


## Programmatic usage:
```
var aiframe = require('aiframe');

var myframe = new aiframe(document.querySelector('someElement'));
// or:
var myframe = new aiframe('#some-id');

myframe.load(url, postData, selector);
myframe.load('someurl.html');

var frm = new FormData();
frm.append('test',1);

myframe.load('/action', frm);

```


## Browser features used:
- FormData (IE11)
- XMLHttpRequest
- document.querySelector/querySelectorAll

## Example:
Open example/ in your browser.
