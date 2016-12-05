window.socket = io.connect(window.location.href);

$(function(){
	window.socket.on('outletOn', function(data){
		var outlet = $(`.outlet-${data.id}`);
		outlet.parent().find('.outlet-status').toggleClass('red green');
	});
	window.socket.on('outletOff', function(data){
		var outlet = $(`.outlet-${data.id}`);
		outlet.parent().find('.outlet-status').toggleClass('red green');
	});

	$('.outlet-toggle').click(function(e){
		var $el = $(e.target);
		$.post(window.location.pathname, { outletId: $el.data('outletid') });
	});
});
