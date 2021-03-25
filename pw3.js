import * as THREE from '../threejs-dev/build/three.module.js';
import { OrbitControls } from '../threejs-dev/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../threejs-dev/examples/jsm/libs/dat.gui.module.js';
//import * as UIL from "./uil-gh-pages/build/uil.js";

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 45);
  //var ui = new UIL.Gui( { w:300 } ).onChange( callback );

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  //scene.background = new THREE.Color('black');

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  { // floor
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.set(0,0,0);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  { //Right wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight);
    const planeMat = new THREE.MeshLambertMaterial( {color: 0x008000, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.y = -Math.PI/2;
    mesh.position.set(10,wallHeight/2,0);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  { //Left wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshLambertMaterial( {color: 0xff4500, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.y = Math.PI/2;
    mesh.position.set(-10,wallHeight/2,0);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  { //Back wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    //mesh.rotation.y = Math.PI/2;
    mesh.position.set(0,wallHeight/2,-10);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  { // ceiling
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.set(0,wallHeight,0);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  { //sphere
    //var el = document.getElementById('.MySphere');
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: '#CA8',
        opacity: 1,
        transparent: true,
        roughness: 1,
        emissive: 0x000000,
    });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(0, sphereRadius, sphereRadius);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    //const gui = new GUI({ css:'position:absolute; top:145px; left:50px;', size:100, center:true });
    const gui = new GUI();
    gui.domElement.id = ("MySphere");
    const gui_sphere = gui.addFolder('sphere');
    gui_sphere.add(sphereMat, 'opacity', 0, 1, 0.1);
    gui_sphere.add(sphereMat, 'roughness', 0, 1, 0.1);
    gui_sphere.addColor(new ColorGUIHelper(sphereMat, 'color'), 'value').name('color');
    gui_sphere.addColor(new ColorGUIHelper(sphereMat, 'emissive'), 'value').name('emissive');
    gui_sphere.open();
    //gui.add(sphereMat, 'shininess', 0, 1, 0.1);
  }
  { //cylinder
    const cylinderRadiusTop = 3;
    const cylinderRadiusBottom = 3;
    const cylinderHeight = 10;
    const cylinderSegment = 32;
    const cylinderGeo = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, cylinderSegment);
    const cylinderMat = new THREE.MeshPhongMaterial({
        color: '#CA8',
        opacity: 1,
        transparent: true,
        shininess: 50,
        specular: 0x666666,
    });
    const mesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    mesh.position.set(cylinderRadiusTop, cylinderRadiusTop + 2.01, -cylinderRadiusTop*2);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    const gui = new GUI();
    gui.domElement.id = ("MyCylinder");
    const gui_cylinder = gui.addFolder('cylinder');
    gui_cylinder.add(cylinderMat, 'opacity', 0, 1, 0.1);
    gui_cylinder.add(cylinderMat, 'shininess', 0, 100, 1);
    gui_cylinder.addColor(new ColorGUIHelper(cylinderMat, 'color'), 'value').name('color');
    gui_cylinder.addColor(new ColorGUIHelper(cylinderMat, 'specular'), 'value').name('specular');
    gui_cylinder.open();
  }
  { //cone
      const coneRadius = 3;
      const coneHeight = 10;
      const coneSegment = 32;
      const coneGeo = new THREE.ConeGeometry(coneRadius,coneHeight,coneSegment);
      const coneMat = new THREE.MeshLambertMaterial({
          color: '#8AC',
          opacity: 1,
          transparent: true,
          emissive: 0x000000,
      });
      const mesh = new THREE.Mesh(coneGeo,coneMat);
      mesh.position.set(-coneRadius-1,coneRadius + 2.01, -coneRadius*2);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      const gui = new GUI();
      gui.domElement.id = ("MyCone");
      const gui_cone = gui.addFolder('cone');
      gui_cone.add(coneMat, 'opacity', 0, 1, 0.1);
      gui_cone.addColor(new ColorGUIHelper(coneMat, 'emissive'), 'value').name('emissive');
      gui_cone.addColor(new ColorGUIHelper(coneMat, 'color'), 'value').name('color');
      gui_cone.open();
      
      //gui.add(coneMat, 'shininess', 0, 1, 0.1);
  }


  var light_gui;
  var guis;

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    light_gui = new THREE.AmbientLight(color, intensity);
    scene.add(light_gui);
    guis = new GUI();
    guis.domElement.id = ("Light");
    var gui = guis.addFolder('ambient light');
    gui.addColor(new ColorGUIHelper(light_gui, 'color'), 'value').name('color');
    gui.add(light_gui, 'intensity', 0, 2, 0.01);
    gui.open();
  }

  var lights = function(v) {
    guis.destroy();
    scene.remove(light_gui);

    function makeXYZGUI(gui, vector3, name, onChangeFn) {
      const folder = gui.addFolder(name);
      folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
      folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
      folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
      folder.open();
    }
    function updateLight() {
      light_gui.target.updateMatrixWorld();
    }

    const color = 0xFFFFFF;
    const intensity = 1;
    guis = new GUI();
    guis.domElement.id = ("Light");
    switch (v){
      case "directional":
        light_gui = new THREE.DirectionalLight(color, intensity);
        light_gui.position.set(0, 20, 0);
        light_gui.castShadow = true;
        scene.add(light_gui);
        scene.add(light_gui.target);

        updateLight();
        
        //var gui = new GUI();
        gui = guis.addFolder('directional');
        gui.addColor(new ColorGUIHelper(light_gui, 'color'), 'value').name('color');
        gui.add(light_gui, 'intensity', 0, 2, 0.01);
        makeXYZGUI(gui, light_gui.target.position, 'target', updateLight);
        gui.open();

        break;

      case "spot":
        light_gui = new THREE.SpotLight(color, intensity);
        light_gui.position.set(0, 20, 0);
        light_gui.target.position.set(0, 0, 0);
        light_gui.castShadow = true;
        scene.add(light_gui);
        scene.add(light_gui.target);
    
        updateLight();
        //var gui = new GUI();
        gui = guis.addFolder('spot');
        gui.add(light_gui, 'intensity', 0, 2, 0.01);
        gui.add(light_gui, 'penumbra', 0, 1, 0.01);
        makeXYZGUI(gui, light_gui.target.position, 'target', updateLight);
        gui.open();

        break;

      case "point":
        light_gui = new THREE.PointLight(color, intensity);
        light_gui.position.set(0, 20, 0);
        light_gui.castShadow = true;
        scene.add(light_gui);

        //var gui = new GUI();
        gui = guis.addFolder('point');
        gui.addColor(new ColorGUIHelper(light_gui, 'color'), 'value').name('color');
        gui.add(light_gui, 'intensity', 0, 2, 0.01);
        gui.open();

        break;

      case "hemisphere":
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        light_gui = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light_gui);

        //var gui = new GUI();
        gui = guis.addFolder('hemishpere');
        gui.addColor(new ColorGUIHelper(light_gui, 'color'), 'value').name('skyColor');
        gui.addColor(new ColorGUIHelper(light_gui, 'groundColor'), 'value').name('groundColor');
        gui.add(light_gui, 'intensity', 0, 2, 0.01);
        gui.open();
        break;

      default:
        break
    }
  }

  
  var list = ['directional', 'point', 'spot', 'hemisphere'];
  var ui = new UIL.Gui({ css:'top:10px; left:10px;', size:100});

  //ui.add('list', { target:document.body, list:list, name:'list', pos:{ left:'10px', top:'500px' }, simple:true }).onChange( lights );
  ui.add('list', { list:list, name:'list' }).onChange( lights );

  {//rect area light
    const width = 20;
    const height = 20;
    const intensity = 1;
    const light = new THREE.RectAreaLight( 0xff4500, intensity,  width, height );
    light.position.set( -9, 10, 0 );
    light.rotation.y = -Math.PI/2;
    //light.target.position.set( 0, 0, 0);
    light.lookAt( 0, 0, 0 );
    //light.rotation.y = Math.PI/2;
    scene.add( light );
    //scene.add( target)
    //const gui = new GUI();
    //gui.add(light, 'intensity', 0, 3, 0.01);
  }

  {//rect area light
    const width = 20;
    const height = 20;
    const intensity = 1;
    const light = new THREE.RectAreaLight( 0x008000, intensity,  width, height );
    light.position.set( 10, 10, 0 );
    light.rotation.y = Math.PI/2;
    //light.target.position.set( 0, 0, 0);
    light.lookAt( 0, 0, 0 );
    //light.rotation.y = Math.PI/2;
    scene.add( light );
    //scene.add( target)    
    //const gui = new GUI();
    //gui.add(light, 'intensity', 0, 3, 0.01);
  }



  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();