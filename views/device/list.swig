{% extends '../layout.swig' %}

{% block body %}
<div class="page container">
	<a class="btn btn-secondary" href="/device/create">Create</a>
	<div class="row">
		{% for device in devices %}
		<div class="device-wrapper col-md-4">
			<div class="card device-item device-{{ device.id }} outlet-{{ device.outletId }}" data-deviceid="{{ device.id }}">
				<div class="card-block">
					<div class="row">
						<div class="col device-header">
							{% if device.outletId %}
								<div class="device-status led {{ device.ledClass }} device-toggle"></div>
							{% endif %}
							{% if device.sensorId %}
								<div class="device-status climate">
									<span class="temp">{{ device.temperature|default('--') }} °F</span>
									<span class="humidity">{{ device.humidity|default('--') }}%</span>
								</div>
							{% endif %}
						</div>
					</div>
					<div class="row">
						<div class="col device-prop-list">
						{% if device.outletId %}
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Outlet</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.outletId }}</div>
								</div>
							</div>
						{% endif %}
						{% if device.sensorId %}
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Sensor</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.sensorId }}</div>
								</div>
							</div>
						{% endif %}
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Name</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.name }}</div>
								</div>
							</div>
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Is On</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value isOn">{{ device.isOn|not|not|capfirst }}</div>
								</div>
							</div>
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Type</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.type|capfirst }}</div>
								</div>
							</div>
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Description</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.description }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="card-footer text-center">
					<a href="#" class="js-delete btn btn-danger" data-deviceid="{{ device.id }}">Delete</a>
					<a href="#" class="device-pause-toggle btn btn-secondary" data-deviceid="{{ device.id }}">Pause</a>
					<a href="/device/edit/{{ device.id }}" class="btn btn-secondary">Edit</a>
					<a href="/device/details/{{ device.id }}" class="btn btn-info">Details</a>
				</div>
			</div>
		</div>
		{% endfor %}
	</div>
</div>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/device/devices.js"></script>
<script src="/static/js/device/list.js"></script>
{% endblock %}
