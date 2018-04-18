import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import './index.less';

// 页面框架、导航栏、登录页、欢迎页、404
import Frame from './pages/frame';
import Nav from './pages/nav';
import Login from './pages/login';
import NotFound from './pages/notFound';

// 首页
import Home from './pages/homepage';

// 开发者模式：菜单及功能
import Menu from './pages/system/menu';

// 系统管理：用户、角色、在线
import User from './pages/system/user';
import Role from './pages/system/role';
import OnlineMng from './pages/system/online.mng';
import OnlineMngHis from './pages/system/online.mng.his';
import OnlineApi from './pages/system/online.api';
import OnlineApiHis from './pages/system/online.api.his';

// 业务管理：会员

const RouteConfig =
	<Router history={hashHistory}>
		<Route path="/" component={Frame}>
			<IndexRoute component={Login} />
			<Route path="/login" component={Login}></Route>
			<Route path="/404" component={NotFound}></Route>
			<Route path="/nav" component={Nav}>
				<Route path="/nav/home" component={Home}></Route>
				/** 开发者模式 */
				<Route path="/nav/system/menu" component={Menu}></Route>
				/** 系统管理 */
				<Route path="/nav/system/user" component={User}></Route>
				<Route path="/nav/system/role" component={Role}></Route>
				<Route path="/nav/system/online/mng" component={OnlineMng}></Route>
				<Route path="/nav/system/online/mng/his" component={OnlineMngHis}></Route>
				<Route path="/nav/system/online/api" component={OnlineApi}></Route>
				<Route path="/nav/system/online/api/his" component={OnlineApiHis}></Route>
			/** 业务管理 */
			</Route>
		</Route>
	</Router>;
ReactDOM.render(
	RouteConfig,
	document.getElementById('root')
);
