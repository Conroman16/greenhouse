$(function(){
	$('.js-delete').click(function(){
		var self = $(this);
		var deviceId = self.data('deviceid');
		var deviceName = self.data('devicename');

		swal({
			title: 'Are you sure you want to delete ' + deviceName + '?',
			text: 'This device will be deleted forever and you won\'t be able to get it back!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#e74c3c',
			confirmButtonText: 'Yes',
			cancelButtonText: 'Nope',
			closeOnConfirm: false,
			showLoaderOnConfirm: true
		},
		function(isConfirm){
			if (isConfirm) {
				$.post(window.location.origin + '/device/delete', {
					deviceId: deviceId
				}, function(){
					$('.device-' + deviceId).css('opacity', 0);
					setTimeout(function(){
						$('.device-' + deviceId).remove();
					}, 750);
					swal({
						type: 'success',
						title: 'Success',
						text: '<strong>' + deviceName + '</strong> was deleted successfully',
						html: true,
						timer: 750
					});
				})
				.catch(function(err){
					console.error(err);
					swal({
						type: 'error',
						title: 'Error',
						text: 'An error occurred while deleting the device'
					});
				});
			}
		});
	});
});
