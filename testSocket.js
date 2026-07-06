const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("✅ Connected");

    socket.emit(
        "joinChat",
        "6a4a3e0aa1e47620ba18ab0f"
    );
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});