{% extends '../layout.swig' %}

{% block body %}
	<div class="login-form-wrap container">
		<div class="row">
			<div class="col-md"></div>
			<div class="col-md-6">
				<form id="login-form" method="post" class="auth-form">
					<div class="form-group">
						<label for="username" class="col-form-label">Username</label>
						<input type="text" class="form-control email" name="username" />
					</div>
					<div class="form-group">
						<label for="password" class="col-form-label">Password</label>
						<input type="password" class="form-control password" name="password" />
					</div>
					<div class="form-group">
						<div class="error-fb form-control-feedback hide"></div>
					</div>
					<div class="clearfix">
						<input type="submit" value="Log In" class="btn btn-submit pull-right" />
					</div>
				</form>
			</div>
			<div class="col-md"></div>
		</div>
	</div>
{% endblock %}

{% block scripts %}
	<script>
		var loginUrl = '{{ LoginPath }}' + (location.search || '');
		var errorForm = function(){
			$('.form-control').addClass('form-control-danger')
			$('.form-group').addClass('has-danger');
		};
		var clearErrors = function(){
			$('.form-control').removeClass('form-control-danger')
			$('.form-group').removeClass('has-danger');
		};
		$(function(){
			$('#login-form')
				.prop('action', loginUrl)
				.submit(function(ev){
					ev.preventDefault();
					var username = $('.form-control[name="username"]');
					var password = $('.form-control[name="password"]');

					if (!username.val() || !password.val())
						return errorForm();
					else
						loader.showLoading();

					$.post(loginUrl, {
					    username: username.val(),
						password: password.val()
					}, function(data){
						window.location.href = data.redirectUrl || '/';
					}).catch(function(err){
					    errorForm();
					    console.error(err);
					    var fb = err.responseJSON.error || '';
					    if (fb)
							$('.error-fb').text(fb).removeClass('hide');

						$('.form-control').on('keydown', clearErrors);
					})
					.always(function(){
						loader.hideLoading();
					});
				});
		});
	</script>
{% endblock %}
