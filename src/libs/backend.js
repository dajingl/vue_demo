
'use strict';
/**
 * @name 前端ajax的通用服务，用来调用后端的接口
 * @version ajax请求 添加前加密解密算法
 * @author like hxx
 * @Time 2018/4/9 下午1:52:47
 */
import { Loading, Notify } from 'vant';
import router from '../router/index.js';
import CryptoJS from "crypto-js";
const MD5 = require('md5-node');
import { v1 as uuidv1 } from 'uuid';
console.log(uuidv1)
const NodeRSA = require('node-rsa');
const _pubKey = "Xwb5COdSD5u5vHOpIacsepdJPlkwREu7c-e1gNYxb";


function csrfSafeMethod(method) {
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//通用服务
const common = {
	//1. 通用基础 ajax服务
	ajaxServer: function(type, uri, dataobj,ifDecryption = false) {
		let csrftoken = $.cookie('csrfToken');
		return new Promise((resolve, reject) => {
			$.ajax({
				type: type,
				url: uri,
				timeout: 20000, //超时时间设置，单位毫秒
				dataType: 'json',
				data: JSON.stringify(dataobj),
				contentType: 'application/json',
				beforeSend: function(xhr, settings) {
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader('x-csrf-token', csrftoken);
					}
				},
				success: function(result) {
					if (!result.errCode) {
						if(ifDecryption && result.requestid){
							result.data = cryptoJSdecryptData(result.data,result.requestid);
						}
						resolve(result);
					} else {
						reject(result);
					}
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	},
	//2. 通用参数加密 ajax服务
	ajaxServerSign: function(type, uri, dataobj,ifDecryption = false) {
		let csrftoken = $.cookie('csrfToken');
		let requesttime = new Date().getTime();
		let requestid = uuidv1();
		let obj = null;
		let paramsobjStr = null;
		if (type == "GET" || type == "get") {
			let str = encryptPub(JSON.stringify(dataobj));
			paramsobjStr = `params=${encodeURIComponent(str)}`;
			obj = `${requestid}${_pubKey}params=${str}${requesttime}`;
		} else {
			let paramsobj = {
				params: encryptPub(JSON.stringify(dataobj))
			}
			paramsobjStr = JSON.stringify(paramsobj);
			obj = `${requestid}${_pubKey}${JSON.stringify(objKeySort(paramsobj))}${requesttime}`;
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				type: type,
				url: uri,
				timeout: 20000, //超时时间设置，单位毫秒
				dataType: 'json',
				data: paramsobjStr,
				contentType: 'application/json',
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('requesttime', requesttime);
					xhr.setRequestHeader('requestid', requestid);
					let signStr = MD5(obj).toUpperCase();
					xhr.setRequestHeader('sign', signStr);
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader('x-csrf-token', csrftoken);
					}
				},
				success: function(result) {
					if (!result.errCode) {
						if(ifDecryption && result.requestid){
							result.data = cryptoJSdecryptData(result.data,result.requestid)
						}
						resolve(result);
					} else {
						reject(result);
					}
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	},
	//3. 通用参数加密 ajax服务  携带token
	ajaxServerSignToken: function(type, uri, dataobj,ifDecryption = false) {
		let csrftoken = $.cookie('csrfToken');
		let token = localStorage.getItem('mfToken');
		let requesttime = new Date().getTime();
		let requestid = uuidv1();
		let obj = null;
		let paramsobjStr = null;
		if (type == "GET" || type == "get") {
			let str = encryptPub(JSON.stringify(dataobj));
			paramsobjStr = `params=${encodeURIComponent(str)}`;
			obj = `${requestid}${_pubKey}params=${str}${requesttime}`;
		} else {
			let paramsobj = {
				params: encryptPub(JSON.stringify(dataobj))
			}
			paramsobjStr = JSON.stringify(paramsobj);
			obj = `${requestid}${_pubKey}${JSON.stringify(objKeySort(paramsobj))}${requesttime}`;
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				type: type,
				url: uri,
				timeout: 20000, //超时时间设置，单位毫秒
				dataType: 'json',
				data: paramsobjStr,
				contentType: 'application/json',
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('token', token);
					xhr.setRequestHeader('requesttime', requesttime);
					xhr.setRequestHeader('requestid', requestid);
					let signStr = MD5(obj).toUpperCase();
					xhr.setRequestHeader('sign', signStr);
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader('x-csrf-token', csrftoken);
					}
				},
				success: function(result) {
					let errtoken = [900001, 900002, 600002, 600001, 600003];
					if (!result.errCode) {
						if(ifDecryption && result.requestid){
							result.data = cryptoJSdecryptData(result.data,result.requestid)
						}
						resolve(result);
					}else if(errtoken.includes(result.errCode)){
                        Notify({
							message: "登录超时，跳转登录页面重新登录！",
							type: 'danger',
						});
                         router.push('/pages/login');    
						reject(result);
					} else {
						reject(result);
					}
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	},
	//4. 上传数据量较大。 示例：图片base64
	uploadImg: function(type, uri, formdata) {
		let csrftoken = $.cookie('csrfToken');
		return new Promise((resolve, reject) => {
			$.ajax({
				url: uri,
				timeout: 40000,
				type: type,
				data: formdata,
				processData: false, // tell jQuery not to process the data
				contentType: false, // tell jQuery not to set contentType
				beforeSend: function(xhr, settings) {
					//console.log('settings: ', settings,'csrfSafeMethod(settings.type): ', csrfSafeMethod(settings.type),'this.crossDomain:',this.crossDomain);
					if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
						xhr.setRequestHeader('x-csrf-token', csrftoken);
					}
				},
				success: function(result) {
					resolve(result);
				},
				error: function(error) {
					reject(error);
				}
			});
		});
	},
};

//排序的函数
function objKeySort(obj) {
	var newkey = Object.keys(obj).sort();
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	return newObj; //返回排好序的新对象
};

//	get请求json转url参数
function queryParams(data, isPrefix) {
	isPrefix = isPrefix ? isPrefix : false
	let prefix = isPrefix ? '?' : ''
	let _result = []
	for (let key in data) {
		let value = data[key]
		// 去掉为空的参数
		if (['', undefined, null].includes(value)) {
			continue
		}
		if (value.constructor === Array) {
			value.forEach(_value => {
				_result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
			})
		} else {
			_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
		}
	}
	return _result.length ? prefix + _result.join('&') : ''
};

// 注册NodeRSA加密函数方法
function encryptPub(str) {
	let _pubKey = `-----BEGIN PUBLIC KEY-----
                    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGNrzOW3wuyy88mWM5C5pWXhP5
                    IukJUu3j7cUnYHGsCQeuH2DjYXnub583DWeaUN1hpNPHvAXfXj8Zl8/E/VZv3NLy
                    ejs4o6g1wCP1msTRKubJwznXLza6tnwAo6/IjpnR5/ngOSdsPtz8QYcpC9VF4MZA
                    35uaZLBqUwzBkI3gSwIDAQAB
                    -----END PUBLIC KEY-----`;
	const publicKey = new NodeRSA(_pubKey);
	return publicKey.encrypt(str, "base64", "utf8");
};

//	对称解密
function cryptoJSdecryptData(data, requestid){
	const _pubKey = `${requestid}`;
	let key = CryptoJS.enc.Utf8.parse(_pubKey);
    let iv = CryptoJS.enc.Utf8.parse(_pubKey);
    let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

export default {
	ajaxServer: common.ajaxServer,
	ajaxServerSign: common.ajaxServerSign,
	ajaxServerSignToken: common.ajaxServerSignToken,
	uploadImg: common.uploadImg,
};