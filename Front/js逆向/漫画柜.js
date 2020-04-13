var LZString = (function() {
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var baseReverseDic = {};
        function getBaseValue(alphabet, character) {
            if (!baseReverseDic[alphabet]) {
                baseReverseDic[alphabet] = {};
                for (var i = 0; i < alphabet.length; i++) {
                    baseReverseDic[alphabet][alphabet.charAt(i)] = i
                }
            }
            return baseReverseDic[alphabet][character]
        }
        var LZString = {
            decompressFromBase64: function(input) {
                if (input == null)
                    return "";
                if (input == "")
                    return null;
                return LZString._0(input.length, 32, function(index) {
                    return getBaseValue(keyStrBase64, input.charAt(index))
                })
            },
            _0: function(length, resetValue, getNextValue) {
                var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = {
                    val: getNextValue(0),
                    position: resetValue,
                    index: 1
                };
                for (i = 0; i < 3; i += 1) {
                    dictionary[i] = i
                }
                bits = 0;
                maxpower = Math.pow(2, 2);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++)
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1
                }
                switch (next = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1
                        }
                        c = f(bits);
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++)
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1
                        }
                        c = f(bits);
                        break;
                    case 2:
                        return ""
                }
                dictionary[3] = c;
                w = c;
                result.push(c);
                while (true) {
                    if (data.index > length) {
                        return ""
                    }
                    bits = 0;
                    maxpower = Math.pow(2, numBits);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++)
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1
                    }
                    switch (c = bits) {
                        case 0:
                            bits = 0;
                            maxpower = Math.pow(2, 8);
                            power = 1;
                            while (power != maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++)
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1
                            }
                            dictionary[dictSize++] = f(bits);
                            c = dictSize - 1;
                            enlargeIn--;
                            break;
                        case 1:
                            bits = 0;
                            maxpower = Math.pow(2, 16);
                            power = 1;
                            while (power != maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position == 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++)
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1
                            }
                            dictionary[dictSize++] = f(bits);
                            c = dictSize - 1;
                            enlargeIn--;
                            break;
                        case 2:
                            return result.join('')
                    }
                    if (enlargeIn == 0) {
                        enlargeIn = Math.pow(2, numBits);
                        numBits++
                    }
                    if (dictionary[c]) {
                        entry = dictionary[c]
                    } else {
                        if (c === dictSize) {
                            entry = w + w.charAt(0)
                        } else {
                            return null
                        }
                    }
                    result.push(entry);
                    dictionary[dictSize++] = w + entry.charAt(0);
                    enlargeIn--;
                    w = entry;
                    if (enlargeIn == 0) {
                        enlargeIn = Math.pow(2, numBits);
                        numBits++
                    }
                }
            }
        };
        return LZString
    }
)();

String.prototype.splic = function(f) {
    return LZString.decompressFromBase64(this).split(f)
}
;

console.log(function(p, a, c, k, e, d) {
    e = function(c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    }
    ;
    if (!''.replace(/^/, String)) {
        while (c--)
            d[e(c)] = k[c] || e(c);
        k = [function(e) {
            return d[e]
        }
        ];
        e = function() {
            return '\\w+'
        }
        ;
        c = 1;
    }
    ;while (c--)
        if (k[c])
            p = p.replace(new RegExp('\\b' + e(c) + '\\b','g'), k[c]);
    return p;
}('G.x({"w":4,"z":"B","A":"4.2","s":r,"t":"6","v":["u.2.3","I.2.3","H.2.3","J.2.3","L.2.3","K.2.3","D.2.3","C.2.3","E.2.3","10.2.3","11.2.3","12.2.3","13.2.3","14.2.3","15.2.3","16.2.3","17.2.3","18.2.3","19.2.3","F.2.3","7.2.3","e.2.3","c.2.3","d.2.3","f.2.3","b.2.3","8.2.3","a.2.3","9.2.3","n.2.3","m.2.3","o.2.3","q.2.3","p.2.3","l.2.3","h.2.3","g.2.3","i.2.3","k.2.3","j.2.3","M.2.3","1p.2.3","1o.2.3","1n.2.3","1q.2.3","1t.2.3","1s.2.3","1r.2.3","1i.2.3","1h.2.3","1g.2.3","1j.2.3","1m.2.3","1l.2.3","1k.2.3","1y.2.3","1x.2.3","1w.2.3","1v.2.3","1u.2.3","T.2.3","S.2.3","5.2.3"],"U":R,"O":5,"N":"/Q/y/P-W/1d/6/","1c":1,"1f":"","1e":1b,"Y":0,"X":{"1a":"Z"}}).V();', 62, 97, 'D7BWAcHNgdwUwEbmAZgEwEYBsLg+IDTeADBoLvRwmFA7BQJwUAcFWFuaALBWhQKyo0oWKJuyKp6KPigyox6VJxS52knihoBjAJYATYBoB2AQwC2cYCWAAzLQBs4AZ2AJdwLScgARIwBcjIBGMzZ3AtDWBAADlAWDlAeB1AYf1ACnVAIH1ANDlAGVdAZX1AKDlAMLlAAHNALn1AFWzAaOdAELdAQWVAKjlAS21ABW0ywAjNRosmIhoiejQxAGUAWQAJC1wibiJOIhYiPnYZcF8AC2B7A2AATydwB04rI1sHcyxuLBkbAy0HBbg9cAAnOABJc59gBjQ+B1tgO7gANwe9L8tAA1YEAMT6YIAogANADWwIAMjCGA5fkQAApggDiAGloCBCUTgCYdDMULQGJNgA4/D4AK5ONYIAAeLI2oBMMAwRAWAC8TCZgAY4CyfADnLYAPYaOEAfQ04R4Mh4YnY9B43B4fB4nDUwHYnBUBu47BmIho7BYWDEPA1TB4NB4WCAA='['\x73\x70\x6c\x69\x63']('\x7c'), 0, {}));


