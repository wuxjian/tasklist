export namespace main {
	
	export class Application {
	    id: number;
	    name: string;
	    code: string;
	    status: boolean;
	    applicationPath: string;
	
	    static createFrom(source: any = {}) {
	        return new Application(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.code = source["code"];
	        this.status = source["status"];
	        this.applicationPath = source["applicationPath"];
	    }
	}

}

