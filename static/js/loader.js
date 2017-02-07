(function(){
	window.loader = {

		_loaders: [],

		showLoading: function(target){
			if (!target)
				target = 'body';
			if (!(target instanceof jQuery))
				target = $(target);

			target.addClass('loading');
			target.append(templates.loader());
			target.find('.loading-overlay').removeClass('loader-hidden');
			loader._loaders.push(target);
		},

		doHideLoader: function(target){
			if (!(target instanceof jQuery))
				target = $(target);

			target.find('.loading-overlay').addClass('loader-hidden');
			setTimeout(function(){
				target.find('.loading-overlay').remove();
				target.removeClass('loading');
			}, 1000);
		},

		hideLoading: function(target){
			if (!target){
				for (var i in loader._loaders){
					loader.doHideLoader(loader._loaders[i]);
				}
			}
			else
				loader.doHideLoader(target);
		}
	};
})();
