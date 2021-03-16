import * as THREE from '../threejs-dev/build/three.module.js';
import { OrbitControls } from '../threejs-dev/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../threejs-dev/examples/jsm/libs/dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 45);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  //scene.background = new THREE.Color('black');

  { // floor
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI/2;
    mesh.position.set(0,0,0);
    scene.add(mesh);
  }
  { //Right wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight);
    const planeMat = new THREE.MeshPhongMaterial( {color: 0x008000, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.y = Math.PI/2;
    mesh.position.set(10,wallHeight/2,0);
    scene.add(mesh);
  }
  { //Left wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshPhongMaterial( {color: 0xff4500, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.y = Math.PI/2;
    mesh.position.set(-10,wallHeight/2,0);
    scene.add(mesh);
  }
  { //Back wall
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    //mesh.rotation.y = Math.PI/2;
    mesh.position.set(0,wallHeight/2,-10);
    scene.add(mesh);
  }
  { // ceiling
    const wallWidth = 20;
    const wallHeight = 20;
    const planeGeo = new THREE.PlaneGeometry(wallWidth, wallHeight, 32);
    const planeMat = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI/2;
    mesh.position.set(0,wallHeight,0);
    scene.add(mesh);
  }
  { //sphere
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: '#CA8',
        opacity: 1,
        transparent: true,
    });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(0, sphereRadius, sphereRadius);
    scene.add(mesh);
    const gui = new GUI();
    gui.add(sphereMat, 'opacity', 0, 1, 0.1);
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
    });
    const mesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    mesh.position.set(cylinderRadiusTop, cylinderRadiusTop + 2, -cylinderRadiusTop*2);
    scene.add(mesh);
    const gui = new GUI();
    gui.add(cylinderMat, 'opacity', 0, 1, 0.1);
    gui.add(cylinderMat, 'shininess', 0, 100, 1);
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
          shininess: 50,
      });
      const mesh = new THREE.Mesh(coneGeo,coneMat);
      mesh.position.set(-coneRadius-1,coneRadius + 2, -coneRadius*2);
      scene.add(mesh);
      const gui = new GUI();
      gui.add(coneMat, 'opacity', 0, 1, 0.1);
      //gui.add(coneMat, 'shininess', 0, 1, 0.1);
  }

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

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  { //Hemishpere lisht
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    gui.add(light, 'intensity', 0, 2, 0.01);
  }
  
  { //directional light
    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }
    {
        const color = 0xFFFFFF;
        const intensity = 0;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 20, 0);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    
        //const helper = new THREE.DirectionalLightHelper(light);
        //scene.add(helper);
    
        function updateLight() {
          light.target.updateMatrixWorld();
          //helper.update();
        }
        updateLight();
    
        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        gui.add(light, 'intensity', 0, 2, 0.01);
    
        //makeXYZGUI(gui, light.position, 'position', updateLight);
        makeXYZGUI(gui, light.target.position, 'target', updateLight);
      }
  }

  {// point light
    const color = 0xFFFFFF;
    const intensity = 0;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 20, 0);
    scene.add(light);

    //const helper = new THREE.PointLightHelper(light);
    //scene.add(helper);

    function updateLight() {
      //helper.update();
    }

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    //gui.add(light, 'distance', 0, 40).onChange(updateLight);
  }

  { //spot light
    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 20).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }
    
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(0, 20, 0);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);

    //const helper = new THREE.SpotLightHelper(light);
    //scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      //helper.update();
    }
    updateLight();

    const gui = new GUI();
    //gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    //gui.add(light, 'distance', 0, 40).onChange(updateLight);
    //gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
    gui.add(light, 'penumbra', 0, 1, 0.01);

    //makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
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