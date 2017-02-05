window.socket = io.connect(window.location.origin + '/device');

$(function(){

	function toggleLed(id){
		var device = $(`.outlet-${id}`);
		if (!device.is('.device-status'))
			device = device.find('.device-status');
		device.toggleClass('red green');
	}

	function toggleIsOn(id, isTurnedOn){
		var device = $(`.outlet-${id}`);
		device = device.find('.isOn');
		if (isTurnedOn)
			device.text('True');
		else
			device.text('False');
	}

	socket.on('deviceOn', function(data){
		toggleLed(data.id);
		toggleIsOn(data.id, true);
	});

	socket.on('deviceOff', function(data){
		toggleLed(data.id);
		toggleIsOn(data.id, false);
	});

	socket.on('disconnect', function(){
		$('.page').addClass('disconnected');
		$('.led').removeClass('red green').addClass('yellow');
	});

	socket.on('connect', function(){
		if ($('.page').hasClass('disconnected')){
			setTimeout(function(){
				location.reload();
			}, 500);
		}
	});

	$('.device-toggle').click(function(e){
		var dID = $(e.target).data('deviceid');
		var deviceID = dID || $(e.target).closest('.device-item').data('deviceid');
		$.post('/device/toggle', { deviceId: deviceID });
	});

	$('.device-pause-toggle').click(function(){
		var $this = $(this);
		var deviceId = $this.data('deviceid');
		var isPaused = $this.hasClass('paused');
		var url = '/device/';
		var data = { deviceId: deviceId };
		if (isPaused)
			url += 'unpause';
		else
			url += 'pause';

		$.post(url, data)
			.fail(function(err){
				console.error(err);
				swal({
					type: 'error',
					title: 'Error!',
					text: 'Unable to unpause device'
				});
			})
			.done(function(){
				let newBtnTxt = isPaused ? 'Pause' : 'Unpause';
				$this.text(newBtnTxt);
				$this.toggleClass('paused');
			});
	});
});
