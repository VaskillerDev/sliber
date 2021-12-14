import Server, {FastifyInstance} from 'fastify';
import MultipartPlugin from "fastify-multipart";

import App from "./app/App";
import RouteHandlerCommonMap from "./handlers/RouteHandlerCommonMap";
import ConfigLoader from "./util/ConfigLoader";
import RouteHandlerOwnerMap from "./handlers/owner/RouteHandlerOwnerMap";
import IRouteHandlerMapArgs from "./handlers/IRouteHandlerMapArgs";
import setAllHandlers from "./util/setAllHandlers";
import RouteHandlerMapFactory from "./handlers/RouteHandlerMapFactory";

let server : FastifyInstance = Server({logger: true});
server.register(MultipartPlugin);

const configLoader = new ConfigLoader();
const appConfig = configLoader.fromFileSync('./config.dev.json');

const app = App.getInstance(server);
app.setHostConfig(appConfig);
app.setGoogleAuth(appConfig)

const args : IRouteHandlerMapArgs = {
    app
};

const commonMap = RouteHandlerMapFactory.create(new RouteHandlerCommonMap(), args);
const ownerMap = RouteHandlerMapFactory.create(new RouteHandlerOwnerMap(), args);
setAllHandlers(commonMap);
setAllHandlers(ownerMap)

app.listen();
