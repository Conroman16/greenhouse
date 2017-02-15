{% extends '../layout.swig' %}

{% block body %}
<div class="page">
	<div class="container outlet-{{ Device.outletId }}">
		<a class="btn btn-secondary" href="/device/list">Back to list</a>
		{% if Device.outletId %}
		<div class="row">
			<div class="col">
				<div class="device-status led {{ Device.ledClass }} device-toggle outlet-{{ Device.outletId }}" data-deviceid="{{ Device.id }}"></div>
			</div>
		</div>
		{% endif %}
		<div class="row">
			<div class="col-md-6">
				<table>
					<tr>
						<td class="item-title">Device ID</td>
						<td class="item-value">{{ Device.id|default('--') }}</td>
					</tr>
					{% if Device.outletId %}
					<tr>
						<td class="item-title">Outlet ID</td>
						<td class="item-value">{{ Device.outletId }}</td>
					</tr>
					{% endif %}
					{% if Device.sensorId %}
					<tr>
						<td class="item-title">Sensor ID</td>
						<td class="item-value">{{ Device.sensorId }}</td>
					</tr>
					{% endif %}
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
						<td class="item-value">{{ Device.defaultSetting|onoff|capfirst }}</td>
					</tr>
					<tr>
						<td class="item-title">Is Paused</td>
						<td class="item-value">{{ Device.isPaused|not|not|capfirst }}</td>
					</tr>
					<tr>
						<td class="item-title">Is On</td>
						<td class="item-value isOn">{{ Device.isOn|not|not|capfirst }}</td>
					</tr>
				</table>
			</div>
			{% if Device.TemperatureLogs|notempty %}
			<div class="col-md-6">
				<table class="temp-log">
					<tr>
						<th>Temperature</th>
						<th>Humidity</th>
					</tr>
					{% for tempLog in Device.TemperatureLogs  %}
					<tr>
						<td>{{ tempLog.temperature_f|tempf|default('--') }}</td>
						<td>{{ tempLog.humidity|percent|default('--') }}</td>
					</tr>
					{% endfor %}
				</table>
			</div>
			{% endif %}
			{% if Device.DeviceAgendas|notempty %}
			<div class="col-md-6">
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
			{% endif %}
		</div>
		<div class="row">
			<div class="col-1">
				<button class="js-add-agenda btn btn-success" data-deviceid="{{ Device.id }}">+ Add</button>
			</div>
			<div class="col add-device-agenda-form-wrap"></div>
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
			<input type="text" class="form-control-inline input" name="timeString" aria-label="Time String" />
		</div>
		<div class="form-group">
			<label for="agendaName">Agenda Name</label>
			<select name="agendaName" class="input">
				{% for job in AllAgendaJobs %}
					<option class="agenda-item" value="{{ job.value }}">{{ job.text }}</option>
				{% endfor %}
			</select>
		</div>
		<div class="form-group form-check form-check-inline">
			<label for="repeating" class="form-check-label">
				<input type="checkbox" name="repeating" class="form-check-input input no-check-padding" aria-label="Repeating" value="1" />
				Repeating
			</label>
		</div>
		<div class="form-group">
			<input type="submit" class="btn btn-submit" />
		</div>
	</form>
</script>
{% endblock %}

{% block scripts %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.6.0/socket.io.min.js"></script>
<script src="/static/js/device/devices.js"></script>
<script src="/static/js/device/details.js"></script>
{% endblock %}
