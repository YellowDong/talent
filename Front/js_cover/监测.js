var $ = require('./jquery');

var city = "杭州";
var code = "101210101";
//var cityMap = getMap();
$(function () {
    if ($.cookie('dcity') != null) {
        city = $.cookie('dcity');
        code = $.cookie('dcode');
    }
    $('#city').attr('value', city);
    var today = new Date();
    $('#dateSpan').html(today.pattern('yyyy-MM-dd'));
    showGaugeChart("containerAQI", [0]);
    getData();
    $('#citylogo').attr("src", "https://www.zq12369.com/resource/img/cityimage/" + code + ".jpg");
    var citysel = new Vcity.CitySelector({input: 'city'});
});

// change font size
function changeFontSize() {
    var len = countCharacters(city) / 2;
    if (len == 2) {
        $('#citySpan').css("font-size", 42);
    } else if (len == 3) {
        $('#citySpan').css("font-size", 36);
    } else if (len == 4) {
        $('#citySpan').css("font-size", 30);
    }
}

// get data from server
function getData() {
    city = $('#city').val();
    $.cookie('dcity', city, {expires: 30});
    changeFontSize();
    $('#citySpan').html(city);
    initMap(allmap, city);

    var method = 'GETDATA';
    var object = {};
    object['city'] = city;
    si3sW05m7yRUPqL3(method, object, function (obj) {
        // console.log(obj);
        data = obj.data;
        $('#dg').datagrid({
            data: data,
            singleSelect: true,
            loadMsg: "正在载入，请稍后...",
            title: "具体监测点",
            rownumbers: true,
            pagination: false,
            sortName: name,
            remoteSort: false,
            sortOrder: 'asc',
            fit: true,
            columns: [[
                {
                    field: 'pointname',
                    title: '监测点',
                    sortable: true,
                    width: 80,
                    halign: 'center',
                    align: 'left',
                    formatter: formatName
                },
                {field: 'aqi', title: 'AQI', sortable: true, width: 45, align: 'center'},
                {field: 'quality', title: '质量等级', sortable: true, width: 60, align: 'center', styler: cellLevel},
                {field: 'pm2_5', title: 'PM2.5', sortable: true, width: 45, align: 'center'},
                {field: 'pm10', title: 'PM10', sortable: true, width: 45, align: 'center'},
                {field: 'co', title: 'CO', sortable: true, width: 45, align: 'center', formatter: formatValue},
                {field: 'no2', title: 'NO2', sortable: true, width: 45, align: 'center'},
                {field: 'o3', title: 'O3', sortable: true, width: 45, align: 'center'},
                {field: 'so2', title: 'SO2', sortable: true, width: 45, align: 'center'},
                {field: 'primary_pollutant', title: '首要污染物', sortable: true, width: 100, align: 'left'},
                {
                    field: 'time_point',
                    title: '测量时间',
                    sortable: true,
                    width: 120,
                    halign: 'center',
                    align: 'center',
                    hidden: true
                }
            ]],
            onLoadSuccess: function (data) {

            },
            onSelect: function (index, data) {
                var point = new BMap.Point(data.longitude, data.latitude);
                map.centerAndZoom(point, 13);
            }
        });
        var aqi = 0;
        var aqiArray = [];
        var aqilevel;
        var cityid = data.cityinfo.cityid;
        var rank;
        var weather, temp, wd, time;
        $('#citylogo').attr("src", "https://www.zq12369.com/resource/img/cityimage/" + cityid + ".jpg");
        $.cookie('dcode', cityid, {expires: 30});
        if (data.rows.length > 0) {
            clearMap();
            var desp = null;
            var title = null;
            for (i = 0; i < data.rows.length; i++) {
                // var title = data.rows[i].pointname + "(" + data.rows[i].pointlevel + ")\nAQI：" + data.rows[i].aqi + "\n空气质量：" + data.rows[i].quality  + "\n首要污染物：" + data.rows[i].primary_pollutant;
                //showMap(map,data.rows[i].position_name,data.rows[i].position_name,title,desp,city,,true,false);
                var desp =
                    "<table width='100%'><tr><td style='font-size:12px' valign='top'>"
                    + "<table width='100%' class='fitem'>"
                    + "<tr><th width='50px'>AQI:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getAQILevelIndex(data.rows[i].aqi)) + ";color:#fff'>" + data.rows[i].aqi
                    + "</td><th width='50px'>等级:</th><td style='width:70px;text-align:center;'>" + data.rows[i].quality
                    + "</td></tr><tr><th>PM2.5:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getPM25LevelIndex(data.rows[i].pm2_5)) + ";color:#fff'>" + parseInt(data.rows[i].pm2_5)
                    + "</td><th>PM10:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getPM10LevelIndex(data.rows[i].pm10)) + ";color:#fff'>" + parseInt(data.rows[i].pm10)
                    + "</td></tr><tr><th>CO:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getCOLevelIndex(data.rows[i].co)) + ";color:#fff'>" + data.rows[i].co
                    + "</td><th>NO2:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getNO2LevelIndex(data.rows[i].no2)) + ";color:#fff'>" + parseInt(data.rows[i].no2)
                    + "</td></tr><tr><th>SO2:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getSO2LevelIndex(data.rows[i].so2)) + ";color:#fff'>" + parseInt(data.rows[i].so2)
                    + "</td><th>O3:</th><td style='width:70px;text-align:center;background-color:" + getColorByIndex(getO3LevelIndex(data.rows[i].o3)) + ";color:#fff'>" + parseInt(data.rows[i].o3)
                    + "</td></tr><tr><th>首要污染:</th><td colspan='3'>" + data.rows[i].primary_pollutant
                    + "</td></tr><tr><th>站点类型:</th><td colspan='3'>" + data.rows[i].pointlevel
                    + "</td></tr><tr><th>监测时间:</th><td colspan='3'>" + data.rows[i].time
                    + "</td></tr></table>"
                    + "</td>"
                    + "<td valign='top' align='right'><img src='http://www.zq12369.com/resource/img/cityimage/" + cityid + ".jpg' width='70px' height='70px'/><td>"
                    + "</tr></table>";

                var point = new BMap.Point(data.rows[i].longitude, data.rows[i].latitude);
                addPoint(data.rows[i].pointname, point, title, desp, getIcon(data.rows[i].aqi), true, true)
            }
        }
        time = data.aqi.time;
        var hour = (converTimeFormat(time)).getHours();
        var tp = null;
        if (hour < 5) {
            tp = "凌晨" + hour;
        } else if (hour < 8) {
            tp = "早上" + hour;
        } else if (hour < 11) {
            tp = "上午" + hour;
        } else if (hour < 13) {
            tp = "中午" + hour;
        } else if (hour < 18) {
            hour = hour - 12;
            tp = "下午" + hour;
        } else if (hour < 24) {
            hour = hour - 12;
            tp = "晚上" + hour
        }
        $('#timeSpan').html(tp + '时 实时空气质量');
        aqi = parseInt(data.aqi.aqi);
        aqiArray.push(aqi);

        aqilevel = getAQILevel(aqi);
        showGaugeChart("containerAQI", aqiArray);
        rank = data.aqi.rank;
        $('#aqiSpan').html(aqilevel.value);
        $('#tipSpan').html('温馨提示：' + aqilevel.tip);
        $('#rankSpan').html('全国排名：' + rank + "/367");

        weather = data.weather.tq;
        temp = data.weather.temp;
        wd = data.weather.wd;
        $('#tempSpan').html(temp + '℃');
        $('#weaSpan').html(weather + ' ' + wd);
    }, 0.5);
}

