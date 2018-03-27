import axios from 'axios'; // Axios 是一个基于 promise 的 HTTP 库
import qs from 'qs'; // qs 用于格式化查询字符串

const host = 'http://127.0.0.1:8080';

// 定义通用头信息
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token") || '';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.response.use(function (response) {
	console.log("200响应，返回" + JSON.stringify(response.data));
	return response.data;
}, function (error) {
	if (error.response) {
		console.log(error.response.status + "响应，返回" + JSON.stringify(error.response.data));
		return Promise.reject(error.response.data);
	} else {
		console.log("请求错误信息：" + error.message);
		return Promise.reject(error.message);
	}
})

// api
export const login = (username, password) => axios.post(host + '/mng/login', {name: username, pwd: password});
export const logout = () => axios.get(host + '/mng/logout');

// menu相关
export const queryMenu = (query) => axios.post(host + '/mng/menu/query', query);
export const getMenu = (userId) => axios.get(host + '/mng/menu' + userId);
export const addMenu = (username, realname) => axios.post(host + '/mng/menu', {username: username, realname: realname});
export const updateMenu = (userId, username, realname) => axios.put(host + '/mng/menu/' + userId, {username: username, realname: realname});
export const deleteMenu = (userId) => axios.delete(host + '/mng/menu/' + userId);

// user相关
export const queryUser = (query) => axios.post(host + '/mng/user/query', query);
export const getUser = (userId) => axios.get(host + '/mng/user/' + userId);
export const addUser = (username, realname) => axios.post(host + '/mng/user', {username: username, realname: realname});
export const updateUser = (userId, username, realname) => axios.put(host + '/mng/user/' + userId, {username: username, realname: realname});
export const deleteUser = (userId) => axios.delete(host + '/mng/user/' + userId);


export const deletesUser = (ids) => axios.get(host + '/mng/user/deletes?ids=' + ids);
export const users = (offset, pageSize, obj) => axios.get(host + '/mng/user/page/' + offset + '/' + pageSize + "?" + qs.stringify(obj));
export const usersName = (offset, pageSize, orderIdentity, isDesc) => axios.get(host + '/mng/user/page/' + offset + '/' + pageSize, orderIdentity ? {queryOrder: [{orderIdentity, isDesc}]} : {});
export const fontUsersName = (offset, pageSize, orderIdentity, isDesc) => axios.post(host + '/admin/user/page/' + offset + '/' + pageSize, orderIdentity ? {queryOrder: [{orderIdentity, isDesc}]} : {});
export const fontUsers = (offset, pageSize, obj) => axios.post(host + '/admin/gift/page/' + offset + '/' + pageSize, obj);

export const changePwd = (obj) => axios.get(host + '/mng/user/changePwd?' + qs.stringify(obj));

export const addUsers = (obj) => axios.post(host + '/mng/user/addOrUpdate', obj);

export const updateStatus = (obj) => axios.post(host + '/mng/user/updateStatus', obj);
export const getResource = (resoucesId) => axios.get(host + '/mng/resouces/getResourceByPid/' + resoucesId);
export const getAllVotes = (offset, pageSize) => axios.get(host + '/admin/vote/page/' + offset + '/' + pageSize);

export const getAllRoles = (offset, pageSize) => axios.get(host + '/mng/role/page/' + offset + '/' + pageSize);

export const getAllAccounts = (offset, pageSize, obj) => axios.post(host + '/admin/mebAccount/page/' + offset + '/' + pageSize, obj);

export const getWalletLogList = (offset, pageSize, obj) => axios.post(host + '/admin/walletLog/page/' + offset + '/' + pageSize, obj);

export const getEntryList = (offset, pageSize, obj) => axios.post(host + '/admin/walletTakeLog/page/' + offset + '/' + pageSize, obj);

export const getExistList = (offset, pageSize, obj) => axios.post(host + '/admin/walletTakeLog/page/' + offset + '/' + pageSize, obj);
