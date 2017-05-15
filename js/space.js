var spaceship,camera;
(function () {
    // Set up the scene, camera, and renderer as global variables.
  var scene, renderer, image, earth, space, effect, shiplight;


  var maxTurn = 30
  var pitchUp = 0, pitchDown = 0, yawLeft = 0, yawRight = 0;
  var pitch = 0;
  var yaw = 0;

  var clock = new THREE.Clock();

  // Sets up the scene.
  function init() {

    // Create the scene and set the scene size.
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    // TURN THIS ON FOR VR
    // effect = new THREE.StereoEffect( renderer );
    // effect.setSize( window.innerWidth, window.innerHeight );

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
    camera.position.set(0, 0, 200);
    scene.add(camera);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      effect.setSize( window.innerWidth, window.innerHeight );
    });

    // Set the background color of the scene.
    renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

    light();
    shiplight();
    earth();
    stars();
    spacecraft();
    groundcontrol()

  }

  // Renders the scene and updates the render as needed.
  function animate() {
    requestAnimationFrame(animate);
    // rotate earth
    earth.rotation.y -= 0.0005;
    space.rotation.y -= 0.00005;
    space.rotation.x -= 0.00005;
    spaceshipController();


    shiplight.position.copy(camera.position);
    shiplight.translateY(-2.5);

    // Render the scene.
    renderer.render(scene, camera);
    // TURN THIS ON FOR VR
    // effect.render( scene, camera );

    var delta = clock.getDelta();
    controls.update(delta);
  }

  function groundcontrol() {
    window.addEventListener('keydown', function(event) {
      switch(event.keyCode) {
        case 38: pitchUp = 1; break;
        case 40: pitchDown = 1; break;
        case 37: yawLeft = 1; break;
        case 39: yawRight = 1; break;
      }
    });

    window.addEventListener('keyup', function(event) {
      switch(event.keyCode) {
        case 38: pitchUp = 0; break;
        case 40: pitchDown = 0; break;
        case 37: yawLeft = 0; break;
        case 39: yawRight = 0; break;
      }
    });

    // Add OrbitControls so that we can pan around with the mouse.
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls = new THREE.FlyControls(camera);
    controls.movementSpeed = 10;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;
  }

  function spacecraft() {
    THREEx.SpaceShips.loadSpaceFighter01(function(object3d){
      object3d.position.x = 0;
      object3d.position.y =  0;
      object3d.position.z =  15
      object3d.rotation.y = 0
      rot = object3d.rotation.y;
      spaceship = object3d;
      console.log(spaceship);
      scene.add(object3d);
    });
  }

  function light() {
    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    var object3d  = new THREE.DirectionalLight('white', 0.225)
    object3d.position.set(2.6,1,3)
    object3d.name = 'Back light'
    scene.add(object3d)
  }

  function earth() {
    var bmap =  THREE.ImageUtils.loadTexture("images/earth-bump.jpg", {}, function(){});
    var texture =  THREE.ImageUtils.loadTexture("images/earth.jpg", {}, function(){});
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: bmap,
      bumpScale: 0.01,
    });
    earth = new THREE.Mesh( geometry, material );
    earth.position.set(0, 0, 0);
    scene.add( earth );
  }

  function stars(){
    // create the geometry sphere
    var geometry  = new THREE.SphereGeometry(500, 32, 32)
    // create the material, using a texture of startfield
    var material  = new THREE.MeshBasicMaterial()
    material.map   = THREE.ImageUtils.loadTexture('images/stars.png')
    material.side  = THREE.BackSide
    // create the mesh based on geometry and material
    space  = new THREE.Mesh(geometry, material)
    scene.add( space );
  }

  function shiplight() {
    shiplight = new THREE.PointLight( 0xffffff, 1, 20 );
    shiplight.position.copy(camera.position);
    // light.position.set( 50, 50, 50 );
    scene.add( shiplight );
  }

  function spaceshipController() {
    // spaceship.rotation.y = rot * Math.PI / 180;
    spaceship.position.copy(camera.position);
    spaceship.rotation.copy(camera.rotation);
    spaceship.updateMatrix();
    spaceship.translateZ(-5);
    spaceship.rotateY(170 * Math.PI / 180);

    if (pitchUp && pitch > -maxTurn) pitch--;
    if (pitchDown && pitch < maxTurn) pitch++;
    if (yawRight && yaw < maxTurn) yaw++;
    if (yawLeft && yaw > -maxTurn) yaw--;

    if (!yawLeft && !yawRight) {
      if (yaw > 0) yaw--;
      if (yaw < 0) yaw++;
    }

    if (!pitchUp && !pitchDown) {
      if (pitch > 0) pitch--;
      if (pitch < 0) pitch++;
    }

    spaceship.rotateX(pitch * Math.PI / 180);
    spaceship.rotateZ(yaw * Math.PI / 180);
  }

  init();
  animate();
})();
