import IRouteHandlerMap from "./IRouteHandlerMap";

const RouteHandlerMap : IRouteHandlerMap = {
    '/': {
        route: '/',
        method: 'get',
        fn: async (req, res) => {
            res.send({ hello: 'world' })
        }
    },
    '/upload': {
        route: '/upload',
        method: 'post',
        fn: async (req, res) => {
            const data = await req.file()
            res.code(200).send();
        }
    }
}



export default RouteHandlerMap