import { environment } from "../../../environments/environment";
import { HttpParams } from "@angular/common/http";

const OAUTH2 = environment.authorize_uri
const PARAMS: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    response_type: environment.response_type
}

//funcion para obtener el link que lleva a Ethos
export function getOauth2Url(): string {
    const httpParams = new HttpParams({ fromObject: PARAMS });
    const codeUrl = OAUTH2 + httpParams.toString();
    return codeUrl;
}
