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
	</dl>
{% endblock %}

{% block scripts %}
{% endblock %}
