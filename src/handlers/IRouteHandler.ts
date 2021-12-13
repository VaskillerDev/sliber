import {FastifyReply, FastifyRequest} from "fastify";
import App from "../app/App";

export default interface IRouteHandler<RouteType=string> {
    app?: App,
    route: RouteType,
    fn: (req: FastifyRequest, res: FastifyReply) => void
    method: 'post' | 'get'
}