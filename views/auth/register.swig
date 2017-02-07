{% extends '../layout.swig' %}

{% block scripts %}
<script>
	$(function(){
		$('#create-form').submit(function(e){
			e.preventDefault();

			var pass = $('.password').val();
			var pass2 = $('.passwordverify').val();

			if (pass !== pass2){
			    console.log('Passwords do not match');
			    return;
			}

			this.submit();
			console.log('submitted');
		});
	});
</script>
{% endblock %}

{% block body %}
	<div class="register-form-wrap container">
		<div class="row">
			<div class="col"></div>
			<div class="col-6">
				<form id="create-form" method="post" action="{{ RegisterPath }}" class="auth-form">
					<div class="form-group row">
						<label for="firstname" class="col-3 col-form-label">First Name</label>
						<div class="col-9">
							<input type="text" class="form-control firstname" name="firstname" />
						</div>
					</div>

					<div class="form-group row">
						<label for="lastname" class="col-3 col-form-label">Last Name</label>
						<div class="col-9">
							<input type="text" class="form-control lastname" name="lastname" />
						</div>
					</div>

					<div class="form-group row">
						<label for="username" class="col-3 col-form-label">Username</label>
						<div class="col-9">
							<input type="text" class="form-control username" name="username" required />
						</div>
					</div>

					<div class="form-group row">
						<label for="password" class="col-3 col-form-label">Password</label>
						<div class="col-9">
							<input type="password" class="form-control password" name="password" required />
						</div>
					</div>

					<div class="form-group row">
						<label for="passwordverify" class="col-3 col-form-label">Verify Password</label>
						<div class="col-9">
							<input type="password" class="form-control passwordverify" name="passwordverify" required />
						</div>
					</div>
					<div class="row">
						<div class="col">
							<input type="submit" value="Create Account" class="btn btn-submit pull-right" />
						</div>
					</div>
				</form>
			</div>
			<div class="col"></div>
		</div>
	</div>
{% endblock %}

