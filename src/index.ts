import Server from 'fastify';
import MultipartPlugin from "fastify-multipart";

import App from "./app/App";
import HostConfig from "./configs/HostConfig";
import RouteHandlerMap from "./handlers/RouteHandlerMap";

const server = Server({logger: true});
server.register(MultipartPlugin);

const hostCfg = new HostConfig(7070);
const helloWorldHandler = RouteHandlerMap["/"];
const uploadHandler = RouteHandlerMap["/upload"];

const app = new App(server);
app.setHostConfig(hostCfg);
app.setHandler(helloWorldHandler);
app.setHandler(uploadHandler);
app.listen();