function formatName(val, row) {
    var value = val;
    if (row.pointlevel == '省控点') {
        value = "<span title='" + val + "(" + row.pointlevel + ")'>" + val + "(*)</span>";
    } else {
        value = "<span title='" + val + "(" + row.pointlevel + ")'>" + val + "</span>";
    }
    return value;
}

// show gauge chart
function showGaugeChart(container, data) {
    var alfa = 1;
    var innerRadius = '85%';
    var outerRadius = '115%';
    $('#' + container).highcharts({

        chart: {
            type: 'gauge',
            backgroundColor: 'rgba(0,0,0,0)',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: true,
            width: 200,
            height: 200
        },

        title: {
            text: null,
            style: {
                color: '#3E576F',
                fontSize: '26px'
            }
        },

        pane: {
            startAngle: 0,
            endAngle: 270,
            background: null
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 500,
            tickPixelInterval: 50,
            tickWidth: 0,
            tickPosition: 'inside',
            tickLength: 0,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: null
            },
            plotBands: [{ // Light air
                from: 0,
                to: 50,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(0, 254, 3, ' + alfa + ')'
            }, { // Light breeze
                from: 50,
                to: 100,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(254, 245, 0, ' + alfa + ')'
            }, { // Gentle breeze
                from: 100,
                to: 150,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(254, 125, 0, ' + alfa + ')'
            }, { // Moderate breeze
                from: 150,
                to: 200,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(255, 3, 3, ' + alfa + ')'
            }, { // Fresh breeze
                from: 200,
                to: 300,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(188, 3,205 , ' + alfa + ')'
            }, { // Strong breeze
                from: 300,
                to: 500,
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                color: 'rgba(72, 0, 78, ' + alfa + ')'
            }]
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'AQI',
            data: data
        }]
    });

}


eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return c.toString(a)
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    }
    ;
    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('0 1="2";0 3="4";0 5="6";0 7="8";0 9="a";', 11, 11, 'var|dynamicurl|/WZWSREL3pob25nYmVuL3NlYXJjaFpiRGV0YWlsP2lkPTMwMTg1ODQmal9jYXB0Y2hhPWl0eWsmY2FwdGNoYUlkPWMyODgyMjk3NTg2MDQyYWNhNGYxZjBlYzQwNjY4NTQz|wzwsquestion|9El(H]0BSPi(N{b7zo5|wzwsfactor|2376|wzwsmethod|WZWS_METHOD|wzwsparams|WZWS_PARAMS'.split('|'), 0, {}));

var encode_version = 'sojson.v5', jezoh = '__0x3fb5e',
    __0x3fb5e = ['dcK9wotew5nCu2wvw6nCmsOvQcOONsOk', 'K8Kow4fDhzDDqwdh', 'UAATJSU=', 'wr8gw5HCqWw=', 'G8KzKhLDkA==', 'wrLDisOUw4HDiTTCnsKnwqHCg8O2w7XClg==', 'LmrDog4=', 'e8Ora13Dow==', 'wodfacKQw5o=', 'w74Sw5FreA==', 'wr94w6LDhMOgw4E=', 'wpkHw53DgsKKwrHDhcKbQ8Kpwp8=', 'dWPDons=', 'w7kbw7vDgMKb', 'w6DDkFFwwp/Cq3jCjUXDsW8=', 'TBIbBAfDtw==', 'wok5w7/ChDZV', 'wq3CvlzCtw==', 'wrHDsgzClQ==', 'IcORUmfDlcOPDsOSwr06fMKgBMKcTQ==', 'CgjDpSkw', 'w5oWw5vDhMKk', 'CcK4wpLDlEnCjnXClg==', 'w7zDhsKwTMOW', 'w7jDpFXCvcKm', 'wrTDlsOUw6rDtA==', 'w4bDn8KcXsOQVVHDkw==', 'bMOAwr3CsVzDksKTcAc=', 'wodAb8KKw4HCrDBoaA==', 'wrDDlMOUw5LDiQ==', '5Lm26ICj5Yu/6ZmGw5zDgxHCnMOywpZDM8KD', 'VQPChSVsbsOvWMODRMOlwqBAWMKz', 'U8K8TsOnHsKOWMOpb11CwpjDkcOJZTTChAbCixvDtcO0wplFwoZdwrswWcOiwq1sJsOnw50VHhfDgwXDoMKmDBTClsOkJ1RBKkc3YzQYw4zDuEUgY0xEX8KXwrU=', 'wpZYQsKjw7Y=', 'wqLDiMOdw4nDiQ==', 'wpLCqMO8wpPCiQ==', 'w54Aw5bDqsKD', 'K23DsRErcg==', 'eETDt1Nj', 'w7XDhsOhwpfCrg==', 'LBMPdFk=', 'woXDmQ3Cu8Kl', 'eGrDrmxAdA==', 'bcKBwpPDmz3Clw==', 'KmzDghcL', 'w6vDu8K7MQY=', 'wr4+w6fCph0=', 'WsKSWMO7EQ==', 'WMKNwp7Dojg=', 'wosyw6rCnxhP', 'w7LDhcK8FTI=', 'wqDCuVPCoFbCgcOgbm3Dkw==', 'wq4Hw6HCoTDDlg==', 'TgxLwqPDtg==', 'wqXCoVfClmY=', 'wptsw7vDj8OB', 'wqVow4bDt8O5', 'QcOma8O2w4U=', 'D8Ohwo/DvjRK', 'wpZLX8Kyw5o=', 'NcKjDgPDjw==', 'E8K1RcO1w4U1', 'XA8YGy3DrMKqw49/w5A=', 'woctw4bChj0=', 'CMKXw6jDoA7Dmi1Ow4xUGMK4YMKwacO4SMKKc3ldwrQDw4RG'];
