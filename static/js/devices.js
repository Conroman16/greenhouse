window.socket = io.connect(window.location.origin + '/device');

$(function(){

	function toggleLed(id){
		var device = $(`.outlet-${id}`);
		if (!device.is('.device-status'))
			device = device.find('.device-status');
		device.toggleClass('red green');
	}

	socket.on('deviceOn', function(data){
		toggleLed(data.id);
	});

	socket.on('deviceOff', function(data){
		toggleLed(data.id);
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
});
