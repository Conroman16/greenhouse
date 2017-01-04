{% extends 'layout.swig' %}

{% block style %}
{% endblock %}

{% block body %}
	<div class="page">
		{# <h2 class="page-header">Outlets</h2>
		<br> #}
		<ul class="outlet-list">
		{% for outlet in outlets %}
			<li class="outlet" data-outletid="{{ outlet.OutletID }}">
				<div class="outlet-id outlet-{{ outlet.OutletID }}">{{ outlet.OutletID|default('--') }}</div>
				<div class="outlet-status outlet-toggle led {{ outlet.LedClass }}" ></div>
				{# <div class="outlet-controls">
					<button class="outlet-toggle">Toggle</button>
				</div> #}
			</li>
		{% endfor %}
		</ul>
	</div>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/outlets.js"></script>
{% endblock %}
