{% extends 'layout.swig' %}

{% block style %}
{% endblock %}

{% block body %}
	<h2>Outlets</h2>
	<br>
	<ul>
	{% for outlet in outlets %}
		<li class="outlet">
			<div class="outlet-id outlet-{{ outlet.OutletID }}">{{ outlet.OutletID|default('--') }}</div>
			<div class="outlet-status">On: {{ outlet.TurnedON|default('error') }}</div>
			<div class="outlet-controls">
				<button class="outlet-toggle" data-outletid="{{ outlet.OutletID }}">Toggle</button>
			</div>
		</li>
	{% endfor %}
	</ul>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/outlets.js"></script>
{% endblock %}
