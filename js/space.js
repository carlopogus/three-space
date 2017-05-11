(function () {
    // Set up the scene, camera, and renderer as global variables.
  var scene, camera, renderer, image, sphere;
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

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
    camera.position.set(0, 0, 20);
    scene.add(camera);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

    // Set the background color of the scene.
    renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    var bmap =  THREE.ImageUtils.loadTexture("images/earth-bump.jpg", {}, function(){});
    var texture =  THREE.ImageUtils.loadTexture("images/earth.jpg", {}, function(){});

    // var bmap =  THREE.ImageUtils.loadTexture("images/face-bump.jpg", {}, function(){});
    // var texture =  THREE.ImageUtils.loadTexture("images/face.jpg", {}, function(){});

    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: bmap,
      bumpScale: 0.01,
    });
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );


    // create the geometry sphere
    var geometry  = new THREE.SphereGeometry(90, 32, 32)
    // create the material, using a texture of startfield
    var material  = new THREE.MeshBasicMaterial()
    material.map   = THREE.ImageUtils.loadTexture('images/stars.png')
    material.side  = THREE.BackSide
    // create the mesh based on geometry and material
    var mesh  = new THREE.Mesh(geometry, material)
    scene.add( mesh );
    console.log(sphere);


  // Add OrbitControls so that we can pan around with the mouse.
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls = new THREE.FlyControls(camera);
  controls.movementSpeed = 10;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = false;
  controls.dragToLook = false;
  }

  // Renders the scene and updates the render as needed.
  function animate() {

    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);

    // rotate earth
    sphere.rotation.y -= 0.0005;
    sphere.rotation.x -= 0.0005;

    // Rotate Camera
    // camera.position.z = sphere.position.z + 15 * Math.sin( 0.0001 * Date.now() );
    // camera.position.x = sphere.position.x + 20 * Math.cos( 0.0001 * Date.now() );
    // camera.lookAt( sphere.position );

    // Render the scene.
    renderer.render(scene, camera);
    // controls.update();
    var delta = clock.getDelta();
    controls.update(delta);

  }

  init();
  animate();
})();
