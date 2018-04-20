import Api from './api';

// 菜单结构、跳转地址及页面功能
export const fullMenu = [{
	key: 'homepage',
	title: '首页',
	icon: 'home',
	route: '/nav/home',
	isForceShow: true, // 必须菜单，强制显示
}, {
	key: 'devMode',
	title: '开发者模式',
	icon: 'tool',
	subMenus: [{
		key: 'menuMng',
		title: '菜单管理',
		icon: '',
		route: '/nav/core/menu',
		functions: [Api.queryMenu, Api.getMenuFunc, Api.syncMenu],
	}],
}, {
	key: 'sysMng',
	title: '系统管理',
	icon: 'setting',
	subMenus: [{
		key: 'userMng',
		title: '用户管理',
		icon: 'user',
		route: '/nav/core/user',
		functions: [Api.getUser, Api.queryUser, Api.addUser, Api.updateUser, Api.deleteUser, Api.getSelfRole, Api.getUserRole, Api.updateUserRole],
	}, {
		key: 'roleMng',
		title: '角色管理',
		icon: 'solution',
		route: '/nav/core/role',
		functions: [Api.getRole, Api.queryRole, Api.addRole, Api.updateRole, Api.deleteRole, Api.getAllFunc, Api.getRoleFunc, Api.updateRoleFunc],
	}, {
		key: 'onlineMng',
		title: '在线用户（后台）',
		icon: 'link',
		route: '/nav/core/online/mng',
		functions: [Api.queryOnline],
	}, {
		key: 'onlineMngHis',
		title: '在线历史（后台）',
		icon: 'link',
		route: '/nav/core/online/mng/his',
		functions: [Api.queryOnlineHis],
	}, {
		key: 'onlineApi',
		title: '在线用户（前台）',
		icon: 'link',
		route: '/nav/core/online/api',
		functions: [],
	}, {
		key: 'onlineApiHis',
		title: '在线历史（前台）',
		icon: 'link',
		route: '/nav/core/online/api/his',
		functions: [],
	}],
}, {
	key: 'busiMng',
	title: '业务管理',
	icon: 'setting',
	subMenus: [{
		key: 'busiMng.sub01',
		title: '设备管理',
		icon: '',
		route: '',
		functions: [],
	}],
}];

// 菜单列表
export let menuList = [];
// 记录每个菜单出现次数
let menuCountMap = new Map();
// 记录每个路由页面的功能列表
let routeFuncMap = new Map();
// 记录每个路由页面的名称
let routeTitleMap = new Map();

// 递归遍历菜单，子菜单出现次数累加到父菜单
function checkMenu(menu, menuCodes, pMenuTitle) {
	let c = 0;
	if (menu.subMenus && menu.subMenus.length) { // 父菜单
		for (let item of menu.subMenus) {
			c += checkMenu(item, menuCodes, menu.title);
		}
	} else if (menuCodes.includes(menu.key)) { // 包含子菜单
		c = 1;
		menuCountMap.set(menu.key, 1);
		routeFuncMap.set(menu.route, menu.functions);
	} else { // 未包含子菜单
		menuCountMap.set(menu.key, 0);
	}

	// 菜单名称
	if (pMenuTitle) {
		routeTitleMap.set(menu.route, pMenuTitle + ' / ' + menu.title);
	} else if (menu.route) {
		routeTitleMap.set(menu.route, menu.title);
	}

	// 菜单列表
	if (menu.functions) {
		let funcCodes = [];
		for (let func of menu.functions) {
			funcCodes.push(func.name);
		}

		menuList.push({
			menuCode: menu.key,
			menuName: menu.title,
			funcCodes: funcCodes,
		});
	}

	return c;
}

export function getMenuInfo(menuCodes) {
	// 清空数据
	menuList = [];
	menuCountMap = new Map();
	routeFuncMap = new Map();
	routeTitleMap = new Map();

	for (let menu of fullMenu) {
		menuCountMap.set(menu.key, checkMenu(menu, menuCodes));
	};

	return {menuCountMap, routeFuncMap, routeTitleMap};
}
