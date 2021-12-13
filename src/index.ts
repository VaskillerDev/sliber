import Server, {FastifyInstance} from 'fastify';
import MultipartPlugin from "fastify-multipart";

import App from "./app/App";
import RouteHandlerMap from "./handlers/RouteHandlerMap";
import ConfigLoader from "./util/ConfigLoader";
import RouteHandlerOwnerMap from "./handlers/owner/RouteHandlerOwnerMap";
import injectRouteHandlerMap from "./util/injectRouteHandlerMap";

let server : FastifyInstance = Server({logger: true});
server.register(MultipartPlugin);

const configLoader = new ConfigLoader();
const appConfig = configLoader.fromFileSync('./config.dev.json');

const app = new App(server);
app.setHostConfig(appConfig);
app.setGoogleAuth(appConfig)

injectRouteHandlerMap(app, RouteHandlerMap);
injectRouteHandlerMap(app, RouteHandlerOwnerMap);

app.listen();
