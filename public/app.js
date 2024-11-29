import * as THREE from 'three';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js';

const socket = io('http://localhost:3000');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

camera.position.set(0, 50, 200);
scene.add(camera);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

const mtlLoader = new MTLLoader();
let groundObject = null;

mtlLoader.load('../textures/street.mtl', (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('../textures/Street environment_V01.obj', (object) => {
        object.scale.set(10, 10, 10);
        scene.add(object);
        groundObject = object;
    });
});

let players = {};

socket.on('connect', () => {
    console.log('Conectado ao servidor com ID:', socket.id);

    const username = prompt("Digite seu nome de usuário:");
    socket.emit('join', username);

    // Emite a posição inicial para o servidor
    players[socket.id] = {
        id: socket.id,
        username: username,
        position: { x: 0, y: 0, z: 0 }
    };

    createPlayerMesh(players[socket.id]);

    // Atualiza a lista de jogadores
    socket.on('users', (users) => {
        const userList = document.getElementById('users');
        userList.innerHTML = '';
        users.forEach((user) => {
            const li = document.createElement('li');
            li.innerText = user;
            userList.appendChild(li);
        });
    });

    socket.on('add player', (playerData) => {
        if (!players[playerData.id]) {
            createPlayerMesh(playerData);
        }
    });

    socket.on('update position', (data) => {
        const { id, position } = data;
        if (players[id]) {
            players[id].mesh.position.set(position.x, position.y, position.z);
        }
    });

    socket.on('add player', (playerData) => {
        const { id, username, position } = playerData;
    
        // Crie um novo personagem para o jogador
        const geometry = new THREE.BoxGeometry(10, 10, 10);  // Exemplo de personagem com geometria simples
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);  // Coloca a posição inicial do jogador
    
        // Armazene o jogador no objeto 'players' para referência futura
        players[id] = { mesh, username };  // Salvando a malha do jogador no objeto 'players'
    
        // Adiciona o jogador na cena
        scene.add(mesh);
    });

    socket.on('chat message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
        document.getElementById('messages').appendChild(messageElement);
    });

    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const msg = e.target.value;
            socket.emit('chat message', msg);
            e.target.value = '';
        }
    });

    animate();
});

function createPlayerMesh(playerData) {
    const { id, username, position } = playerData;

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);

    players[id] = { mesh, username };
}

const moveHumanToClickPosition = (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(groundObject, true);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        if (players[socket.id]) {
            const player = players[socket.id];
            player.mesh.position.set(point.x, player.mesh.position.y, point.z);
            socket.emit('update position', { x: point.x, y: player.mesh.position.y, z: point.z });
        }
    }
};

window.addEventListener('click', moveHumanToClickPosition);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
