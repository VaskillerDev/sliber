import {FastifyReply, FastifyRequest} from "fastify";

export default interface IRouteHandler {
    route: string,
    fn: (req: FastifyRequest, res: FastifyReply) => void
    method: 'post' | 'get'
}