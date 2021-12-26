import {FastifyReply} from "fastify";

export const GetTokenSchema = {
    querystring: {
        type: 'object',
        properties: {
            auth3dParty: {type: 'string'}
        }
    }
}

const auth3dpartySet = new Set([
    'apple',
    'facebook',
    'google',
    'vkontakte',
    'discord'
]);

export function checkGetTokenSchema(res : FastifyReply, query: any) {
    const {auth3dparty} = query;
    
    if (!auth3dparty) {
        res.code(400).send({
            error: 'Validation error. Prop not found: auth3dParty'
        });
        return
    }
    
    if (!auth3dpartySet.has(auth3dparty)) {
        res.code(400).send({
            error: 'Validation error. Unsupported auth3dParty.'
        });
        return
    }
}

function makeValidationException(prop: string) {
    return new Error('Validation error. Prop not found: ' + prop);
}