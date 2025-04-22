const net = require("net");

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const requestLine = request.split("\r\n")[0];
    const [_method, path] = requestLine.split(" ");
    if (path === "/") socket.write("HTTP/1.1 200 OK\r\n\r\n");
    else if (path.includes("/echo/")) {
      const dynamicPart = path.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${dynamicPart.length}\r\n\r\n${dynamicPart}`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
