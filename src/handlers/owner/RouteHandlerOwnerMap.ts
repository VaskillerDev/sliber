import RouteHandlerMapType from "../RouteHandlerMapType";
import IRouteHandlerMapArgs from "../IRouteHandlerMapArgs";
import BaseRouteHandlerMap from "../BaseRouteHandlerMap";

export type RouteHandlerOwnerType = {
    "/owner/get_token": null;
    "/owner/reset_owner": null
}

const queryStringJsonSchema = {
    type: 'object',
    properties: {
        a: { type: 'integer' },
        b: { type: 'integer' }
    }
}

const schema = {
    querystring: queryStringJsonSchema
}

export default class RouteHandlerOwnerMap 
    extends BaseRouteHandlerMap {
    
    public constructor() {super();}
    
    public create(args: IRouteHandlerMapArgs) 
        : RouteHandlerMapType<RouteHandlerOwnerType, keyof RouteHandlerOwnerType> {
        const {app} = args;
        
        return {
            '/owner/get_token': {
                app,
                route: '/owner/get_token',
                schema,
                method: 'get',
                fn: async (req, res) => {
                    
                    let manager = app.getOwnerManager();
                    let owner = manager.createEmptyOwner();
                    
                    
                    const auth = app.getGoogleAuth();
                    const config = auth.getConfig();
                    
                    const ownerName = req.query as any ['name'] as string;
                    await app.getStorage().push('ownerName', ownerName);
                    
                    
                    res.redirect(config.startRedirectPath);
                }
            },
            '/owner/reset_owner': {
                app,
                route: '/owner/reset_owner',
                method: 'post',
                fn: async (req, res) => {
                    res.code(505).send();
                }
            }
        }
    }

    public setAllHandlers(routeHandlerMap: RouteHandlerMapType<any, string>): void {
        throw new Error("Method not implemented.");
    }
}