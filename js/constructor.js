var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;

var objects = [];

var cubeMaterial = [];

var userSetting = {};


init();
render();

function init() {

	// Setting

	(function () {

		var setting = document.getElementById('userSetting'),
			reverseDiv = setting.querySelector('.reverse'),
			sizeDiv = setting.querySelector('.lego'),
			colorDiv = setting.querySelector('.color');


		for (var i = colorDiv.children.length - 1; i >= 0; i--) {
			colorDiv.children[i].style.backgroundColor = colorDiv.children[i].getAttribute('data-color');
		}

		// reverse
		reverseDiv.addEventListener('click', function (e) {

			if (e.target.tagName == 'BUTTON') {
				userSetting.reverse == true ? userSetting.reverse = false : userSetting.reverse = true;
			}
		}, false)
		
		// size
		sizeDiv.addEventListener('click', function (e) {
			if (e.target.hasAttribute('data-size')) {
				for (var i = 0; i < sizeDiv.children.length; i++) {
					sizeDiv.children[i].classList.remove('active');
				}

				e.target.classList.add('active');
				userSetting.size = e.target.getAttribute('data-size');

				setSizeCube();
			}
		}, false)
		
		
		// color
		colorDiv.addEventListener('click', function (e) {
			if (e.target.hasAttribute('data-color')) {
				for (var i = 0; i < colorDiv.children.length; i++) {
					colorDiv.children[i].classList.remove('active');
				}

				e.target.classList.add('active');
				userSetting.color = e.target.getAttribute('data-color');

				setTextureCube();
			}
		}, false)
		
	})();	

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<strong>click</strong>: add cube, <strong>shift + click</strong>: remove cube';
	document.body.appendChild( info ); //



	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 900, 800 );
	camera.rotation.y = 200;
	camera.lookAt( new THREE.Vector3() );

	scene = new THREE.Scene();

	// roll-over helpers and cube
	var rollOverGeo;

	var textureCube = new THREE.TextureLoader().load( ('img/lego.png') );
	textureCube.wrapS = THREE.RepeatWrapping;
	textureCube.wrapT = THREE.RepeatWrapping;
	textureCube.repeat.x = 1;
	textureCube.repeat.y = 1;

	function setSizeCube () {
		if (userSetting.size == '1x1') {
			cubeGeo = new THREE.BoxGeometry( 20, 20, 20 );
			rollOverGeo = new THREE.BoxGeometry( 20, 20, 20 );
			textureCube.repeat.x = 1;
		} else if (userSetting.size == '1x2') {
			cubeGeo = new THREE.BoxGeometry( 40, 20, 20 );
			rollOverGeo = new THREE.BoxGeometry( 40, 20, 20 );
			textureCube.repeat.x = 2;
		} else if (userSetting.size == '1x3') {
			cubeGeo = new THREE.BoxGeometry( 60, 20, 20 );
			rollOverGeo = new THREE.BoxGeometry( 60, 20, 20 );
			textureCube.repeat.x = 3;
		} else if (userSetting.size == '1x4') {
			cubeGeo = new THREE.BoxGeometry( 80, 20, 20 );
			rollOverGeo = new THREE.BoxGeometry( 80, 20, 20 );
			textureCube.repeat.x = 4;
		} else if (userSetting.size == '1x5') {
			cubeGeo = new THREE.BoxGeometry( 100, 20, 20 );
			rollOverGeo = new THREE.BoxGeometry( 100, 20, 20 );
			textureCube.repeat.x = 5;
		}
	};

	function setTextureCube () {
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color }) );
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color }) );
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color, map:  textureCube}) ); // top 
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color }) );
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color }) );
		cubeMaterial.push( new THREE.MeshLambertMaterial({ color: userSetting.color }) );
	}
	setTextureCube();
	setSizeCube();

	rollOverMaterial = new THREE.MeshBasicMaterial( { color: userSetting.color, opacity: 0.5, transparent: true } );
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	scene.add( rollOverMesh );

	
	
	cubeGeo = new THREE.BoxGeometry( 100, 20, 20 );

	// grid

	var size = 500, step = 20;

	var geometry = new THREE.Geometry();

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

	}

	var material = new THREE.MeshLambertMaterial();

	var line = new THREE.Mesh( geometry, material );
	scene.add( line );

	//

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
	geometry.rotateX( - Math.PI / 2 );

	var texture =  new THREE.TextureLoader().load( ( 'img/lego.png') );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.x = 50;
	texture.repeat.y = 50;


	plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture } ) );
	scene.add( plane );

	objects.push( plane );


	// Lights

	var ambientLight = new THREE.AmbientLight( 0x606060 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );  // 

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	// help event

	window.addEventListener( 'resize', onWindowResize, false );


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		var intersect = intersects[ 0 ];

		rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
		rollOverMesh.position.divideScalar( 20 ).floor().multiplyScalar( 20 ).addScalar( 10 );

	}

	render();

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		var intersect = intersects[ 0 ];

		// delete cube

		if ( isShiftDown ) {

			if ( intersect.object != plane ) {

				scene.remove( intersect.object );

				objects.splice( objects.indexOf( intersect.object ), 1 );

			}

		// create cube

		} else {

			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			voxel.position.copy( intersect.point ).add( intersect.face.normal );
			voxel.position.divideScalar( 20 ).floor().multiplyScalar( 20 ).addScalar( 10 );
			
			scene.add( voxel );
			objects.push( voxel );	
		}

		render();

	}

}

function onDocumentKeyDown( event ) {

	switch( event.keyCode ) {

		case 16: isShiftDown = true; break;

	}

}

function onDocumentKeyUp( event ) {

	switch ( event.keyCode ) {

		case 16: isShiftDown = false; break;

	}

}

function render() {

	renderer.render( scene, camera );

}