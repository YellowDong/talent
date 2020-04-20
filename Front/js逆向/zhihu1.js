var n = Date.now()
    , a = new L.a("SHA-1","TEXT");
return a.setHMACKey("d1b964811afb40118a12068ff74a12f4", "TEXT"),
    a.update(e),
    a.update(H),
    a.update("com.zhihu.web"),
    a.update(String(n)),

var getHMAC = function(t, n) {
    var a, i, m, A;
    if (!1 === E)
        throw Error("Cannot call getHMAC without first setting HMAC key");
    switch (m = f(n),
        t) {
        case "HEX":
            a = function(e) {
                return d(e, o, m)
            }
            ;
            break;
        case "B64":
            a = function(e) {
                return h(e, o, m)
            }
            ;
            break;
        case "BYTES":
            a = function(e) {
                return p(e, o)
            }
            ;
            break;
        case "ARRAYBUFFER":
            try {
                a = new ArrayBuffer(0)
            } catch (e) {
                throw Error("ARRAYBUFFER not supported by this environment")
            }
            a = function(e) {
                return g(e, o)
            }
            ;
            break;
        default:
            throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")
    }
    return i = l(b.slice(), v, C, u(r), o),
        A = c(S, L(e)),
        a(A = l(i, o, s, A, o))
};

getHMAC("HEX")