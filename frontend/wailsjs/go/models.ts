export namespace cryptography {
	
	export class RequestData {
	    data: string;
	    passphrase: string;
	    algorithm: string;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.passphrase = source["passphrase"];
	        this.algorithm = source["algorithm"];
	    }
	}

}