(function (_0x5bc68b, _0x259158) {
    var _0x102152 = function (_0x1797a6) {
        while (--_0x1797a6) {
            _0x5bc68b['push'](_0x5bc68b['shift']());
        }
    };
    _0x102152(++_0x259158);
}(__0x3fb5e, 0x123));
var _0x56ae = function (_0xca96c7, _0x241ea9) {
    _0xca96c7 = _0xca96c7 - 0x0;
    var _0x57cca1 = __0x3fb5e[_0xca96c7];
    if (_0x56ae['initialized'] === undefined) {
        (function () {
            var _0x228394 = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
            var _0x356c10 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            _0x228394['atob'] || (_0x228394['atob'] = function (_0x16460d) {
                var _0x4e207e = String(_0x16460d)['replace'](/=+$/, '');
                for (var _0x15f638 = 0x0, _0x2abf93, _0x3df9f8, _0x479e2a = 0x0, _0x411a0f = ''; _0x3df9f8 = _0x4e207e['charAt'](_0x479e2a++); ~_0x3df9f8 && (_0x2abf93 = _0x15f638 % 0x4 ? _0x2abf93 * 0x40 + _0x3df9f8 : _0x3df9f8, _0x15f638++ % 0x4) ? _0x411a0f += String['fromCharCode'](0xff & _0x2abf93 >> (-0x2 * _0x15f638 & 0x6)) : 0x0) {
                    _0x3df9f8 = _0x356c10['indexOf'](_0x3df9f8);
                }
                return _0x411a0f;
            });
        }());
        var _0x172d34 = function (_0xa28d48, _0x346449) {
            var _0x55c23f = [], _0x3809ab = 0x0, _0x5298ee, _0x3c825f = '', _0x8b8e9a = '';
            _0xa28d48 = atob(_0xa28d48);
            for (var _0xee1bef = 0x0, _0x3023b5 = _0xa28d48['length']; _0xee1bef < _0x3023b5; _0xee1bef++) {
                _0x8b8e9a += '%' + ('00' + _0xa28d48['charCodeAt'](_0xee1bef)['toString'](0x10))['slice'](-0x2);
            }
            _0xa28d48 = decodeURIComponent(_0x8b8e9a);
            for (var _0x308939 = 0x0; _0x308939 < 0x100; _0x308939++) {
                _0x55c23f[_0x308939] = _0x308939;
            }
            for (_0x308939 = 0x0; _0x308939 < 0x100; _0x308939++) {
                _0x3809ab = (_0x3809ab + _0x55c23f[_0x308939] + _0x346449['charCodeAt'](_0x308939 % _0x346449['length'])) % 0x100;
                _0x5298ee = _0x55c23f[_0x308939];
                _0x55c23f[_0x308939] = _0x55c23f[_0x3809ab];
                _0x55c23f[_0x3809ab] = _0x5298ee;
            }
            _0x308939 = 0x0;
            _0x3809ab = 0x0;
            for (var _0x66c563 = 0x0; _0x66c563 < _0xa28d48['length']; _0x66c563++) {
                _0x308939 = (_0x308939 + 0x1) % 0x100;
                _0x3809ab = (_0x3809ab + _0x55c23f[_0x308939]) % 0x100;
                _0x5298ee = _0x55c23f[_0x308939];
                _0x55c23f[_0x308939] = _0x55c23f[_0x3809ab];
                _0x55c23f[_0x3809ab] = _0x5298ee;
                _0x3c825f += String['fromCharCode'](_0xa28d48['charCodeAt'](_0x66c563) ^ _0x55c23f[(_0x55c23f[_0x308939] + _0x55c23f[_0x3809ab]) % 0x100]);
            }
            return _0x3c825f;
        };
        _0x56ae['rc4'] = _0x172d34;
        _0x56ae['data'] = {};
        _0x56ae['initialized'] = !![];
    }
    var _0x190c72 = _0x56ae['data'][_0xca96c7];
    if (_0x190c72 === undefined) {
        if (_0x56ae['once'] === undefined) {
            _0x56ae['once'] = !![];
        }
        _0x57cca1 = _0x56ae['rc4'](_0x57cca1, _0x241ea9);
        _0x56ae['data'][_0xca96c7] = _0x57cca1;
    } else {
        _0x57cca1 = _0x190c72;
    }
    return _0x57cca1;
};

