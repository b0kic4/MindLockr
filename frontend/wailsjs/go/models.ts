export namespace decryption {
	
	export class DataToDecrypt {
	    encryptedData: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new DataToDecrypt(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.encryptedData = source["encryptedData"];
	        this.passphrase = source["passphrase"];
	    }
	}

}

export namespace encryption {
	
	export class RequestData {
	    data: string;
	    passphrase: string;
	    algorithm: string;
	    algorithmType: string;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.passphrase = source["passphrase"];
	        this.algorithm = source["algorithm"];
	        this.algorithmType = source["algorithmType"];
	    }
	}

}

