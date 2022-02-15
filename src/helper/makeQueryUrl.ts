import {URL} from "url";
/**
 * Make url from object
 * 
 * @example
 * const url = makeQueryUrl("http://localhost:5555", pairs: {myquery: 'q', myquery2: 'q2'}); 
 * return url; // 'http://localhost:5555?myquery=q&myquery2=q2'
 * 
 * @param baseUrl
 * @param pairs
 */
export default function makeQueryUrl<QueryParamObject=object>(baseUrl: string, pairs: QueryParamObject) : URL {
    
    const urlSearchParams = new URLSearchParams();
    for (const [key,value] of Object.entries(pairs)) {
        urlSearchParams.set(key,value);
    }
    
    return new URL("?"+urlSearchParams, baseUrl);
}