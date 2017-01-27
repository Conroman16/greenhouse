<script id="add-device-form" data-name="addDeviceForm" type="text/x-swig-template">
	<form class="add-device-form" action="<{ action }>" method="POST">
		<input type="hidden" value="<{ deviceId }>" />
		<div class="form-group">
			<label for="timeString">Time String</label>
			<input type="text" class="form-control input" name="timeString" aria-label="Time String" required />
		</div>
		<div class="form-group">
			<label for="agendaName">Agenda Name</label>
			<input type="text" class="form-control input" name="agendaName" aria-label="Agenda Name" required />
		</div>
		{# <div class="form-group">
			<label for="agenda">Job</label>
			<select name="agenda">
				{% for agenda in DeviceAgendas %}

				{% endfor %}
			</select>
		</div> #}
		<div class="form-group">
			<input type="submit" class="btn btn-submit" />
		</div>
	</form>
</script>
