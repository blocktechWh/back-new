import axios from 'axios'; // Axios 是一个基于 promise 的 HTTP 库
import qs from 'qs'; // qs 用于格式化查询字符串
import {message} from 'antd';

// 定义通用头信息
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') || '';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

// 覆写配置，修改为只要收到响应均视为“已成功”
// 原默认配置为status >= 200 && status < 300
axios.defaults.validateStatus = function validateStatus(status) {
	return true;
}

// 响应预处理
axios.interceptors.response.use(function (response) {
	console.log(response.status + '响应，返回' + JSON.stringify(response.data));
	response.data.status = response.status;
	return response.data;
}, function (error) {
	console.log('请求失败：' + error.message);
	message.error('请求失败：' + error.message);
	return Promise.reject(error.message);
});

// 主机地址
const host = 'http://127.0.0.1:8080';

// api
export default {
	login: (username, password) => axios.post(host + '/mng/login', {name: username, pwd: password}),
	logout: () => axios.post(host + '/mng/logout'),

	// menu相关
	queryMenu: (query) => axios.post(host + '/mng/menu/query', query),
	getMenu: (userId) => axios.get(host + '/mng/menu' + userId),
	addMenu: (username, realname) => axios.post(host + '/mng/menu', {username: username, realname: realname}),
	updateMenu: (userId, username, realname) => axios.put(host + '/mng/menu/' + userId, {username: username, realname: realname}),
	deleteMenu: (userId) => axios.delete(host + '/mng/menu/' + userId),

	// user相关
	queryUser: (query) => axios.post(host + '/mng/user/query', query),
	getUser: (userId) => axios.get(host + '/mng/user/' + userId),
	addUser: (username, realname) => axios.post(host + '/mng/user', {username: username, realname: realname}),
	updateUser: (userId, username, realname) => axios.put(host + '/mng/user/' + userId, {username: username, realname: realname}),
	deleteUser: (userId) => axios.delete(host + '/mng/user/' + userId),


	deletesUser: (ids) => axios.get(host + '/mng/user/deletes?ids=' + ids),
	users: (offset, pageSize, obj) => axios.get(host + '/mng/user/page/' + offset + '/' + pageSize + '?' + qs.stringify(obj)),
	usersName: (offset, pageSize, orderIdentity, isDesc) => axios.get(host + '/mng/user/page/' + offset + '/' + pageSize, orderIdentity ? {queryOrder: [{orderIdentity, isDesc}]} : {}),
	fontUsersName: (offset, pageSize, orderIdentity, isDesc) => axios.post(host + '/admin/user/page/' + offset + '/' + pageSize, orderIdentity ? {queryOrder: [{orderIdentity, isDesc}]} : {}),
	fontUsers: (offset, pageSize, obj) => axios.post(host + '/admin/gift/page/' + offset + '/' + pageSize, obj),

	changePwd: (obj) => axios.get(host + '/mng/user/changePwd?' + qs.stringify(obj)),

	addUsers: (obj) => axios.post(host + '/mng/user/addOrUpdate', obj),

	updateStatus: (obj) => axios.post(host + '/mng/user/updateStatus', obj),
	getResource: (resoucesId) => axios.get(host + '/mng/resouces/getResourceByPid/' + resoucesId),
	getAllVotes: (offset, pageSize) => axios.get(host + '/admin/vote/page/' + offset + '/' + pageSize),

	getAllRoles: (offset, pageSize) => axios.get(host + '/mng/role/page/' + offset + '/' + pageSize),

	getAllAccounts: (offset, pageSize, obj) => axios.post(host + '/admin/mebAccount/page/' + offset + '/' + pageSize, obj),

	getWalletLogList: (offset, pageSize, obj) => axios.post(host + '/admin/walletLog/page/' + offset + '/' + pageSize, obj),

	getEntryList: (offset, pageSize, obj) => axios.post(host + '/admin/walletTakeLog/page/' + offset + '/' + pageSize, obj),

	getExistList: (offset, pageSize, obj) => axios.post(host + '/admin/walletTakeLog/page/' + offset + '/' + pageSize, obj),

}
