{% extends '../layout.swig' %}

{% block body %}
<form id="device-create-form" method="post" action="/device/{{ action }}">
	<input type="hidden" name="deviceId" value="{{ device.id }}">

	<div class="form-group">
		<label for="deviceName">Name:</label>
		<input class="form-control" type="text" name="deviceName" required{% if device %} value="{{ device.name|default('') }}"{% endif %}>
	</div>

	<div class="form-group">
		<label for="deviceType">Type:</label>
		<select class="form-control" name="deviceType" required>
			<option value="-1"></option>
			{% for dt in DeviceTypes %}
			<option value="{{ dt.Value }}"{% if dt.Selected %} selected{% endif %}>{{ dt.Name }}</option>
			{% endfor %}
		</select>
	</div>

	<div class="form-group">
		<label for="outletId">Outlet:</label>
		<select class="form-control" name="outletId" required>
			<option value="-1"></option>
			{% for o in Outlets %}
			<option value="{{ o.Value }}"{% if o.Selected %} selected{% endif %}>{{ o.Value }}</option>
			{% endfor %}
		</select>
	</div>

	<div class="form-group">
		<label for="deviceDescription">Description:</label>
		<textarea class="form-control" name="deviceDescription">{% if device %}{{ device.description|default('') }}{% endif %}</textarea>
	</div>

	<div class="form-group">
		<label>Default State</label><br>
		<div class="form-check form-check-inline">
			<label class="form-check-label">
				<input type="radio" name="defaultSetting" value="0" checked>
				Off
			</label>
		</div>
		<div class="form-check form-check-inline">
			<label class="form-check-label">
				<input type="radio" name="defaultSetting" value="1">
				On
			</label>
		</div>
	</div>

	<input type="submit" value="{{ action|capitalize }}">
</form>
{% endblock %}

{% block scripts %}
<script>
$(function(){
	var $form = $('#device-create-form');
	$form.submit(function(ev){
		ev.preventDefault();
		$.post($form.prop('action'), {
			deviceId: $('.form-control[name="deviceId"]').val(),
			deviceName: $('.form-control[name="deviceName"]').val(),
			deviceType: $('.form-control[name="deviceType"]').val(),
			outletId: $('.form-control[name="outletId"]').val(),
			deviceDescription: $('.form-control[name="deviceDescription"]').val(),
			defaultSetting: $('.form-control[name="defaultSetting"]').val()
		})
		.done(function(){
			window.location.pathname = '/device/list';
		})
		.fail(function(err){
			console.error();
			swal({
				type: 'error',
				title: 'Error',
				text: 'An error occurred while attempting to create the device'
			});
		});
	});
});
</script>
{% endblock %}
