/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiConfig {
    usersApi: string;
    trainingsApi: string;
    competitionsApi: string;
    paymentsApi: string;
    notificationsApi: string;
}

export const apiConfig: ApiConfig = {
    usersApi: "https://localhost:7004",
    trainingsApi: "https://localhost:7003",
    competitionsApi: "https://localhost:7001",
    paymentsApi: "https://localhost:7002",
    notificationsApi: "https://localhost:7005"
  };


  
export class ApiClientBase {
    baseApiUrl: string = 'http://localhost:5075';

    protected async transformOptions(options: RequestInit): Promise<RequestInit> {
        //const user = getUser();
        options.headers = {
            ...options.headers,
            //Authorization: `Bearer ${user?.access_token}`,
            //'Accept-Language': 'hr',
        };
        options.credentials = 'include';
        return Promise.resolve(options);
    }

    protected async transformResult(
        _url: string,
        response: Response,
        processor: (response: Response) => any
    ) {
        return processor(response);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getBaseUrl(_defaultUrl?: string, _baseUrl?: string) {
        return this.baseApiUrl;
    }
}

export class Service1Client extends ApiClientBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super();
        this.http = http ? http : window as any;
        this.baseUrl = this.getBaseUrl("", baseUrl);
    }

    getData(): Promise<any> {
        // eslint-disable-next-line no-debugger
        debugger;
        let url_ = this.baseUrl + "/weatherforecast";
        
        url_ = url_.replace(/[?&]$/, "");

        const options_: any = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetPaginatedTasks(_response));
        });
    }

    protected processGetPaginatedTasks(response: Response): Promise<any> {
        const status = response.status;
        const _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            const resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            //result200 = PaginationResponseOfTaskDto.fromJS(resultData200);
            result200=resultData200;
            return result200;
            });
        }
        return Promise.resolve<any>(null as any);
    }
}