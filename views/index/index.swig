{% extends '../layout.swig' %}

{% block body %}
	<h3>Hi</h3>
	<br>
	<a href="{{ LogoutPath }}">Logout</a>
	{# <a href="/status">Status</a> #}
	<a href="/outlets">Outlets</a>
	<a href="/device/list">Devices</a>
	<br>
	<a href="/shutdown">Shutdown</a>
	<a href="/restart">Restart</a>
{% endblock %}

{% block scripts %}
{% endblock %}
