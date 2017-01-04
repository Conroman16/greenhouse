{% extends '../layout.swig' %}

{% block body %}
<form id="device-create-form" method="post" action="/device/{{ action }}">
	<input type="hidden" name="deviceId" value="{{ device.id }}">

	<label for="deviceName">Name:</label>
	<input type="text" name="deviceName" required{% if device %} value="{{ device.name|default('') }}"{% endif %}>

	<label for="deviceType">Type:</label>
	<select name="deviceType" required>
		<option value="-1"></option>
		{% for dt in DeviceTypes %}
		<option value="{{ dt.Value }}"{% if dt.Selected %} selected{% endif %}>{{ dt.Name }}</option>
		{% endfor %}
	</select>

	<label for="outletId">Outlet:</label>
	<select name="outletId" required>
		<option value="-1"></option>
		{% for o in Outlets %}
		<option value="{{ o.Value }}"{% if o.Selected %} selected{% endif %}>{{ o.Value }}</option>
		{% endfor %}
	</select>

	<label for="deviceDescription">Description:</label>
	<textarea name="deviceDescription">{% if device %}{{ device.description|default('') }}{% endif %}</textarea>

	<input type="submit" value="{{ action|capitalize }}">
</form>
{% endblock %}

{% block scripts %}
{% endblock %}
