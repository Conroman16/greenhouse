<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>{{PageTitle|default('index')|title}}</title>
	<link rel="stylesheet" href="/static/css/main.css" />
	<script>var config = {}</script>
	{% block style %}{% endblock %}
	{#{% if IsProd %}#}
	{#<script>#}
		{#(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){#}
			{#(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),#}
			{#m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)#}
		{#})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');#}
		{#ga('create', {{GoogleAnalyticsID}}, 'auto');#}
		{#ga('send', 'pageview', location.pathname);#}
		{#Object.assign(window.config, {#}
		    {#gaLoaded: true#}
		{#});#}
	{#</script>#}
	{#{% endif %}#}
</head>
<body>
	{% block body %}{% endblock %}
	<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-browser/0.1.0/jquery.browser.min.js"></script>
	<script id="init">
		$(function(){
			if ($.browser.mobile)
				$('body').addClass('mobile');
		});
	</script>
	{% block scripts %}{% endblock %}
</body>
</html>
