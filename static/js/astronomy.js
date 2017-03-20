$(function(){
	$.get('/astronomy')
		.done(function(data){
			data.sunrise = moment(data.sunrise).format('h:mma');
			data.sunset = moment(data.sunset).format('h:mma');
			$('.astronomy-wrap')
				.html(templates.navbarAstronomyTemplate(data))
				.removeClass('invisible');
		});
})
