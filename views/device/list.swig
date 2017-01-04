{% extends '../layout.swig' %}

{% block style %}
{% endblock %}

{% block body %}
<div class="page grid">
	<div class="col-1-1">
		<a href="/device/create">Create</a>
	</div>
	<ul class="device-list list col-1-1">
		{% for device in devices %}
		<li class="device-item col-1-1 list-item device-{{ device.id }} outlet-{{ device.outletId }}" data-deviceid="{{ device.id }}">
			<div class="grid">
				<div class="col-1-6">
					<div class="device-status led {{ device.ledClass }} device-toggle"></div>
				</div>
				<div class="col-4-6">
					<ul class="device-prop-list">
						<li class="device-prop-list-item">
							<span class="item-title">Device ID</span>
							<span class="item-value">{{ device.id }}</span>
						</li>
						<li class="device-prop-list-item">
							<span class="item-title">Outlet ID</span>
							<span class="item-value">{{ device.outletId }}</span>
						</li>
						<li class="device-prop-list-item">
							<span class="item-title">Name</span>
							<span class="item-value">{{ device.name }}</span>
						</li>
						<li class="device-prop-list-item">
							<span class="item-title">Type</span>
							<span class="item-value">{{ device.type }}</span>
						</li>
						<li class="device-prop-list-item">
							<span class="item-title">Description</span>
							<span class="item-value">{{ device.description }}</span>
						</li>
					</ul>
				</div>
				<div class="col-1-6">
					<a href="/device/details/{{ device.id }}">Details</a>
					<a href="#" class="js-delete" data-deviceid="{{ device.id }}" data-devicename="{{ device.name }}">Delete</a>
				</div>
			</div>
		</li>
		{% endfor %}
	</ul>
</div>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/devices.js"></script>
<script>
	$(function(){
		$('.js-delete').click(function(){
			var self = $(this);
			var deviceId = self.data('deviceid');
			var deviceName = self.data('devicename');
			if (confirm('Are you sure you want to delete ' + deviceName + '?')){
				$.post(window.location.origin + '/device/delete', {
					deviceId: deviceId
				}, function(){
					window.location.pathname = '/device/list';
				});
			}
		});
	})
</script>
{% endblock %}
