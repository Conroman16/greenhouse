$(function(){
	$('.js-add-agenda').click(function(){
		var deviceId = $(this).data('deviceid');
		var formPostUrl = '/device/addagenda';
		$('.device-agendas').html(templates.addDeviceForm({ action: formPostUrl }));
		$('.add-device-form').submit(function(ev){
			ev.preventDefault();
			$.post(formPostUrl, {
				deviceId: deviceId,
				timeString: $('.input[name="timeString"]').val(),
				agendaName: $('.input[name="agendaName"]').val()
			}, function(res){
				swal({
					type: 'success',
					title: 'Woot!',
					text: 'The agenda was created successfully'
				},
				function(){
					window.location.reload();
				});
			}).fail(function(err){
				console.error(err);
				swal({
					type: 'error',
					title: 'Error',
					text: 'There was an error creating the agenda'
				},
				function(){
					window.location.reload();
				});
			});
		});
	});

	$('.js-delete-btn').click(function(){
		var agendaId = JSON.parse($(this).data('agendaid'));
		swal({
			type: 'warning',
			title: 'Are you sure?',
			text: 'Are you sure you want to delete this agenda?  This cannot be undone!',
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
			confirmButtonColor: '#e74c3c',
			confirmButtonText: 'Yes',
			cancelButtonText: 'Nope'
		}, function(isConfirm){
			if (isConfirm){
				$.post('/device/deleteagenda/', { agendaId: agendaId }, function(res){
					swal({
						type: 'success',
						title: 'Success!',
						text: 'The agenda was deleted successfully'
					},
					function(){
						window.location.reload();
					});
				})
				.fail(function(err){
					console.error(err);
					swal({
						type: 'error',
						title: 'Ah man!',
						text: 'An error occurred while attempting to delete the agenda'
					},
					function(){
						window.location.reload();
					});
				});
			}
		});
	});
});
