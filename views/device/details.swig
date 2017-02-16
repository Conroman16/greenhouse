{% extends '../layout.swig' %}

{% block body %}
<div class="page">
	<div class="container outlet-{{ Device.outletId }}">
		<div class="row">
			<div class="col">
				<a class="btn btn-secondary" href="/device/list">Back to list</a>
			</div>
		</div>
		<br>
		{% if Device.outletId %}
		<div class="row">
			<div class="col">
				<div class="device-status led {{ Device.ledClass }} device-toggle outlet-{{ Device.outletId }}" data-deviceid="{{ Device.id }}"></div>
			</div>
		</div>
		{% endif %}
		<div class="row">
			<div class="col-xl-6">
				<div class="card">
					<div class="card-block">
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
				</div>
				<br>
			</div>
			{% if Device.TemperatureLogs|notempty %}
			<div class="col-xl-6">
				<div class="card">
					<div class="card-block">
						<canvas id="temp-chart-canvas"></canvas>
					</div>
				</div>
				<br>
				<div class="card">
					<div class="card-block">
						<canvas id="humid-chart-canvas"></canvas>
					</div>
				</div>
			</div>
			{% endif %}
			{% if Device.DeviceAgendas|notempty %}
			<div class="col-xl-6">
				{% for agenda in Device.DeviceAgendas  %}
				<div class="row">
					<div class="col card">
						<div class="card-block row">
							<div class="col">
								<table>
									<tr>
										<td class="item-title">Agenda Job Name</td>
										<td class="item-value">{{ agenda.agendaJobName|default('--') }}</td>
									</tr>
									<tr>
										<td class="item-title">Time String</td>
										<td class="item-value">{{ agenda.timeString|default('--') }}</td>
									</tr>
									<tr>
										<td class="item-title">Repeating</td>
										<td class="item-value">{{ agenda.repeating|not|not }}</td>
									</tr>
									<tr>
										<td class="item-title">Is Paused</td>
										<td class="item-value">{{ agenda.isPaused|not|not }}</td>
									</tr>
								</table>
							</div>
							<div class="col-2">
								<a href="#" class="js-delete-btn btn btn-danger pull-right" data-agendaid="{{ agenda.id }}">X</a>
							</div>
						</div>
					</div>
				</div>
				<br>
				{% endfor %}
			</div>
			{% endif %}
		</div>
		<div class="row">
			<div class="col-2">
				<button class="js-add-agenda btn btn-success" data-deviceid="{{ Device.id }}">+ Add Agenda</button>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<script src="/static/js/device/devices.js"></script>
<script src="/static/js/device/details.js"></script>
<script>
	function createChart(canvas, type){
		return new Promise(function(resolve, reject){
			let isTemp = type === 'temperature';

			$.get('/device/chartdata/' + type + '/{{ Device.id }}', {
				timestamp: new Date(new Date() - 1000 * 60 * 60 * 24).toJSON(),
				yminoffset: 5,
				ymaxoffset: 5
			})
			.fail((err) => {
				console.error(err);
				reject(err);
			})
			.done(function(resData){
				let ctx = canvas;
				if (ctx.length <= 0)
					return;

				var chartOpts = {
					scales: {
						yAxes: [{
							ticks: {
								min: resData.ymin,
								max: resData.ymax
							},
							scaleLabel: {
								display: true,
								labelString: isTemp ? 'Degrees (Fahrenheit)' : 'Percentage (%)'
							}
						}],
						xAxes: [{
							type: 'time',
							time: {
								unit: 'hour',
							}
						}]
					},
					tooltips: {
						enabled: true,
						callbacks: {
							title: (tooltipItems, data) => moment(tooltipItems.xLabel).format('M/D/YY h:mma'),
							label: (tooltipItems, data) => `${tooltipItems.yLabel}${isTemp ? ' °F' : '%'}`
						}
					}
				};
				let data = {
					datasets: [{
						label: isTemp ? 'Temperature' : 'Humidity',
						spanGaps: true,
						data: resData.data,
						backgroundColor: isTemp ? 'rgba(230, 126, 34, 0.25)' : 'rgba(52, 152, 219, 0.25)',
						borderColor: isTemp ? 'rgba(230, 126, 34, 0.75)' : 'rgba(52, 152, 219, 0.75)'
					}]
				};
				let chart = new Chart(ctx, {
					type: 'line',
					data: data,
					options: chartOpts
				});
				resolve(chart);
			});
		});
	}

	$(function(){
		let tempCtx = $('#temp-chart-canvas');
		let humidCtx = $('#humid-chart-canvas');

		let tempLoaderTarget = tempCtx.closest('.card');
		let humidLoaderTarget = humidCtx.closest('.card');

		loader.showLoading(tempLoaderTarget);
		loader.showLoading(humidLoaderTarget);

		if (tempCtx.length > 0)
			createChart(tempCtx, 'temperature')
				.then(() => loader.hideLoading(tempLoaderTarget));
		if (humidCtx.length > 0)
			createChart(humidCtx, 'humidity')
				.then(() => loader.hideLoading(humidLoaderTarget));
	});
</script>
{% endblock %}
