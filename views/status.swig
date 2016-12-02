{% extends 'layout.swig' %}

{% block style %}
{% endblock %}

{% block body %}
	<h2>Status Page</h2>
	<br>
	<dl>
		<dt>Temperature:</dt>
		<dd>{{ Temperature|default('--') }}</dd>
		<dt>Humidity:</dt>
		<dd>{{ Humidity|default('--') }}</dd>
		<dt>Sunrise:</dt>
		<dd>{{ Sunrise|default('--') }}</dd>
		<dt>Sunset:</dt>
		<dd>{{ Sunset|default('--') }}</dd>
		{#<dt>Next Weather Update:</dt>#}
		{#<dd>{{ NextWeatherUpdate|default('--') }}</dd>#}
	</dl>
{% endblock %}

{% block scripts %}
{% endblock %}
