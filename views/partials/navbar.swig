<nav class="navbar navbar-toggleable-md navbar-light topnav">
	<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"
			aria-expanded="false" aria-label="Menu">
		<span class="navbar-toggler-icon"></span>
	</button>
	<a class="navbar-brand" href="/">
		<img src="/static/img/favicon.ico" alt="logo" class="logo align-middle" width="32px" />
	</a>
	<div class="collapse navbar-collapse align-middle" id="navbarNav">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item active">
				<a class="nav-link" href="/">Home</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/device/list">Devices</a>
			</li>
			<li class="nav-item">
				{% if IsNotAuthed %}<a class="nav-link" href="{{ LoginPath }}">Login</a>{% endif %}
			</li>
			{% if IsAuthed %}
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Admin</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<a class="dropdown-item" href="/outlets">Outlets</a>
					<a class="dropdown-item" href="/device/list">Devices</a>
					<a class="dropdown-item" href="/agendash">Agendash</a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="/shutdown">Shutdown</a>
					<a class="dropdown-item" href="/restart">Restart</a>
					<div class="dropdown-divider"></div>
					<a class="dropdown-item" href="{{ LogoutPath }}">Logout</a>
				</div>
			</li>
			{% endif %}
		</ul>
	</div>
</nav>
