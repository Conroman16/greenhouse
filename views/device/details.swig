{% extends '../layout.swig' %}

{% block body %}
<div class="page">
	<div class="container">
		<a class="btn btn-secondary" href="/device/list">Back to list</a>
		<div class="row">
			<div class="col">
				<div class="device-status led {{ Device.ledClass }} device-toggle outlet-{{ Device.outletId }}" data-deviceid="{{ Device.id }}"></div>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<table>
					<tr>
						<td class="item-title">Device ID</td>
						<td class="item-value">{{ Device.id|default('--') }}</td>
					</tr>
					<tr>
						<td class="item-title">Outlet ID</td>
						<td class="item-value">{{ Device.outletId|default('--') }}</td>
					</tr>
					<tr>
						<td class="item-title">Name</td>
						<td class="item-value">{{ Device.name|default('--') }}</td>
					</tr>
					<tr>
						<td class="item-title">Type</td>
						<td class="item-value">{{ Device.type|default('--') }}</td>
					</tr>
					<tr>
						<td class="item-title">Description</td>
						<td class="item-value">{{ Device.description|default('--') }}</td>
					</tr>
					<tr>
						<td class="item-title">Default State</td>
						<td class="item-value">{{ Device.defaultSetting }}</td>
					</tr>
				</table>
			</div>
		</div>
		{% if Device.DeviceAgendas %}<hr>{% endif %}
		<div class="row">
			<div class="col">
				{% for agenda in Device.DeviceAgendas  %}
				<div class="row">
					<div class="col-1"></div>
					<div class="col">
						<table class="col device-interval-info">
							<tr>
								<td class="title">Device Agenda ID</td>
								<td>{{ agenda.id|default('--') }}</td>
							</tr>
							<tr>
								<td class="title">Device ID</td>
								<td>{{ agenda.deviceId|default('--') }}</td>
							</tr>
							<tr>
								<td class="title">Agenda Job Name</td>
								<td>{{ agenda.agendaJobName|default('--') }}</td>
							</tr>
							<tr>
								<td class="title">Time String</td>
								<td>{{ agenda.timeString|default('--') }}</td>
							</tr>
						</table>
					</div>
					<div class="col-1">
						<button class="js-delete-btn btn btn-danger" data-agendaid="{{ agenda.id }}">X</button>
					</div>
				</div>
				{% endfor %}
			</div>
		</div>
		<div class="row">
			<div class="col-1">
				<button class="js-add-agenda btn btn-success">+ Add</button>
			</div>
			<div class="col device-agendas"></div>
		</div>
	</div>
</div>
{% endblock %}

{% block templates %}
<script id="add-device-form" data-name="addDeviceForm" type="text/x-swig-template">
	<form class="add-device-form" action="<{ action }>" method="POST">
		<input type="hidden" value="<{ deviceId }>" />
		<div class="form-group">
			<label for="timeString">Time String</label>
			<input type="text" class="form-control input" name="timeString" aria-label="Time String" required />
		</div>
		<div class="form-group">
			<label for="agendaName">Agenda Name</label>
			<select name="agendaName" class="input">
				{% for job in AllAgendaJobs %}
					<option class="agenda-item" value="{{ job }}">{{ job }}</option>
				{% endfor %}
			</select>
		</div>
		<div class="form-group">
			<input type="submit" class="btn btn-submit" />
		</div>
	</form>
</script>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/devices.js"></script>
<script>
	$(function(){
		$('.js-add-agenda').click(function(){
			var formPostUrl = '/device/addagenda/{{ Device.id }}';
			$('.device-agendas').html(templates.addDeviceForm({ action: formPostUrl }));
			$('.add-device-form').submit(function(ev){
				ev.preventDefault();
				$.post(formPostUrl, {
					timeString: $('.input[name="timeString"]').val(),
					agendaName: $('.input[name="agendaName"]').val()
				}, function(res){
					swal({
						type: 'success',
						title: 'Woot!',
						text: 'The agenda was created successfully'
					},
					function(){
						window.location.reload();
					});
				}).fail(function(err){
					console.error(err);
					swal({
						type: 'error',
						title: 'Error',
						text: 'There was an error creating the agenda'
					},
					function(){
						window.location.reload();
					});
				});
			});
		});

		$('.js-delete-btn').click(function(){
			var agendaId = JSON.parse($(this).data('agendaid'));
			swal({
				type: 'warning',
				title: 'Are you sure?',
				text: 'Are you sure you want to delete this agenda?  This cannot be undone!',
				showCancelButton: true,
				closeOnConfirm: false,
				showLoaderOnConfirm: true,
				confirmButtonColor: '#e74c3c',
				confirmButtonText: 'Yes',
				cancelButtonText: 'Nope'
			}, function(isConfirm){
				if (isConfirm){
					$.post('/device/deleteagenda/' + agendaId, function(res){
						swal({
							type: 'success',
							title: 'Success!',
							text: 'The agenda was deleted successfully'
						},
						function(){
							window.location.reload();
						});
					})
					.fail(function(err){
						console.error(err);
						swal({
							type: 'error',
							title: 'Ah man!',
							text: 'An error occurred while attempting to delete the agenda'
						},
						function(){
							window.location.reload();
						});
					});
				}
			});
		});
	});
</script>
{% endblock %}
