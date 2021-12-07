import IRouteHandlerMap from "./IRouteHandlerMap";

const RouteHandlerMap : IRouteHandlerMap = {
    '/': {
        route: '/',
        method: 'get',
        fn: async (req, res) => {
            res.send({ hello: 'world' })
        }
    }
}



export default RouteHandlerMap