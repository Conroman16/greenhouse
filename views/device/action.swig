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
