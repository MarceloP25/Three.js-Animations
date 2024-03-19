import * as THREE from 'three';

// Configurações básicas
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando uma linha de esferas com profundidade
const geometry = new THREE.SphereGeometry(0.11, 32, 32);
const spheres = [];

// Definindo a quantidade de esferas e criando-as
const numSpheres = 60;
const numDepthLines = 40; // Número de linhas de profundidade
const spacing = 0.3; // Espaçamento reduzido
const speedY = 0.001; // Velocidade do movimento vertical
const amplitudeY = 0.3; // Amplitude do movimento vertical
const delayBetweenLines = 500; // Atraso entre as linhas de esferas (em milissegundos)

// Calculando o deslocamento para centralizar as esferas
const offsetX = (numSpheres - 1) * spacing * 0.5;
const offsetY = (numDepthLines - 1) * spacing * 0.5;

for (let k = 0; k < numDepthLines; k++) {
    for (let i = 0; i < numSpheres; i++) {
        const material = new THREE.MeshBasicMaterial(); // Não definindo cor inicialmente
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = (i * spacing) - offsetX; // Ajustando a posição x para formar uma linha
        sphere.position.y = (k * spacing) - offsetY; // Ajustando a posição y para formar uma linha
        sphere.position.z = -k * spacing; // Ajustando a posição z para criar profundidade
        spheres.push({ sphere, offsetY: sphere.position.y }); // Salvando a posição inicial y
        scene.add(sphere);
    }
}

// Configurações da câmera
camera.position.set(0, 8, 3);
camera.lookAt(0, 0, -3);

// Função para animar
function animate() {
    requestAnimationFrame(animate);

    // Calculando o tempo atual
    const time = performance.now();

    // Movendo as esferas verticalmente e alterando as cores
    spheres.forEach((sphereData, index) => {
        const { sphere, offsetY } = sphereData;
        // Calculando a posição vertical baseada no tempo
        const newOffsetY = amplitudeY * Math.sin(speedY * (time - index * delayBetweenLines));
        sphere.position.y = newOffsetY;

        // Alterando a cor com base na posição vertical
        if (newOffsetY > 0) {
            sphere.material.color.setStyle('#AEB9F2');
        } else if (newOffsetY < 0) {
            sphere.material.color.setStyle('#5864A6'); 
        }
    });

    renderer.render(scene, camera);
}

// Iniciando a animação
animate();