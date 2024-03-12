import * as THREE from 'three';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthTexture = new THREE.TextureLoader().load('textures/earth_atmos_4096.jpg');
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
const moonTexture = new THREE.TextureLoader().load('textures/moon_1024.jpg');
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moonMesh);

// Orbiting moon around earth
const moonOrbit = new THREE.Object3D();
scene.add(moonOrbit);
moonOrbit.add(moonMesh);

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunTexture = new THREE.TextureLoader().load('textures/texture_sun_prev.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Camera position
camera.position.z = 50;

// Function to generate stars
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const vertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;

        vertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Call the function to create stars
createStars();

// Animation
function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.005; // Rotation of Earth
    
    // Translational movement of moon
    const moonRadius = 10;
    const moonAngle = Date.now() * 0.001; // Adjust speed of orbit here
    const moonX = Math.cos(moonAngle) * moonRadius;
    const moonZ = Math.sin(moonAngle) * moonRadius;
    moonOrbit.position.set(moonX, 0, moonZ);

    // Translational movement of earth
    const earthRadius = 30;
    const earthAngle = Date.now() * 0.0005; // Adjust speed of orbit here
    const earthX = Math.cos(earthAngle) * earthRadius;
    const earthZ = Math.sin(earthAngle) * earthRadius;
    earthMesh.position.set(earthX, 0, earthZ);

    // Translational movement of moon around earth
    const moonOrbitRadius = 8;
    const moonOrbitAngle = Date.now() * 0.002; // Adjust speed of orbit here
    const moonOrbitX = Math.cos(moonOrbitAngle) * moonOrbitRadius + earthX;
    const moonOrbitZ = Math.sin(moonOrbitAngle) * moonOrbitRadius + earthZ;
    moonOrbit.position.set(moonOrbitX, 0, moonOrbitZ);

    renderer.render(scene, camera);
}
animate();
