// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCxo2cc90se6y0JvpKp05d0pFSJvcOdlAw",
  authDomain: "my-kush-project-76909.firebaseapp.com",
  databaseURL: "https://my-kush-project-76909-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-kush-project-76909",
  storageBucket: "my-kush-project-76909.firebasestorage.app",
  messagingSenderId: "438641754521",
  appId: "1:438641754521:web:9fab4c1652789b67fc5308",
  measurementId: "G-009JR4HVT5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

const loginBox = document.getElementById("login-box");
const signupBox = document.getElementById("signup-box");
const chatContainer = document.getElementById("chat-container");
const authContainer = document.getElementById("auth-container");
const messagesDiv = document.getElementById("messages");

function toggleSignup() {
  loginBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
}

function toggleLogin() {
  signupBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
}

function signup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).set({ name, email });
      alert("Signup successful!");
    })
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      authContainer.classList.add("hidden");
      chatContainer.classList.remove("hidden");
      loadMessages();
    })
    .catch(error => alert(error.message));
}

function logout() {
  auth.signOut().then(() => {
    chatContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
  });
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const msg = input.value;
  const user = auth.currentUser;

  if (msg.trim() !== "") {
    db.ref("messages").push({
      text: msg,
      user: user.email,
      timestamp: Date.now()
    });
    input.value = "";
  }
}

function loadMessages() {
  db.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${msg.user}: ${msg.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}