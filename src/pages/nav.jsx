import React from 'react';
import {Link} from 'react-router';
import {Layout, Menu, Icon, Popconfirm, Button, message} from 'antd';
const {Item, SubMenu} = Menu;
const {Content, Sider, Footer, Header} = Layout;

import ChangePasswordForm from './nav.pwd';
import Api from '../api';
import {fullMenu, getMenuInfo} from '../menuFunc';

export default class extends React.Component {
    componentWillMount() {
        // 定义内部属性
        let menuCodes = localStorage.getItem('menuCodes');
        let {menuCountMap, routeFuncMap} = getMenuInfo(menuCodes);
        this.menuCountMap = menuCountMap;
        this.routeFuncMap = routeFuncMap;
        this.functionCodes = localStorage.getItem('functionCodes');
    }

    state = {
        rootId: -1, // 菜单根节点id
        selectedKey: 'homepage', // 菜单选中节点
        isFormShow: false, // 是否显示修改密码页面
    }

    // 点击菜单事件
    handleMenuClick = (e) => {
        this.setState({selectedKey: e.key});
    }

    // 点击登出
    handleLoginOut() {
        Api.logout().then(res => {
            if (200 === res.status) {
                this.props.router.push('/');
                message.info('您已成功登出')
            } else {
                message.warn(res.msg)
            }
        })
    }

    // ------子组件：修改密码------
    showForm = () => {this.setState({isFormShow: true});}
    closeForm = () => {this.setState({isFormShow: false});}

    render() {
        const menuRender = (mapData) => {
            return mapData.map((menu) => {
                if (true === menu.isForceShow || (this.menuCountMap.has(menu.key) && this.menuCountMap.get(menu.key) > 0)) { // 符合展示条件
                    if (menu.subMenus && menu.subMenus.length) {
                        return (<SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
                            {menuRender(menu.subMenus)}
                        </SubMenu>);
                    } else {
                        return (<Item key={menu.key}><Link to={menu.route}><Icon type={menu.icon} />{menu.title}</Link></Item>);
                    }
                } else {
                    return false;
                }
            });
        }

        // 传参到功能页面
        const childrenWithParams = React.Children.map(this.props.children, (child) => {
            let functions = []; // 定义的功能和用户后台功能的并集
            if (this.routeFuncMap.get(child.props.route.path)) {
                for (let func of this.routeFuncMap.get(child.props.route.path)) {
                    if (this.functionCodes && this.functionCodes.includes(func)) {
                        functions.push(func);
                    }
                }
            }

            return React.cloneElement(child, {
                'functions': functions, // 页面功能
            })
        });

        return (
            <Layout>
                {/* 页头 */}
                <Header style={{background: '#f1f1f1', position: 'fixed', width: '100%', left: 0, zIndex: 100}}>
                    {/* logo */}
                    <div style={{display: 'inline-block', width: 200, height: 50, padding: 10, background: '#313536'}}>
                        <img src={process.env.PUBLIC_URL + '/logo.png'} alt='404' />
                    </div>
                    {/* 系统名称 */}
                    <span style={{color: '#000'}}>这里放系统名称</span>
                    {/* 功能按钮 */}
                    <div style={{float: 'right', width: 160}}>
                        <ChangePasswordForm visible={this.state.isFormShow} onClose={this.closeForm} />
                        <Button onClick={this.showForm}>修改密码</Button>
                        <Popconfirm placement="topRight" title="确认要退出系统吗？" onConfirm={this.handleLoginOut.bind(this)} okText="确认" cancelText="取消">
                            <Button >退出</Button>
                        </Popconfirm>
                    </div>
                </Header>
                <Layout>
                    {/* 侧边菜单栏 */}
                    <Sider width={200} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 50, zIndex: 10}}>
                        <Menu theme="dark" mode="inline" style={{height: '100%'}} onClick={this.handleMenuClick} selectedKeys={[this.state.selectedKey]}>
                            {menuRender(fullMenu)}
                        </Menu>
                    </Sider>
                    {/* 功能页面区 */}
                    <Layout>
                        <Content style={{background: '#fff', marginLeft: 200, marginTop: 50}}>
                            {childrenWithParams}
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            内页页脚，注意对齐位置
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
