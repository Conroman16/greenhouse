{% extends '../layout.swig' %}

{% block style %}
{% endblock %}

{% block body %}
<div class="page grid">
	<div class="col-1-1">
		<a href="/device/list">Back to list</a>
	</div>
	<div class="col-1-1">
		<div class="device-status led {{ ledClass }} device-toggle"></div>
	</div>
	<div class="col-1-2">
		<ul class="device-prop-list">
			<li class="device-prop-list-item">
				<span class="item-title">Device ID</span>
				<span class="item-value">{{ id|default('--') }}</span>
			</li>
			<li class="device-prop-list-item">
				<span class="item-title">Outlet ID</span>
				<span class="item-value">{{ outletId|default('--') }}</span>
			</li>
			<li class="device-prop-list-item">
				<span class="item-title">Name</span>
				<span class="item-value">{{ name|default('--') }}</span>
			</li>
			<li class="device-prop-list-item">
				<span class="item-title">Type</span>
				<span class="item-value">{{ type|default('--') }}</span>
			</li>
			<li class="device-prop-list-item">
				<span class="item-title">Description</span>
				<span class="item-value">{{ description|default('--') }}</span>
			</li>
		</ul>
	</div>
	<div class="col-1-2">
		<ul class="device-interval-list">
			{% for interval in DeviceIntervals  %}
			<li class="device-interval-list-item">
				<table class="device-interval-info">
					<tr>
						<td class="title">Device Interval ID</td>
						<td>{{ interval.id|default('--') }}</td>
					</tr>
					<tr>
						<td class="title">Device ID</td>
						<td>{{ interval.deviceId|default('--') }}</td>
					</tr>
					<tr>
						<td class="title">Current Interval ID</td>
						<td>{{ interval.currentInterval|default('--')|json }}</td>
					</tr>
					<tr>
						<td class="title">Interval Duration</td>
						<td>{{ interval.intervalMs|default('--') }}</td>
					</tr>
					<tr>
						<td class="title">Initial State</td>
						<td>{{ interval.initialState|default('--') }}</td>
					</tr>
					<tr>
						<td class="title">Is Paused</td>
						<td>{{ interval.isPaused|default('--') }}</td>
					</tr>
				</table>
			</li>
			{% endfor %}
		</ul>
	</div>
</div>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/devices.js"></script>
{% endblock %}
