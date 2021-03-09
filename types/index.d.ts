interface ISwaggerClient {
  execute: (operationId: string | ExecuteOptions, opts?: ExecuteOptions) => void;
  http: Http,
  makeHttp = makeHttp.bind(null, Swagger.http),
  resolve,
  resolveSubtree,
  execute,
  serializeRes,
  serializeHeaders,
  clearCache,
  makeApisTagOperation,
  buildRequest,
  helpers,
  getBaseUrl,
}

interface BearerAuthorization {
  value: string;
}

interface BasicAuthorization {
  username: string;
  password: string;
}

interface ApiKeyAuthorization {
  value: string;
}

interface OAuth2Authorization {
  token: {
    access_token: string;
  };
}

interface Securities {
  BearerAuth?: BearerAuthorization;
  BasicAuth?: BasicAuthorization;
  ApiKey?: ApiKeyAuthorization;
  oAuth2?: OAuth2Authorization;
}

interface ExecuteOptions<T> {
  spec: object; // TODO: how to type this?
  operationId?: string;
  pathName?: string;
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
  parameters: T;
  securities: Securities;
  requestInterceptor: (request: Request) => Request;
  responseInterceptor: (response: Response) => Response;
  requestContentType: string;
  responseContentType: string;
  attachContentTypeForEmptyPayLoad: boolean = false;
  http: Http;
  userFetch: (url: string, request: Request) => Response;
}

function Http()

class SwaggerClient implements ISwaggerClient {
  constructor(url: string | ClientOptions, opts?: ClientOptions);
}

function SwaggerFunction(url: string | ClientOptions, opts?: ClientOptions): Promise<ISwaggerClient>;

export default SwaggerClient;