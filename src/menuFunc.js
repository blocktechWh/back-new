// 菜单结构、跳转地址及页面功能
export const fullMenu = [
    {
        key: 'homepage',
        title: '首页',
        icon: 'home',
        route: '/nav/home',
        isForceShow: true, // 必须菜单，强制显示
    },
    {
        key: 'menu01',
        title: '开发者模式',
        icon: 'tool',
        subMenus: [],
    },
    {
        key: 'menu02',
        title: '系统管理',
        icon: 'setting',
        subMenus: [
            {
                key: 'menu02.sub01',
                title: '用户管理',
                icon: 'user',
                route: '/nav/system/user',
                functions: ['func01'],
            },
            {
                key: 'menu02.sub02',
                title: '角色管理',
                icon: '',
                route: '/nav/system/role',
                functions: [],
            },
        ],
    },
];

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

    return c;
}

export function getMenuInfo(menuCodes) {
    for (let menu of fullMenu) {
        menuCountMap.set(menu.key, checkMenu(menu, menuCodes));
    };
    return {menuCountMap, routeFuncMap};
}
