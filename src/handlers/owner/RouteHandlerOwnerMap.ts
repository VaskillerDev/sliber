import RouteHandlerMapType from "../RouteHandlerMapType";

type RouteHandlerType = {
    "/owner/get_token": null;
    "/owner/reset_owner": null
}

const RouteHandlerOwnerMap : RouteHandlerMapType<RouteHandlerType, keyof RouteHandlerType> = {
    '/owner/get_token': {
        route: '/owner/get_token',
        method: 'get',
        fn: async (req, res) => {
            res.code(505).send();
        }
    },
    '/owner/reset_owner': {
        route: '/owner/reset_owner',
        method: 'post',
        fn: async (req, res) => {
            res.code(505).send();
        }
    }
}

export default RouteHandlerOwnerMap