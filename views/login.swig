{% extends 'layout.swig' %}

{% block body %}
	<form id="login-form" method="post" action="{{ LoginPath }}">
		<label for="username">Username:</label>
		<input type="text" class="username" name="username" />

		<label for="password">Password:</label>
		<input type="password" class="password" name="password" />

		<input type="submit" value="Log In">
	</form>
	<br>
	<a href="{{ RegisterPath }}">Register</a>
{% endblock %}

{% block scripts %}
{% endblock %}
