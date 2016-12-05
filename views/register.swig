{% extends 'layout.swig' %}

{% block body %}
	<form id="create-form" method="post" action="{{ RegisterPath }}">
		<label for="firstname">First Name:</label>
		<input type="text" class="firstname" name="firstname" />

		<label for="lastname">Last Name:</label>
		<input type="text" class="lastname" name="lastname" />

		<label for="username">Username:</label>
		<input type="text" class="username" name="username" />

		<label for="password">Password:</label>
		<input type="password" class="password" name="password" />

		<label for="passwordverify">Verify Password:</label>
		<input type="password" class="passwordverify" name="passwordverify" />

		<input type="submit" value="Create Account">
	</form>
	<br>
	<a href="{{ LoginPath }}">Login</a>
{% endblock %}

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
