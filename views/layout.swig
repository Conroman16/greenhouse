<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>{{PageTitle|default('Greenhouse')|title}}</title>
	<link rel="shortcut icon" href="/static/img/favicon.ico" type="image/x-icon" />
	<link rel="icon" href="/static/img/favicon.ico" type="image/ico" />
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css" />
	<link rel="stylesheet" href="/static/css/main.css" />
	<script>
		var config = {
			sunrise: new Date('{{ Sunrise }}'),
			sunset: new Date('{{ Sunset }}')
		}
	</script>
	{% block style %}{% endblock %}
	{% if IsDev %}
	<link rel="stylesheet" href="/static/css/devdata.css"></link>
	<div id="dev-data-banner-wrap" class="clearfix">
		<div class="dev-data-banner">
			<p class="dev-data-banner-text">Dev Data</p>
		</div>
	</div>
	{% endif %}
	<script id="loader-template" data-name="loader" type="text/x-swig-template">
		{% include 'partials/loader.swig' %}
	</script>
	{% block templates %}{% endblock %}
</head>
<body>
	{% include 'partials/navbar.swig' %}
	<br>
	<div class="body-wrap">
		{% block body %}{% endblock %}
	</div>
	<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.1.0/jquery.browser.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/swig/1.4.1/swig.min.js"></script>
	<script>window.swig || document.write('<script src="/static/cdnbackup/swig.js"><\/script>')</script>
	<script src="/static/js/loader.js"></script>
	<script src="/static/js/astronomy.js"></script>
	<script id="init">
		$(function(){
			if ($.browser.mobile)
				$('body').addClass('mobile');

			window.templates = window.templates || {};
			window.swig.setDefaults({
				varControls: [ '<{', '}>' ],
			    tagControls: [ '<%', '%>' ]
			});

			var templs = $('script[type="text/x-swig-template"]');
			$.each(templs, function(indx){
				var templ = $(templs[indx]);
				var templName = templ.data('name') || templ.attr('id').replace(/-/g, '_');
				window.templates[templName] = swig.compile(templ.html());
			});
		});
	</script>
	{% block scripts %}{% endblock %}
</body>
</html>
