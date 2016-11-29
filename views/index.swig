{% extends 'layout.swig' %}

{% block body %}
<h1>It works!</h1>
{% endblock %}

{% block scripts %}
<script>
	$(function(){
		$('body').append('<p>JavaScript is working as well!</p>');
		$('p').addClass('js-test');
	});
</script>
{% endblock %}
