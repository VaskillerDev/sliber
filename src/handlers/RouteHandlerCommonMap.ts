import RouteHandlerMapType from "./RouteHandlerMapType";
import IRouteHandlerMapArgs from "./IRouteHandlerMapArgs";
import BaseRouteHandlerMap from "./BaseRouteHandlerMap";

export type RouteHandlerCommonType = {
    "/": null;
    "/upload": null
}

export default class RouteHandlerCommonMap 
    extends BaseRouteHandlerMap {
    constructor() {super();}

    public create(args: IRouteHandlerMapArgs) 
        : RouteHandlerMapType<RouteHandlerCommonType, keyof RouteHandlerCommonType> {
        const {app} = args;

        return {
            '/': {
                app,
                route: '/',
                method: 'get',
                fn: async (req, res) => {
                    res.send({hello: 'world'})
                }
            },
            '/upload': {
                app,
                route: '/upload',
                method: 'post',
                fn: async (req, res) => {
                    const data = await req.file()
                    res.code(200).send();
                }
            }
        }
    }

    public setAllHandlers(routeHandlerMap: RouteHandlerMapType<any, string>): void {
        throw new Error("Method not implemented.");
    }
}