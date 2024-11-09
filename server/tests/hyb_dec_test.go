package tests

import (
	hybdec "MindLockr/server/cryptography/decryption/hyb_dec"
	"fmt"
	"testing"
)

const privKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xYIGZyftsBsAAAAgIkL5/cApzl+81xta1a9bpYzX3VMhN4r5fe/QPY+mVrv9JgcC
FATjcl8RZRsFFvrWrs5bR9yiAwQQt1+/Y64CVcQnYaEl3zBo5f2jeOyWhBDw8XZi
BuncZqYmgS86AHvFAqpqKO+Cu0ARL7CQRo9xSQVuNyEGewa6wrAGHxsKAAAAQQWC
ZyftsAMLCQcDFQoIAxYAAgKbAwIeCSKhBlT0J2y3gfmsgUbByrJXcJwihdX5WUhM
nqbaOjst1wnYBScJAgcCAAAAAKeMIGD4fbl7cQer9lD0YUFcZToFRjiWSnkB2knf
N45C2xEXGCu9a+Fe2MljWI/jwoCtuRnIK9PXdX09rBGKaKXH7xIUen3bzwoyiFCd
SoQe4mbVXkbI50E6cskXYqVqUQbUB80LcmFuZCA8cmFuZD7CmwYTGwoAAAAsBYJn
J+2wAhkBIqEGVPQnbLeB+ayBRsHKsldwnCKF1flZSEyepto6Oy3XCdgAAAAA8t0g
bJ1QZ5g14gqW/WuyhDCs6A5qD3d6d/+ri4AN1aE0nG4s/lCvP7qTiUt4n71Yg/ur
B3Ikd/g/jNGPyFT6uRCr7lUDeNr5bsip1R4g+RgoVHDvOYrDugifSTWqoRktXNkB
x4IGZyftsBkAAAAgIB/er4qdjRy9ot0oxOx2GvYM9wa++KtwQ47V7aOsQ0H9JgcC
FATjcl8RZRsFFvrWrs5bR9yiAwQQr0pKtktSwr0zID3DBs346K2V+t98/4SJhKH0
7o1K67h0JcslMyuFmeNe7iMmbZQVVcEIcPG6y4iw6d6i7+I1wpsGGBsKAAAALAWC
ZyftsAKbDCKhBlT0J2y3gfmsgUbByrJXcJwihdX5WUhMnqbaOjst1wnYAAAAAAiV
ILizm+UT40D8koK7hZg0PAVileKCZneJSIpYPuwPOY+NtI33hPIVuqAIol37CWCv
WocoUHQXxzsJs07bQRXCt6gnVeY7LkAVUcsGMwqk43QRKcYDESkQrUprd0I/GJW0
BA==
-----END PGP PRIVATE KEY BLOCK-----`

const pubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xioGZyftsBsAAAAgIkL5/cApzl+81xta1a9bpYzX3VMhN4r5fe/QPY+mVrvCsAYf
GwoAAABBBYJnJ+2wAwsJBwMVCggDFgACApsDAh4JIqEGVPQnbLeB+ayBRsHKsldw
nCKF1flZSEyepto6Oy3XCdgFJwkCBwIAAAAAp4wgYPh9uXtxB6v2UPRhQVxlOgVG
OJZKeQHaSd83jkLbERcYK71r4V7YyWNYj+PCgK25Gcgr09d1fT2sEYpopcfvEhR6
fdvPCjKIUJ1KhB7iZtVeRsjnQTpyyRdipWpRBtQHzQtyYW5kIDxyYW5kPsKbBhMb
CgAAACwFgmcn7bACGQEioQZU9Cdst4H5rIFGwcqyV3CcIoXV+VlITJ6m2jo7LdcJ
2AAAAADy3SBsnVBnmDXiCpb9a7KEMKzoDmoPd3p3/6uLgA3VoTScbiz+UK8/upOJ
S3ifvViD+6sHciR3+D+M0Y/IVPq5EKvuVQN42vluyKnVHiD5GChUcO85isO6CJ9J
NaqhGS1c2QHOKgZnJ+2wGQAAACAgH96vip2NHL2i3SjE7HYa9gz3Br74q3BDjtXt
o6xDQcKbBhgbCgAAACwFgmcn7bACmwwioQZU9Cdst4H5rIFGwcqyV3CcIoXV+VlI
TJ6m2jo7LdcJ2AAAAAAIlSC4s5vlE+NA/JKCu4WYNDwFYpXigmZ3iUiKWD7sDzmP
jbSN94TyFbqgCKJd+wlgr1qHKFB0F8c7CbNO20EVwreoJ1XmOy5AFVHLBjMKpON0
ESnGAxEpEK1Ka3dCPxiVtAQ=
-----END PGP PUBLIC KEY BLOCK-----`

const pgpMessage = `-----BEGIN PGP MESSAGE-----

wVQDiQ4PxJZrJDsZw+ZU+drzAmpFUddPqlLH9DCUWLbkjDTXvlN52TlelBMpCaFW
wQq7E2yUdfyaDr2RzdfBTNZQkNCRml9O9ftHbSg27VLKoUHYzsXDLgQJAwiG0NVP
MSAw1eDYkWG1TfJXaX/g6vHoTHofIo7+lLhXKlTgwy4DyvbQGoXSwIwBBIU5CJ1b
t3BU5tUgIY/0UIxKGVpbAoN2cVMppOuE1pBcL/EPoxiztIX3lbj6gXhnc1buXNX/
bvIf6uQhmt8qg39hwrDCk6ekt0ekj+W5oPmJBENU4XFqnafUKLgdaSkE6W/U4pJB
X0IIBDIpvWUm10rxeB8SuLoMxEQwx7JsZVVQ8Pet0U0DgxXzXoNxm2owwzqewNo6
w+CFqpX4rvDW5xPk1Vz7d994yoS839HH3E+qTrUsxsQmvK8MWKt0+pZNsOUbDQ9K
skNc1lAhPNKQpwn+xLZ6rZwmVqJI7S3rBWEBXsBR/Yqwosk11xlGBeaDfjxqldzM
H7Zh521cS0RhbZnsoqNhViUO7bppBkp+rrRO8t9Rc1ioTQjkn+iqvCkmQ90M6jjM
x/n83e/opwaskIdBPQ51YgPma0/z7C9PAAfiehoB4A21f0955g==
=Ask2
-----END PGP MESSAGE-----`

func createRequest(pubKey, privKey, message string) hybdec.RequestData {
	return hybdec.RequestData{
		PubKey:            pubKey,
		PrivKey:           privKey,
		PrivKeyPassphrase: "passphrase",
		PgpMessage:        message,
	}
}

func TestDecryptAndValidate(t *testing.T) {
	hyb_dec := &hybdec.HybDec{}
	req := createRequest(pubKey, privKey, pgpMessage)

	result, err := hyb_dec.DecryptAndValidate(req)
	if err != nil {
		t.Fatalf("DecryptAndValidate failed: %v", err)
	}

	fmt.Println("result: ", result)
}
