window.socket = io.connect(window.location.origin + '/device');

$(function(){

	function toggleLed(id){
		var device = $(`.outlet-${id}`);
		device.find('.device-status').toggleClass('red green');
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
		if ($('.page').hasClass('disconnected'))
			location.reload();
	});

	$('.device-toggle').click(function(e){
		var deviceID = $(e.target).closest('.device-item').data('deviceid');
		$.post(window.location.pathname + '/toggle', { deviceId: deviceID });
	});
});
