import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'dat.gui';

const gui = new dat.GUI()

let camera, scene, renderer;

let controls;

init();
animate();

function init() {
  const parameters = {
    floorColor: 0xd2d2d2,
    treeColor: 0x21a71c,
    stumpColor: 0x2d2500
  }
  
  gui
    .addColor(parameters, 'floorColor')
    .onChange(() => {
      floorMaterial.color.set(parameters.floorColor)
    })
  
  gui
    .addColor(parameters, 'treeColor')
    .onChange(() => {
      treeMaterial.color.set(parameters.treeColor)
    })

  gui
    .addColor(parameters, 'stumpColor')
    .onChange(() => {
      stumpMaterial.color.set(parameters.stumpColor)
    })

  const container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xd2d2d2 );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
  camera.position.set( 0, 1.6, 3 );

  controls = new OrbitControls( camera, container );
  controls.target.set( 0, 1.6, 0 );
  controls.update();

  const fontLoader = new FontLoader()

  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    // Material
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x147f10,
      roughness: 1.0,
      metalness: 0.0
    })

    // Text
    const textMerryGeometry = new TextGeometry('M e r r y', 
      {
        font: font,
        size: 0.4,
        height: 0.2,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )
    textMerryGeometry.center()
    const textChristmasGeometry = new TextGeometry('C h r i s t m a s !', 
      {
        font: font,
        size: 0.4,
        height: 0.2,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )
    textChristmasGeometry.center()

    const textMerry = new THREE.Mesh(textMerryGeometry, textMaterial)
    textMerry.position.y = 3.25
    textMerry.position.z = -3
    textMerry.rotation.x = .2
    scene.add(textMerry)

    const textChristmas = new THREE.Mesh(textChristmasGeometry, textMaterial)
    textChristmas.position.y = 2.75
    textChristmas.position.z = -3
    textChristmas.rotation.x = .2
    scene.add(textChristmas)
  })

  const treeGeometry = new THREE.ConeGeometry(.5, 2);
  const treeMaterial = new THREE.MeshStandardMaterial( {
    color: parameters.treeColor,
    roughness: 1.0,
    metalness: 0.0
  } );
  const tree = new THREE.Mesh( treeGeometry, treeMaterial );
  tree.position.x = 0;
  tree.position.y = 1.2;
  tree.position.z = -3;
  gui.add(tree.position, 'x').min(-1.75).max(1.75)
  gui.add(tree.position, 'y').min(-1.75).max(1.75)
  gui.add(tree.position, 'z').min(-1.75).max(1.75)
  scene.add( tree );

  const stumpGeometry = new THREE.CylinderGeometry(.1, .1, .2);
  const stumpMaterial = new THREE.MeshStandardMaterial( {
    color: parameters.stumpColor,
    roughness: 1.0,
    metalness: 0.0
  } );
  const stump = new THREE.Mesh( stumpGeometry, stumpMaterial );
  stump.position.x = 0;
  stump.position.y = .1;
  stump.position.z = -3;
  gui.add(stump.position, 'x').min(-1.75).max(1.75)
  gui.add(stump.position, 'y').min(-1.75).max(1.75)
  gui.add(stump.position, 'z').min(-1.75).max(1.75)
  scene.add( stump );

  const floorGometry = new THREE.PlaneGeometry( 6, 4 );
  const floorMaterial = new THREE.MeshStandardMaterial( {
    color: parameters.floorColor,
    roughness: 1.0,
    metalness: 0.0
  } );
  const floor = new THREE.Mesh( floorGometry, floorMaterial );
  floor.rotation.x = - Math.PI / 2;
  floor.position.z = -3;
  floor.material.side = THREE.DoubleSide;
  scene.add( floor );

  scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );

  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 0, 4, 0 );
  scene.add( light );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  container.appendChild( renderer.domElement );

  document.body.appendChild( VRButton.createButton( renderer ) );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  renderer.setAnimationLoop( render );
}

function render() {
  renderer.render( scene, camera );
}
