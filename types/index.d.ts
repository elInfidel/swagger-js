type ClientRequest = Request & RequestExtensions;
type ClientResponse = Response; // Any additional params?

/**
 * Additional values attached to the request object but not part of the official Request API.
 */
interface RequestExtensions {
  /**
   * When provided, the query parameters contained are serialized and appended to Request.url property as query string.
   */
  query: object | null;
  /**
   * Signals when the Request was constructed implicitly by SwaggerClient.
   */
  loadSpec: boolean | undefined;
  /**
   * When set, it intercepts the Request object before the actual HTTP request
   * is made and after the query serialization kicked in. This means that
   * intercepted Request object will never contain query property. All other properties
   * will be present though. Request interceptor can be defined as synchronous (transformer) or
   * asynchronous function (allows other async operations inside).
   */
  requestInterceptor: (request: ClientRequest) => ClientRequest;
  responseInterceptor: (response: ClientResponse) => ClientResponse;
  userFetch: (url: string, request: Request) => Promise<Response>;
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

/**
 * http interfaces
 */

export async function http(
  url: string | ClientRequest,
  request?: ClientRequest
): Promise<ClientResponse>;

/**
 * Execute interfaces
 * TODO: Figure out baseUrl interface, is it just ExecuteOptions?
 */

export function execute<T>(opts: ExecuteOptions<T>);

interface ExecuteOptions<T> {
  /**
   * OpenAPI definition represented as POJO.
   */
  spec?: any; // TODO: how to type this?
  /**
   * Unique string used to identify an operation. If not provided, pathName + method must be used instead.
   */
  operationId?: string;
  /**
   * OpenAPI defines a unique operation as a combination
   * of a path and an HTTP method. If operationId is not
   * provided, this property must be set.
   */
  pathName?: string;
  /**
   * OpenAPI defines a unique operation as a combination
   * of a path and an HTTP method. If operationId is not provided,
   * this property must be set.
   */
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
  /**
   * Parameters object, eg: { q: 'search string' }. Parameters not defined in spec will be ignored.
   */
  parameters?: T;
  /**
   * Maps security schemes to a request. Securities not defined in spec will be ignored.
   */
  securities?: Securities;
  /**
   * Either synchronous or asynchronous function transformer that accepts Request and should return Request.
   */
  requestInterceptor?: (request: Request) => Request;
  /**
   * Either synchronous or asynchronous function transformer that accepts Response and should return Response.
   */
  responseInterceptor?: (response: Response) => Response;
  /**
   * Sets appropriate media type for request body, e.g. application/json.
   * If supplied media type is not defined for the request body, this property is ignored.
   */
  requestContentType?: string;
  /**
   * Expected appropriate media type response, e.g. application/json.
   * Creates an Accept header in Request object.
   */
  responseContentType?: string;
  /**
   * Attaches a Content-Type header to a Request even when no payload was provided for the Request.
   */
  attachContentTypeForEmptyPayLoad?: boolean;
  /**
   * A function with an interface compatible with HTTP Client.
   */
  http?: any; // TODO: How to type this?
  /**
   * Custom asynchronous fetch function that accepts two arguments: the url and the Request object
   * and must return a Response object. More info in HTTP Client documentation.
   */
  userFetch?: (url: string, request: Request) => Response;

  // TODO: How is this used?
  extras: {
    [x: string]: any;
  };
}

interface ResolveOptions {
  fetch?: Http;
  http?: Http;
  mode?: string[];
  allowMetaPatches?: boolean;
  pathDiscriminator?: string[];
  modelPropertyMacro?: (obj: any) => void;
  parameterMacro?: (obj: any) => void;
  requestInterceptor?: (request: Request) => Request;
  responseInterceptor?: (response: Response) => Response;
  skipNormalization?: boolean;
  useCircularStructures?: boolean;
  baseDoc?: string;
}

interface ResolveSubtreeOptions {
  returnEntireTree?: boolean;
  modelPropertyMacro?: (obj: any) => void;
  parameterMacro?: (obj: any) => void;
  requestInterceptor?: (request: Request) => Request;
  responseInterceptor?: (response: Response) => Response;
  useCircularStructures?: boolean;
  baseDoc?: string;
}

/**
 * options used for construction of a swagger client object.
 */
interface ClientOptions {
  /**
   * A URL containing the swagger spec.
   */
  url: string;

  /**
   * Disables the Tags Interface and transformation of all operationIds into callables.
   */
  disableInterfaces?: boolean;

  /**
   *  When set to true, SwaggerClient will use old algorithm for generating unique operationId names
   *  (present in version 2.x). Instead of camel case (getOne) the algorithm use kebab case (get_one).
   */
  v2OperationIdCompatibilityMode?: boolean;

  /**
   * Maps security schemes to a request. Securities not defined in spec will be ignored.
   */
  authorizations: {
    [x: string]: Securities;
  };

  /**
   * Either synchronous or asynchronous function transformer that accepts Request and should return Request.
   */
  requestInterceptor?: (request: Request) => Request;
  /**
   * Either synchronous or asynchronous function transformer that accepts Response and should return Response.
   */
  responseInterceptor?: (response: Response) => Response;
  /**
   * Custom asynchronous fetch function that accepts two arguments:
   * the url and the Request object and must return a Response object.
   */
  userFetch?: any;
}

declare interface SwaggerClient {
  /**
   * TryItOut Executor is an OpenAPI specific HTTP client for OAS operations.
   * It maps an OAS operation and values into an HTTP request.
   */
  execute: <T>(
    operationId: string | ExecuteOptions<T>,
    opts?: ExecuteOptions<T>
  ) => Promise<ClientResponse>;
  /**
   * The HTTP Client exposes a Fetch-like interface.
   * It extends Fetch API to support request and response interceptors and performs response & header serialization.
   */
  http: (url: string | ClientRequest, request?: ClientRequest) => Promise<ClientResponse>;

  /**
   * TODO: How to type this, it's based on spec. Must template somehow.
   */
  apis: any;
}

interface SwaggerClientConstructor {
  new (url: string | ClientOptions, opts?: ClientOptions): SwaggerClient;
  (url: string | ClientOptions, opts?: ClientOptions): SwaggerClient;

  /**
   * TODO: Do I specify the static functions here?
   */

  http: (url: string | ClientRequest, request?: ClientRequest) => Promise<ClientResponse>;

  execute: <T>(opts?: ExecuteOptions<T>) => Promise<ClientResponse>;

  resolve: (opts?: ResolveOptions) => Promise<any>; // TODO: Type response
  resolveSubtree: (obj: any, subTrees: string[], opts?: ResolveSubtreeOptions) => Promise<any>;
  clearCache: () => void;

  applyDefaults: () => void;
}

declare const Client: SwaggerClientConstructor;

export default Client;
