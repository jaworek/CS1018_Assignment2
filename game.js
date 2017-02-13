var player;
var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;

function keyup(event) {
	if (event.keyCode == 37) {		
		leftPressed = false;
		if (!leftPressed && !rightPressed && !upPressed && !downPressed) {
			player.className = 'character standLeft';
		}
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		if (!leftPressed && !rightPressed && !upPressed && !downPressed) {
			player.className = 'character standRight';
		}
	}
	if (event.keyCode == 38) {
		upPressed = false;
		if (!leftPressed && !rightPressed && !upPressed && !downPressed) {
			player.className = 'character standUp';
		}
	}
	if (event.keyCode == 40) {
		downPressed = false;
		if (!leftPressed && !rightPressed && !upPressed && !downPressed) {
			player.className = 'character standDown';
		}
	}	
}


function move() {
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		player.style.top = positionTop+1 + 'px';
		player.className = 'character walkDown';
	}
	if (upPressed) {
		player.style.top = positionTop-1 + 'px';
		player.className = 'character walkUp';
	}
	if (leftPressed) {
		player.style.left = positionLeft-1 + 'px';
		player.className = 'character walkLeft';
	}
	if (rightPressed) {
		player.style.left = positionLeft+1 + 'px';
		player.className = 'character walkRight';
	}

}


function keydown(event) {
	if (event.keyCode == 37) {		
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}	
}


function setHead() {
	player.getElementsByClassName('head')[0].style.backgroundImage = 'url(images/' + this.id + '.png)';
}

function setBody() {
	player.getElementsByClassName('body')[0].style.backgroundImage = 'url(images/' + this.id + '.png)';
}

function myLoadFunction() {
	player = document.getElementById('player');

	var heads = document.getElementsByClassName('heads')[0].getElementsByTagName('li');
	for (var i = 0; i < heads.length; i++) {
		heads[i].addEventListener('click', setHead);
	}
	
	var bodies = document.getElementsByClassName('bodies')[0].getElementsByTagName('li');
	
	for (var i = 0; i < heads.length; i++) {
		bodies[i].addEventListener('click', setBody);
	}

	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);