function _0x412a72(_0x2a28c0) {
    var _0x4257c9 = {
        'bwGZX': _0x56ae('0x0', 'jo5I'), 'mGirf': function _0x2eb028(_0x5ab0bc, _0x5505f4) {
            return _0x5ab0bc < _0x5505f4;
        }, 'hOkXt': function _0x16449b(_0x22286c, _0x41c8cd) {
            return _0x22286c & _0x41c8cd;
        }, 'RJeYY': function _0x24beb6(_0x59303b, _0x576d3b) {
            return _0x59303b == _0x576d3b;
        }, 'cFxMb': function _0x45b03c(_0xadce3d, _0x5416a9) {
            return _0xadce3d >> _0x5416a9;
        }, 'spzgJ': function _0x3c313d(_0x19fd11, _0xcacabb) {
            return _0x19fd11 << _0xcacabb;
        }, 'VdlKD': function _0x2427d5(_0x23b25b, _0x23b39e) {
            return _0x23b25b & _0x23b39e;
        }, 'VDeWo': function _0x1ef1b0(_0x476993, _0x40dd2a) {
            return _0x476993 == _0x40dd2a;
        }, 'gHLRp': function _0x16afb3(_0x4bdebb, _0x1065a7) {
            return _0x4bdebb >> _0x1065a7;
        }, 'biRta': function _0x301047(_0x2ada60, _0x1c4232) {
            return _0x2ada60 | _0x1c4232;
        }, 'oKMpY': function _0x1d0b02(_0x547e37, _0x500868) {
            return _0x547e37 << _0x500868;
        }, 'HlUXJ': function _0x21902c(_0x16ae1a, _0x466bbf) {
            return _0x16ae1a >> _0x466bbf;
        }, 'vuJTm': function _0x2fea95(_0x34f7b5, _0x59e46f) {
            return _0x34f7b5 << _0x59e46f;
        }, 'lHuwG': function _0x1339d0(_0x3c775a, _0x3450ae) {
            return _0x3c775a >> _0x3450ae;
        }, 'fpeDs': function _0x52b661(_0x318fc3, _0x59aa7b) {
            return _0x318fc3 & _0x59aa7b;
        }, 'HqwlU': function _0x2144ca(_0x4799d4, _0x25b745) {
            return _0x4799d4 | _0x25b745;
        }, 'nPBKx': function _0x42b833(_0xe339b1, _0x5c500c) {
            return _0xe339b1 & _0x5c500c;
        }, 'ZRhVT': function _0xc9529d(_0x5ed560, _0x4383da) {
            return _0x5ed560 & _0x4383da;
        }, 'bdZKt': _0x56ae('0x1', '5jBa')
    };
    var _0x6c47cd = _0x4257c9[_0x56ae('0x2', 'LFWf')][_0x56ae('0x3', 'Q@8l')]('|'), _0x3a5836 = 0x0;
    while (!![]) {
        switch (_0x6c47cd[_0x3a5836++]) {
            case'0':
                _0x27d1f5 = '';
                continue;
            case'1':
                var _0x27d1f5, _0x4262d0, _0xc876d4;
                continue;
            case'2':
                _0x4262d0 = 0x0;
                continue;
            case'3':
                while (_0x4257c9[_0x56ae('0x4', '*h#g')](_0x4262d0, _0xc876d4)) {
                    _0x5526a7 = _0x4257c9[_0x56ae('0x5', 'a6w(')](_0x2a28c0['charCodeAt'](_0x4262d0++), 0xff);
                    if (_0x4257c9['RJeYY'](_0x4262d0, _0xc876d4)) {
                        _0x27d1f5 += _0x2097d8[_0x56ae('0x6', ')Z%%')](_0x4257c9[_0x56ae('0x7', 'iAGA')](_0x5526a7, 0x2));
                        _0x27d1f5 += _0x2097d8['charAt'](_0x4257c9[_0x56ae('0x8', 'IM$w')](_0x4257c9[_0x56ae('0x9', 'Dk(l')](_0x5526a7, 0x3), 0x4));
                        _0x27d1f5 += '==';
                        break;
                    }
                    _0x138cf5 = _0x2a28c0['charCodeAt'](_0x4262d0++);
                    if (_0x4257c9[_0x56ae('0xa', 'HLR(')](_0x4262d0, _0xc876d4)) {
                        _0x27d1f5 += _0x2097d8[_0x56ae('0xb', 'iAGA')](_0x4257c9['gHLRp'](_0x5526a7, 0x2));
                        _0x27d1f5 += _0x2097d8[_0x56ae('0xc', 'j%QO')](_0x4257c9[_0x56ae('0xd', ')Z%%')](_0x4257c9[_0x56ae('0xe', 'L6ge')](_0x4257c9[_0x56ae('0xf', '02EH')](_0x5526a7, 0x3), 0x4), _0x4257c9[_0x56ae('0x10', '5jBa')](_0x4257c9[_0x56ae('0x11', 'j%QO')](_0x138cf5, 0xf0), 0x4)));
                        _0x27d1f5 += _0x2097d8[_0x56ae('0x12', '02EH')](_0x4257c9[_0x56ae('0x13', 'L6ge')](_0x4257c9['VdlKD'](_0x138cf5, 0xf), 0x2));
                        _0x27d1f5 += '=';
                        break;
                    }
                    _0x4093e6 = _0x2a28c0[_0x56ae('0x14', '%FZJ')](_0x4262d0++);
                    _0x27d1f5 += _0x2097d8[_0x56ae('0x15', 'd2rH')](_0x4257c9['lHuwG'](_0x5526a7, 0x2));
                    _0x27d1f5 += _0x2097d8['charAt'](_0x4257c9[_0x56ae('0x16', 'Zp5!')](_0x4257c9['VdlKD'](_0x5526a7, 0x3) << 0x4, _0x4257c9[_0x56ae('0x17', '%FZJ')](_0x138cf5, 0xf0) >> 0x4));
                    _0x27d1f5 += _0x2097d8[_0x56ae('0x12', '02EH')](_0x4257c9[_0x56ae('0x18', '*FHt')](_0x4257c9[_0x56ae('0x19', '*FHt')](_0x4257c9['nPBKx'](_0x138cf5, 0xf), 0x2), _0x4257c9[_0x56ae('0x1a', 'scqQ')](_0x4093e6, 0xc0) >> 0x6));
                    _0x27d1f5 += _0x2097d8[_0x56ae('0x1b', 'eygr')](_0x4257c9['ZRhVT'](_0x4093e6, 0x3f));
                }
                continue;
            case'4':
                return _0x27d1f5;
            case'5':
                _0xc876d4 = _0x2a28c0['length'];
                continue;
            case'6':
                var _0x5526a7, _0x138cf5, _0x4093e6;
                continue;
            case'7':
                var _0x2097d8 = _0x4257c9[_0x56ae('0x1c', 'LFWf')];
                continue;
        }
        break;
    }
}

