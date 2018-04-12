import Api from './api';

// 菜单结构、跳转地址及页面功能
export const fullMenu = [{
    key: 'homepage',
    title: '首页',
    icon: 'home',
    route: '/nav/home',
    isForceShow: true, // 必须菜单，强制显示
}, {
    key: 'menu01',
    title: '开发者模式',
    icon: 'tool',
    subMenus: [],
}, {
    key: 'menu02',
    title: '系统管理',
    icon: 'setting',
    subMenus: [{
        key: 'menu02.sub01',
        title: '用户管理',
        icon: 'user',
        route: '/nav/system/user',
        functions: [Api.getUser, Api.queryUser, Api.addUser, Api.updateUser, Api.deleteUser],
    }, {
        key: 'menu02.sub02',
        title: '角色管理',
        icon: '',
        route: '/nav/system/role',
        functions: [Api.getRole, Api.queryRole, Api.addRole, Api.updateRole, Api.deleteRole],
    }, {
        key: 'menu02.sub03',
        title: '菜单管理',
        icon: '',
        route: '/nav/system/menu',
        functions: [Api.queryMenu],
    }],
}, {
    key: 'menu03',
    title: '业务管理',
    icon: 'setting',
    subMenus: [{
        key: 'menu03.sub01',
        title: '设备管理',
        icon: '',
        route: '/nav/system/user',
        functions: [],
    }],
}];

// 菜单列表
export let menuList = [];
// 记录每个菜单出现次数
let menuCountMap = new Map();
// 记录每个路由页面的功能列表
let routeFuncMap = new Map();

// 递归遍历菜单，子菜单出现次数累加到父菜单
function checkMenu(menu, menuCodes) {
    let c = 0;
    if (menu.subMenus && menu.subMenus.length) { // 父菜单
        for (let item of menu.subMenus) {
            c += checkMenu(item, menuCodes);
        }
    } else if (menuCodes.includes(menu.key)) { // 包含子菜单
        c = 1;
        menuCountMap.set(menu.key, 1);
        routeFuncMap.set(menu.route, menu.functions);
    } else { // 未包含子菜单
        menuCountMap.set(menu.key, 0);
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

    for (let menu of fullMenu) {
        menuCountMap.set(menu.key, checkMenu(menu, menuCodes));
    };

    return {menuCountMap, routeFuncMap};
}
