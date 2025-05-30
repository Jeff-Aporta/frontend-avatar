import { io } from "socket.io-client";

function users() {
  const socket = io(window.location.origin);

  function crarUsuario({ name, email, password }) {
    socket.emit("create-user", {
      name,
      email,
      password,
    });
  }
}
