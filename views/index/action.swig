{% extends '../layout.swig' %}

{% block body %}
	<form method="POST", action="{{ action }}">
		<p>Are you sure you want to {{ action }} this computer?</p>
		<input type="submit" value="Yes">
		<button class="btn-no">No</button>
	</form>
{% endblock %}

{% block scripts %}
<script>
	$(function(){
		$('.btn-no').click(function(e){
			e.preventDefault();
			location.href = '/';
		});
	})
</script>
{% endblock %}
