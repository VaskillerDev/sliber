import Server, {FastifyInstance} from 'fastify';
import MultipartPlugin from "fastify-multipart";

import App from "./app/App";
import HostConfig from "./configs/HostConfig";
import RouteHandlerMap from "./handlers/RouteHandlerMap";
import GoogleAuth from "./app/oauth2/GoogleAuth";
import JsonLoader from "./util/JsonLoader";
import ConfigLoader from "./util/ConfigLoader";
import GoogleOAuthConfig from "./configs/GoogleOAuthConfig";

let server : FastifyInstance = Server({logger: true});
server.register(MultipartPlugin);

const configLoader = new ConfigLoader();
const appConfig = configLoader.fromFileSync('./config.dev.json');

const helloWorldHandler = RouteHandlerMap["/"];
const uploadHandler = RouteHandlerMap["/upload"];

const app = new App(server);
app.setHostConfig(appConfig);
app.setGoogleAuth(appConfig)
app.setHandler(helloWorldHandler);
app.setHandler(uploadHandler);
app.listen();

/*
const hostCfg = new HostConfig(7070);


const app = new App(server);
app.setHostConfig(hostCfg);
app.setHandler(helloWorldHandler);
app.setGoogleAuth(credJson.web);
app.setHandler(uploadHandler);
app.listen();*/
