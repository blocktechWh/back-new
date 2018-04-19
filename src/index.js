import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import './index.less';

// 页面框架、导航栏、登录页、首页、404
import Frame from './pages/frame';
import Nav from './pages/nav';
import Login from './pages/login';
import Home from './pages/homepage';
import NotFound from './pages/notFound';

// 核心功能
import Menu from './pages/core/menu/index';
import User from './pages/core/user/index';
import Role from './pages/core/role/index';
import OnlineMng from './pages/core/onlineMng/index';
import OnlineMngHis from './pages/core/onlineMngHis/index';
import OnlineApi from './pages/core/onlineApi/index';
import OnlineApiHis from './pages/core/onlineApiHis/index';

// 业务功能

const RouteConfig =
	<Router history={hashHistory}>
		<Route path="/" component={Frame}>
			<IndexRoute component={Login} />
			<Route path="/login" component={Login}></Route>
			<Route path="/404" component={NotFound}></Route>
			<Route path="/nav" component={Nav}>
				<Route path="/nav/home" component={Home}></Route>
				/** 系统管理 */
				<Route path="/nav/core/menu" component={Menu}></Route>
				<Route path="/nav/core/user" component={User}></Route>
				<Route path="/nav/core/role" component={Role}></Route>
				<Route path="/nav/core/online/mng" component={OnlineMng}></Route>
				<Route path="/nav/core/online/mng/his" component={OnlineMngHis}></Route>
				<Route path="/nav/core/online/api" component={OnlineApi}></Route>
				<Route path="/nav/core/online/api/his" component={OnlineApiHis}></Route>
				/** 业务管理 */
			</Route>
		</Route>
	</Router>;
ReactDOM.render(
	RouteConfig,
	document.getElementById('root')
);
