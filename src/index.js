import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import './index.less';

// 页面框架、导航栏、登录页、欢迎页、404
import Frame from './pages/frame';
import Nav from './pages/nav';
import Login from './pages/login';
import Welcome from './pages/login';
import NotFound from './pages/notFound';

// 首页
import Home from './pages/homepage';

// 开发者模式

// 系统管理：用户、角色、菜单、菜单功能
import User from './pages/system/user';
import Role from './pages/system/user';
import Menu from './pages/system/user';
import Func from './pages/system/user';

// 业务管理：会员、
import Member from './pages/busi/member';

const RouteConfig =
    <Router history={hashHistory}>
        <Route path="/" component={Frame}>
            <IndexRoute component={Login} />
            <Route path="/login" component={Login}></Route>
            <Route path="/404" component={NotFound}></Route>
            <Route path="/nav" component={Nav}>
                <Route path="/nav/home" component={Home}></Route>
                /** 开发者模式 */
                /** 系统管理 */
                <Route path="/nav/system/user" component={User}></Route>
                /** 业务管理 */
                <Route path="/nav/busi/member" component={Member}></Route>
            </Route>
        </Route>
    </Router>;
ReactDOM.render(
    RouteConfig,
    document.getElementById('root')
);
