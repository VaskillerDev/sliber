import Server from 'fastify';
import HostConfig from "./configs/HostConfig";
import RouteHandlerMap from "./handlers/RouteHandlerMap";
import App from "./app/App";
const server = Server({logger: true});

const hostCfg = new HostConfig(7070);
const helloWorldHandler = RouteHandlerMap["/"];

const app = new App(server);
app.setHostConfig(hostCfg);
app.setHandler(helloWorldHandler);
app.listen();