function _0x344cd4() {
    var _0x53d9fc = {
        'GjCbS': function _0x1a0314(_0x33da81, _0xe25eb5) {
            return _0x33da81 < _0xe25eb5;
        }, 'JBFUL': function _0x1af799(_0x51aa2f, _0x2e4887) {
            return _0x51aa2f + _0x2e4887;
        }
    };
    var _0x3c9135 = 0x0;
    var _0x43beea = 0x0;
    for (_0x43beea = 0x0; _0x53d9fc[_0x56ae('0x1d', 'uGC9')](_0x43beea, wzwsquestion[_0x56ae('0x1e', 'V2r4')]); _0x43beea++) {
        _0x3c9135 += wzwsquestion[_0x56ae('0x1f', '!2cw')](_0x43beea);
    }
    _0x3c9135 *= wzwsfactor;
    _0x3c9135 += 0x1b207;
    return _0x53d9fc[_0x56ae('0x20', 'd2rH')](_0x56ae('0x21', 'Rau%'), _0x3c9135);
}

function _0x2ff265(_0x26b826, _0xea8bd1) {
    var _0x253f74 = {
        'ogjLK': _0x56ae('0x22', 'Qy14'),
        'izgsL': 'post',
        'eMCME': function _0x3b581c(_0xd2391, _0x1a9ef1) {
            return _0xd2391 != _0x1a9ef1;
        },
        'aCWaI': function _0x5c65fc(_0x1402c7, _0x41e446) {
            return _0x1402c7 < _0x41e446;
        },
        'OTFrl': _0x56ae('0x23', 'Rau%')
    };
    var _0x370b5e = _0x253f74[_0x56ae('0x24', '!2cw')][_0x56ae('0x25', 'i[Ts')]('|'), _0x1ba457 = 0x0;
    while (!![]) {
        switch (_0x370b5e[_0x1ba457++]) {
            case'0':
                _0x15a9ed['method'] = _0x253f74[_0x56ae('0x26', 'uGC9')];
                continue;
            case'1':
                return _0x15a9ed;
            case'2':
                var _0x15a9ed = document[_0x56ae('0x27', 'Q@8l')](_0x56ae('0x28', ')Z%%'));
                continue;
            case'3':
                if (_0x253f74[_0x56ae('0x29', 'YXCs')](_0xea8bd1['search']('='), -0x1)) {
                    var _0x573df6 = _0xea8bd1[_0x56ae('0x2a', 'LFWf')]('&');
                    for (var _0x426cb4 = 0x0; _0x253f74[_0x56ae('0x2b', '57vf')](_0x426cb4, _0x573df6[_0x56ae('0x2c', '*FHt')]); _0x426cb4++) {
                        var _0x3ddbc7 = _0x56ae('0x2d', 'V]Be')['split']('|'), _0x1fdb10 = 0x0;
                        while (!![]) {
                            switch (_0x3ddbc7[_0x1fdb10++]) {
                                case'0':
                                    _0x2a293f[_0x56ae('0x2e', 'iAGA')] = _0x422f0a[0x0];
                                    continue;
                                case'1':
                                    var _0x2a293f = document['createElement'](_0x253f74[_0x56ae('0x2f', 'a6w(')]);
                                    continue;
                                case'2':
                                    var _0x422f0a = _0x8ad1c0['split']('=');
                                    continue;
                                case'3':
                                    var _0x8ad1c0 = _0x573df6[_0x426cb4];
                                    continue;
                                case'4':
                                    _0x15a9ed[_0x56ae('0x30', 'WuNj')](_0x2a293f);
                                    continue;
                                case'5':
                                    _0x2a293f['value'] = _0x422f0a[0x1];
                                    continue;
                            }
                            break;
                        }
                    }
                }
                continue;
            case'4':
                _0x15a9ed[_0x56ae('0x31', '!2cw')]();
                continue;
            case'5':
                _0x15a9ed[_0x56ae('0x32', '02EH')] = _0x26b826;
                continue;
            case'6':
                _0x15a9ed['style']['display'] = _0x56ae('0x33', '%FZJ');
                continue;
            case'7':
                document[_0x56ae('0x34', 'HLR(')]['appendChild'](_0x15a9ed);
                continue;
        }
        break;
    }
}

