import Server, {FastifyInstance} from 'fastify';
import MultipartPlugin from "fastify-multipart";

import App from "./app/App";
import HostConfig from "./configs/HostConfig";
import RouteHandlerMap from "./handlers/RouteHandlerMap";
import GoogleAuth from "./app/oauth2/GoogleAuth";
import JsonLoader from "./util/JsonLoader";

let server : FastifyInstance = Server({logger: true});
server.register(MultipartPlugin);

const credJson = JsonLoader.fromFileSync('./client_secret.json');


const hostCfg = new HostConfig(7070);
const helloWorldHandler = RouteHandlerMap["/"];
const uploadHandler = RouteHandlerMap["/upload"];

const app = new App(server);
app.setHostConfig(hostCfg);
app.setHandler(helloWorldHandler);
app.setGoogleAuth(credJson.web);
app.setHandler(uploadHandler);
app.listen();