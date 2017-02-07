{% extends '../layout.swig' %}

{% block style %}
<style>
	.indx-header,
	.indx-body{
		text-align: center;
	}
	.indx-img{
		display: block;
		margin: auto;
		padding: 2em;
	}
</style>
{% endblock %}

{% block body %}
	<div class="container">
		<div class="row">
			<div class="col"></div>
			<div class="col-7">
				<h1 class="indx-header">Greenhouse</h1>
				<img class="indx-img" src="/static/img/favicon.ico" />
				<p class="indx-body">
					Welcome to the Greenhouse!
				</p>
			</div>
			<div class="col"></div>
		</div>
	</div>
{% endblock %}
