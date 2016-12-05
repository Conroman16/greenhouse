{% extends 'layout.swig' %}

{% block body %}
	<h3>Hi</h3>
	<br>
	<a href="{{ LogoutPath }}">Logout</a>
	<a href="/status">Status</a>
	<a href="/outlets">Outlets</a>
{% endblock %}

{% block scripts %}
{% endblock %}
