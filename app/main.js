const net = require("net");
const fs = require("fs");
const path = require("path");

const directoryFlagIndex = process.argv.indexOf("--directory");
const directoryPath = process.argv[directoryFlagIndex + 1];

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const requestLine = request.split("\r\n")[0];
    const [_method, requestedPath] = requestLine.split(" ");
    if (requestedPath.includes("/files")) {
      const fileName = requestedPath.replace("/files/", "");
      const filePath = path.join(directoryPath, fileName);
      if (fs.existsSync(filePath)) {
        const fileSize = fs.statSync(filePath).size;
        const fileContents = fs.readFileSync(filePath);
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileSize}\r\n\r\n${fileContents}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
      return;
    } else if (requestedPath.includes("/user-agent")) {
      const userAgentValue = request.match(/User-Agent:\s*(.+)/i);
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue[1].length}\r\n\r\n${userAgentValue[1]}`
      );
    } else if (requestedPath.includes("/echo/")) {
      const dynamicPart = requestedPath.split("/echo/")[1];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${dynamicPart.length}\r\n\r\n${dynamicPart}`
      );
    } else if (requestedPath === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
