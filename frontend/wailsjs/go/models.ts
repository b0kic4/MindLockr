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
	export class HybridRequestData {
	    FileName: string;
	    MsgArmor: string;
	
	    static createFrom(source: any = {}) {
	        return new HybridRequestData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.FileName = source["FileName"];
	        this.MsgArmor = source["MsgArmor"];
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
	    privPassphrase?: string;
	    folderName?: string;
	    pubKey?: string;
	    privKey?: string;
	
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
	        this.pubKey = source["pubKey"];
	        this.privKey = source["privKey"];
	    }
	}

}

export namespace pgpfs {
	
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

