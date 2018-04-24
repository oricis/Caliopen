// Copyleft (ɔ) 2018 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package objects

var TlsSuites map[uint16]string
var TlsVersions map[uint16]string

func init() {
	// Taken from crypto/tls/cipher_suites which took it from http://www.iana.org/assignments/tls-parameters/tls-parameters.xml
	// TODO : add more suites
	TlsSuites = map[uint16]string{
		0x0005: "TLS_RSA_WITH_RC4_128_SHA",
		0x000a: "TLS_RSA_WITH_3DES_EDE_CBC_SHA",
		0x002f: "TLS_RSA_WITH_AES_128_CBC_SHA",
		0x0035: "TLS_RSA_WITH_AES_256_CBC_SHA",
		0x003c: "TLS_RSA_WITH_AES_128_CBC_SHA256",
		0x009c: "TLS_RSA_WITH_AES_128_GCM_SHA256",
		0x009d: "TLS_RSA_WITH_AES_256_GCM_SHA384",
		0xc007: "TLS_ECDHE_ECDSA_WITH_RC4_128_SHA",
		0xc009: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA",
		0xc00a: "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA",
		0xc011: "TLS_ECDHE_RSA_WITH_RC4_128_SHA",
		0xc012: "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA",
		0xc013: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
		0xc014: "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
		0xc023: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256",
		0xc027: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
		0xc02f: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
		0xc02b: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
		0xc030: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
		0xc02c: "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
		0xcca8: "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
		0xcca9: "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
		0x5600: "TLS_FALLBACK_SCSV ",
	}

	TlsVersions = map[uint16]string{
		0x002: "ssl2",
		0x300: "ssl3",
		0x301: "tls1.0",
		0x302: "tls1.1",
		0x303: "tls1.2",
		0x304: "tls1.3",
	}
}
