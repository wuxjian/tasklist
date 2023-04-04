export namespace main {
	
	export class Application {
	    name: string;
	    code: string;
	    applicationPath: string;
	
	    static createFrom(source: any = {}) {
	        return new Application(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.code = source["code"];
	        this.applicationPath = source["applicationPath"];
	    }
	}

}

