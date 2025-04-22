const net = require("net");

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const requestLine = request.split("\r\n")[0];
    const [method, path] = requestLine.split(" ");
    const content = path.split("/");
    const dynamicPart = content[content.length - 1];
    socket.write(
      `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${dynamicPart.length}\r\n\r\n${dynamicPart}`
    );
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