function _0x33f22a() {
    var _0x532424 = {
        'hwQpj': function _0x3b4af9(_0x2ff2ab) {
            return _0x2ff2ab();
        }, 'lYfvS': function _0x242f23(_0x57f673, _0x33b4b3) {
            return _0x57f673(_0x33b4b3);
        }, 'VvOsr': function _0x33a26c(_0xb8a476, _0x580dd6) {
            return _0xb8a476 + _0x580dd6;
        }, 'vOmWg': _0x56ae('0x35', 'YXCs'), 'LaaBO': function _0x1b637c(_0x5c57e1, _0x41b90a) {
            return _0x5c57e1 == _0x41b90a;
        }, 'eneJI': 'post'
    };
    var _0xb14971 = _0x532424[_0x56ae('0x36', 'jo5I')](_0x344cd4);
    var _0x10ace8 = _0x532424[_0x56ae('0x37', 'a6w(')](_0x412a72, _0xb14971[_0x56ae('0x38', '*8t[')]());
    var _0x35ace3 = _0x532424[_0x56ae('0x39', ')9A&')](dynamicurl, _0x532424[_0x56ae('0x3a', 'N&Yh')]) + _0x10ace8;
    if (_0x532424['LaaBO'](wzwsmethod, _0x532424[_0x56ae('0x3b', 'Q@8l')])) {
        _0x2ff265(_0x35ace3, wzwsparams);
    } else {
        window[_0x56ae('0x3c', ')9A&')] = _0x35ace3;
    }
}

_0x33f22a();
;
if (!(typeof encode_version !== _0x56ae('0x3d', 'QE(m') && encode_version === _0x56ae('0x3e', 'LFWf'))) {
    window[_0x56ae('0x3f', 'Q@8l')](_0x56ae('0x40', 'YtnB'));
}
;encode_version = 'sojson.v5';





