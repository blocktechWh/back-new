import axios from 'axios'; // Axios 是一个基于 promise 的 HTTP 库
import {message} from 'antd';

// 主机地址
const host = 'http://127.0.0.1:8080/mng/';

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

// 请求预处理
axios.interceptors.request.use(function (request) {
	console.log(`请求[${request.method} ${request.url.replace(host, '')}], payload=${JSON.stringify(request.data)}`);
	return request;
});

// 响应预处理
axios.interceptors.response.use(function (response) {
	console.log(`响应[${response.config.method} ${response.config.url.replace(host, '')}], status=${response.status}, payload=${JSON.stringify(response.data)}`);
	response.data.status = response.status;
	return response.data;
}, function (error) {
	console.log('请求失败：' + error.message);
	message.error('请求失败：' + error.message);
	return Promise.reject(error.message);
});

// api
export default {
	login: (username, password) => axios.post(`${host}/login`, {name: username, pwd: password}),
	logout: () => axios.post(`${host}/logout`),

	// 菜单管理
	queryMenu: (query) => axios.post(`${host}/menu/query`, query),
	getMenuFunc: (menuId) => axios.get(`${host}/menu/${menuId}/func`),
	syncMenu: (menuList) => axios.post(`${host}/menu/sync`, menuList),

	// 用户管理
	queryUser: (query) => axios.post(`${host}/user/query`, query),
	getUser: (userId) => axios.get(`${host}/user/${userId}`),
	addUser: (values) => axios.post(`${host}/user`, values),
	updateUser: (userId, values) => axios.put(`${host}/user/${userId}`, values),
	deleteUser: (userId) => axios.delete(`${host}/user/${userId}`),
	// 用户分配角色
	getSelfRole: () => axios.get(`${host}/user/self/role`),
	getUserRole: (userId) => axios.get(`${host}/user/${userId}/role`),
	updateUserRole: (userId, values) => axios.post(`${host}/user/${userId}/role`, values),

	// 角色
	queryRole: (query) => axios.post(`${host}/role/query`, query),
	getRole: (roleId) => axios.get(`${host}/role/${roleId}`),
	addRole: (values) => axios.post(`${host}/role`, values),
	updateRole: (roleId, values) => axios.put(`${host}/role/${roleId}`, values),
	deleteRole: (roleId) => axios.delete(`${host}/role/${roleId}`),
	exportRole: (exp) => axios.post(`${host}/role/query/export`, exp),
	// 角色分配权限
	getAllFunc: () => axios.get(`${host}/menu/all/func`),
	getRoleFunc: (roleId) => axios.get(`${host}/role/${roleId}/func`),
	updateRoleFunc: (roleId, values) => axios.post(`${host}/role/${roleId}/func`, values),

	// 在线
	queryOnline: (values) => axios.post(`${host}/online/query`, values),
	queryOnlineHis: (values) => axios.post(`${host}/online/his/query`, values),
}
