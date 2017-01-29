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
						<div class="col">
							<div class="device-status led {{ device.ledClass }} device-toggle"></div>
						</div>
					</div>
					<div class="row">
						<div class="col device-prop-list">
							<div class="row device-prop-list-item">
								<div class="col-4 left-col">
									<div class="item-title">Outlet</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.outletId }}</div>
								</div>
							</div>
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
									<div class="item-title">Type</div>
								</div>
								<div class="col-8 right-col">
									<div class="item-value">{{ device.type|capitalize }}</div>
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
					<a href="#" class="js-delete btn btn-danger" data-deviceid="{{ device.id }}" data-devicename="{{ device.name }}">Delete</a>
					&nbsp;&nbsp;
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
<script src="/static/js/devices.js"></script>
<script>
	$(function(){
		$('.js-delete').click(function(){
			var self = $(this);
			var deviceId = self.data('deviceid');
			var deviceName = self.data('devicename');

			swal({
				title: 'Are you sure you want to delete ' + deviceName + '?',
				text: 'This device will be deleted forever and you won\'t be able to get it back!',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#e74c3c',
				confirmButtonText: 'Yes',
				cancelButtonText: 'Nope',
				closeOnConfirm: false,
				showLoaderOnConfirm: true
			},
			function(isConfirm){
				if (isConfirm) {
					$.post(window.location.origin + '/device/delete', {
						deviceId: deviceId
					}, function(){
						$('.device-' + deviceId).css('opacity', 0);
						setTimeout(function(){
							$('.device-' + deviceId).remove();
						}, 750);
						swal({
							type: 'success',
							title: 'Success',
							text: '<strong>' + deviceName + '</strong> was deleted successfully',
							html: true,
							timer: 750
						});
					})
					.catch(function(err){
						console.error(err);
						swal({
							type: 'error',
							title: 'Error',
							text: 'An error occurred while deleting the device'
						});
					});
				}
			});
		});
	})
</script>
{% endblock %}
