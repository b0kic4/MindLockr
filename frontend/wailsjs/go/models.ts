export namespace en {
	
	export class FileInfo {
	    name: string;
	    type: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.path = source["path"];
	    }
	}
	export class FolderInfo {
	    name: string;
	    path: string;
	    type: string;
	    files: FileInfo[];
	
	    static createFrom(source: any = {}) {
	        return new FolderInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.type = source["type"];
	        this.files = this.convertValues(source["files"], FileInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HybridRequestData {
	    SymmetricData: string;
	    AlgSymEnc: string;
	    EncyrptedPassphrase: string;
	    Signature: string;
	    FolderName: string;
	    AsymAlgType: string;
	
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
	        this.AsymAlgType = source["AsymAlgType"];
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

}

export namespace hybdec {
	
	export class RequestData {
	    data: string;
	    privPassphrase: string;
	    folderName?: string;
	    pubKey: string;
	    privKey: string;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.privPassphrase = source["privPassphrase"];
	        this.folderName = source["folderName"];
	        this.pubKey = source["pubKey"];
	        this.privKey = source["privKey"];
	    }
	}
	export class ReturnType {
	
	
	    static createFrom(source: any = {}) {
	        return new ReturnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

export namespace hybenc {
	
	export class RequestData {
	    data: string;
	    passphrase: string;
	    privPassphrase: string;
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
	        this.privPassphrase = source["privPassphrase"];
	        this.folderName = source["folderName"];
	        this.pubKey = source["pubKey"];
	        this.privKey = source["privKey"];
	    }
	}

}

export namespace pgpgen {
	
	export class RequestData {
	    Email: string;
	    Name: string;
	    EnType: string;
	    Usage: string;
	    Passphrase: string;
	    Curve: string;
	    Bits: number;
	
	    static createFrom(source: any = {}) {
	        return new RequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Email = source["Email"];
	        this.Name = source["Name"];
	        this.EnType = source["EnType"];
	        this.Usage = source["Usage"];
	        this.Passphrase = source["Passphrase"];
	        this.Curve = source["Curve"];
	        this.Bits = source["Bits"];
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

export namespace pgpget {
	
	export class PgpKeyInfo {
	    name: string;
	    publicKey: string;
	    privateKey: string;
	    folderPath: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new PgpKeyInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.publicKey = source["publicKey"];
	        this.privateKey = source["privateKey"];
	        this.folderPath = source["folderPath"];
	        this.type = source["type"];
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

