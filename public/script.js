const socket = io();

    // Nome de usuário simples
    const username = prompt("Enter your username:");

    socket.emit('join', username);

    // Exibir mensagens no chat
    socket.on('chat message', (data) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
      document.getElementById('messages').appendChild(messageElement);
    });

    // Exibir usuários online
    socket.on('users', (users) => {
      const userList = document.getElementById('users');
      userList.innerHTML = '';
      users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user;
        userList.appendChild(li);
      });
    });

    // Enviar mensagens
    document.getElementById('message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const msg = e.target.value;
        socket.emit('chat message', msg);
        e.target.value = '';
      }
    });

    // THREE.JS - Exemplo simples
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight); // Lado esquerdo
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Criar um cubo simples no Three.js
    createPlayer(scene);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    

    function createPlayer(scene){
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        // animate();
    }