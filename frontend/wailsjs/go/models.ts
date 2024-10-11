export namespace hybridencryption {
	
	export class RequestData {
	    data: string;
	    passphrase: string;
	    algorithm: string;
	    algorithmType: string;
	    folderName: string;
	    pubKey: string;
	    privKey: string;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.passphrase = source["passphrase"];
	        this.algorithm = source["algorithm"];
	        this.algorithmType = source["algorithmType"];
	        this.folderName = source["folderName"];
	        this.pubKey = source["pubKey"];
	        this.privKey = source["privKey"];
	    }
	}
	export class ResponseData {
	    SymmetricData: string;
	    EncryptedPassphrase: string;
	    Signature: string;
	
	    static createFrom(source: any = {}) {
	        return new ResponseData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SymmetricData = source["SymmetricData"];
	        this.EncryptedPassphrase = source["EncryptedPassphrase"];
	        this.Signature = source["Signature"];
	    }
	}

}

export namespace keys {
	
	export class HybridRequestData {
	    SymmetricData: string;
	    AlgSymEnc: string;
	    EncyrptedPassphrase: string;
	    Signature: string;
	    FolderName: string;
	
	    static createFrom(source: any = {}) {
	        return new HybridRequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.SymmetricData = source["SymmetricData"];
	        this.AlgSymEnc = source["AlgSymEnc"];
	        this.EncyrptedPassphrase = source["EncyrptedPassphrase"];
	        this.Signature = source["Signature"];
	        this.FolderName = source["FolderName"];
	    }
	}
	export class KeyInfo {
	    name: string;
	    algorithm: string;
	
	    static createFrom(source: any = {}) {
	        return new KeyInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.algorithm = source["algorithm"];
	    }
	}
	export class RequestData {
	    Passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Passphrase = source["Passphrase"];
	    }
	}
	export class ReturnType {
	    PrivKey: string;
	    PubKey: string;
	
	    static createFrom(source: any = {}) {
	        return new ReturnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.PrivKey = source["PrivKey"];
	        this.PubKey = source["PubKey"];
	    }
	}

}

export namespace symmetricdecryption {
	
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

export namespace symmetricencryption {
	
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

