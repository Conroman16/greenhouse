window.socket = io.connect(window.location.href);

$(function(){

	function toggleLed(id){
		var outlet = $(`.outlet-${id}`);
		outlet.parent().find('.outlet-status').toggleClass('red green');
	}

	socket.on('outletOn', function(data){
		toggleLed(data.id);
	});

	socket.on('outletOff', function(data){
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

	$('.outlet-toggle').click(function(e){
		var outletID = $(e.target).closest('.outlet').data('outletid');
		$.post(window.location.pathname, { outletId: outletID });
	});
});
