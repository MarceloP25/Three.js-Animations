import * as THREE from 'three';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Objects
const paddleWidth = 10;
const paddleHeight = 40;
const paddleDepth = 10;
const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
const rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);

leftPaddle.position.x = -100;
rightPaddle.position.x = 100;

scene.add(leftPaddle);
scene.add(rightPaddle);

const ballRadius = 5;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Camera
camera.position.z = 100;

// Ball movement
let ballSpeedX = 2; // Initial horizontal speed
let ballSpeedY = 0; // Vertical speed (initially 0)

// Keyboard controls
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Check collision with paddles and window boundaries
function checkCollisions() {
    // Check collision with paddles
    if (
        (ball.position.x + ballRadius > rightPaddle.position.x - paddleWidth / 2 &&
        ball.position.x - ballRadius < rightPaddle.position.x + paddleWidth / 2 &&
        ball.position.y + ballRadius > rightPaddle.position.y - paddleHeight / 2 &&
        ball.position.y - ballRadius < rightPaddle.position.y + paddleHeight / 2) ||

        (ball.position.x - ballRadius < leftPaddle.position.x + paddleWidth / 2 &&
        ball.position.x + ballRadius > leftPaddle.position.x - paddleWidth / 2 &&
        ball.position.y + ballRadius > leftPaddle.position.y - paddleHeight / 2 &&
        ball.position.y - ballRadius < leftPaddle.position.y + paddleHeight / 2)
    ) {
        // Ball hits the paddle, reverse horizontal direction
        ballSpeedX *= -1;
        // Randomize vertical direction
        ballSpeedY = Math.random() > 0.5 ? -2 : 2;
    }

    if (ball.position.x + ballRadius > window.innerWidth / 17 || ball.position.x - ballRadius < -window.innerWidth / 17) {
        // Reverse horizontal direction
        ballSpeedX *= -1;
    }
    if (ball.position.y + ballRadius > window.innerHeight / 12 || ball.position.y - ballRadius < -window.innerHeight / 12) {
        // Reverse vertical direction
        ballSpeedY *= -1;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the ball
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;

    // Check collisions
    checkCollisions();

    // Move paddles based on keyboard input
    const paddleSpeed = 5;
    if (keys['KeyW'] && leftPaddle.position.y < 50) {
        leftPaddle.position.y += paddleSpeed;
    }
    if (keys['KeyS'] && leftPaddle.position.y > -50) {
        leftPaddle.position.y -= paddleSpeed;
    }
    if (keys['ArrowUp'] && rightPaddle.position.y < 50) {
        rightPaddle.position.y += paddleSpeed;
    }
    if (keys['ArrowDown'] && rightPaddle.position.y > -50) {
        rightPaddle.position.y -= paddleSpeed;
    }

    // Render
    renderer.render(scene, camera);
}

animate();
