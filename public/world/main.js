// import * as THREE from 'three';
// import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/OBJLoader.js';
// import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/MTLLoader.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js';
// import { io } from 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.esm.min.js'; // Importe o socket.io
// const socket = io('http://localhost:3000'); // Conectar-se ao servidor do socket

// // Cena, câmera e renderizador
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000); // Maior distância de visão
// const renderer = new THREE.WebGLRenderer();

// renderer.setSize(window.innerWidth, window.innerHeight);
// document.getElementById('threejs-container').appendChild(renderer.domElement);

// // Adicionar controles de câmera para movimentação
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Habilitar suavização do movimento
// controls.dampingFactor = 0.25; // Suavizar movimento
// controls.screenSpacePanning = false; // Desabilitar o pan na tela

// // Definir a posição inicial da câmera
// camera.position.set(0, 50, 200); // Afastar mais para ver a cidade inteira
// scene.add(camera);

// // Adicionar luz direcional forte para iluminar a cidade
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz branca e intensa
// directionalLight.position.set(50, 100, 50); // Posição para iluminar toda a cena
// scene.add(directionalLight);

// // Adicionar luz ambiente suave para preencher sombras
// const ambientLight = new THREE.AmbientLight(0x404040, 1); // Luz suave e ambiente
// scene.add(ambientLight);

// // Adicionar luz pontual para destaque em áreas específicas
// const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Luz vermelha destacando áreas
// pointLight.position.set(0, 20, 0); // Colocando a luz no centro
// scene.add(pointLight);



// // Criar um objeto humano para cada usuário
// let players = {}; // Para armazenar os jogadores

// // Variáveis globais para controle de movimento
// let destination = new THREE.Vector3(); // Posição de destino
// let isMoving = false; // Variável para controle de movimento


// // Quando a conexão for bem-sucedida
// // socket.on('connect', () => {
// //     // console.log('Conectado ao servidor WebSocket');

// //     // Criar avatar para o jogador local
// //     // const localPlayer = socket.id;
// //     // const localPosition = new THREE.Vector3(0, 0, 0);

// //     // const humanSizeCube = new THREE.BoxGeometry(12, 50, 12);  
// //     // const humanMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
// //     // const humanMesh = new THREE.Mesh(humanSizeCube, humanMaterial);
// //     // humanMesh.position.set(localPosition.x, localPosition.y, localPosition.z);
// //     // scene.add(humanMesh);

// //     // Armazenar avatar local
// //     // players[localPlayer] = { mesh: humanMesh, username: "Você" };

// //     // Receber todos os jogadores existentes
// //     // socket.on('all users', (users) => {
// //     //     console.log(users);
// //     //     users.forEach(user => {
// //     //         if (!players[user.id]) { // Evitar duplicação
// //     //             const humanSizeCube = new THREE.BoxGeometry(12, 50, 12);
// //     //             const humanMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
// //     //             const humanMesh = new THREE.Mesh(humanSizeCube, humanMaterial);
// //     //             humanMesh.position.set(user.position.x, user.position.y, user.position.z);
// //     //             scene.add(humanMesh);

// //     //             players[user.id] = { mesh: humanMesh, username: user.username };
// //     //         }
// //     //     });
// //     // });

// //     // Adicionar novo jogador à cena
// //     // socket.on('new user', (data) => {
// //     //     const { id, username, position } = data;

// //     //     if (!players[id]) { // Evitar duplicação
// //     //         const humanSizeCube = new THREE.BoxGeometry(12, 50, 12);
// //     //         const humanMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
// //     //         const humanMesh = new THREE.Mesh(humanSizeCube, humanMaterial);
// //     //         humanMesh.position.set(position.x, position.y, position.z);
// //     //         scene.add(humanMesh);

// //     //         players[id] = { mesh: humanMesh, username };
// //     //     }
// //     // });


// // });


// // Função para mover o personagem baseado em um clique (ou em inputs específicos)
// const moveHumanToClickPosition = (event) => {
//     const mouse = new THREE.Vector2();
//     const raycaster = new THREE.Raycaster();
    
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
//     raycaster.setFromCamera(mouse, camera);
    
//     const intersects = raycaster.intersectObject(groundObject, true);
    
//     if (intersects.length > 0) {
//         const point = intersects[0].point;

//         // Agora, você deve mover o jogador para o destino especificado
//         if (players[socket.id]) {
//             const player = players[socket.id];
//             player.mesh.position.set(point.x, player.mesh.position.y, point.z); // Atualiza a posição do jogador
//             socket.emit('update position', { x: point.x, y: player.mesh.position.y, z: point.z }); // Envia a nova posição ao servidor
//         }

//         destination.set(point.x, 0, point.z); // Define o destino
//         isMoving = true; // Iniciar o movimento
//     }
// };

// // Adicionar o evento de clique do mouse
// window.addEventListener('click', moveHumanToClickPosition);

// // Função para mover o humano gradualmente (como uma caminhada)
// const moveToDestination = () => {
//     if (isMoving) {
//         const speed = 0.00005; // Velocidade de movimento
//         if (players[socket.id]) {
//             const player = players[socket.id];
//             const distance = player.mesh.position.distanceTo(destination);

//             if (distance > 1) { // Move até o destino
//                 player.mesh.position.lerp(destination, speed); // Movimentação suave
//             } else {
//                 isMoving = false; // Chegou no destino
//             }
//         }
//     }
// };

// // Carregar o material MTL
// const mtlLoader = new MTLLoader();
// let groundObject = null; // Guardar o objeto do chão

// mtlLoader.load(
//     '../textures/street.mtl',  // Caminho para o arquivo MTL
//     (materials) => {
//         materials.preload(); // Precarrega os materiais

//         // Carregar o modelo OBJ com os materiais carregados
//         const objLoader = new OBJLoader();
//         objLoader.setMaterials(materials);  // Aplica os materiais ao OBJ
//         objLoader.load(
//             '../textures/Street environment_V01.obj',  // Caminho para o arquivo OBJ
//             (object) => {
//                 object.scale.set(10, 10, 10);  // Aumenta o modelo da cidade para escala adequada
//                 scene.add(object);
//                 groundObject = object; // Guardar o objeto de chão
//                 console.log('Modelo OBJ carregado com sucesso!', object);
//             },
//             (xhr) => {
//                 console.log(`Carregando modelo OBJ: ${(xhr.loaded / xhr.total) * 100}% concluído`);
//             },
//             (error) => {
//                 console.error('Erro ao carregar o modelo OBJ:', error);
//             }
//         );
//     },
//     (error) => {
//         console.error('Erro ao carregar o arquivo MTL:', error);
//     }
// );
// // Função de animação principal
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update(); // Atualiza os controles de câmera
//     moveToDestination(); // Movimenta o jogador local
    
//     // Atualiza a posição dos jogadores remotos
//     Object.values(players).forEach(player => {
//         if (player.mesh && player.mesh !== players[socket.id]?.mesh) {
//             player.mesh.position.lerp(player.position, 0.1); // Suavizar movimento
//         }
//     });

//     renderer.render(scene, camera);
// }
// animate();
// // socket.on('connect', () => {
// //     console.log('Conectado ao servidor WebSocket');
   
// // });

