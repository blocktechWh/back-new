import React, {Component} from 'react';
import {Layout, Menu, Icon, Popconfirm, message, Button} from 'antd';
import {Link} from 'react-router';
import {changePwd} from '../api';
import ChangePasswordForm from '../forms/ChangePasswordForm';
const {Item, SubMenu} = Menu;
const {Content, Sider, Footer, Header} = Layout;
import {queryMenu, logout} from '../api';

// 包含ChangePasswordForm组件，用于用户修改密码
class Nav extends Component {
    state = {
        menu: [], // 菜单数据
        rootId: -1, // 菜单根节点id
        selectedId: -1, // 菜单选中节点id

        // form相关
        form: {
            isVisible: false // 是否显示
        }
    }

    componentDidMount() {
        // 查询所有菜单
        queryMenu().then((res) => {
            let selectedKeys;
            res.data.map((item) => {
                if (item.menuName) {
                    item.icon = item.icon;
                    item.route = item.url;
                }
                if (item.route === this.props.location.pathname) {
                    item.route = '';
                    selectedKeys = [item.id.toString()];
                }
                return item;
            });
            this.setState({'menu': res.data, 'selectedKeys': selectedKeys});
        }).catch(function (error) {
            if (error.status) {
                message.error(error.msg);
            } else {
                message.error(error);
            }
        });
    }

    // 点击菜单事件
    handleMenuClick(e) {
        this.setState({'selectedKeys': e.key});
        var item = this.getArrayItemById(this.state.menu, e.key);
        if (item) {
            this.props.router.push(item.url);
        }
    }

    // 点击登出
    handleLoginOut(e) {
        this.setState({
            loading: true
        });
        logout().then(res => {
            if (res.code === '000') {
                this.props.router.push('/');
                this.setState({
                    loading: false
                });
            }
            else {
                alert("handleLoginOut err！");
                this.setState({
                    loading: false
                });
            }
        })
    }

    getArrayItemById(myArray, id) {
        let array = [];
        for (let value of myArray) {
            array.push(value);
            if (value.children) {
                array = array.concat(value.children);
            }
        }
        for (let value of array) {
            if (value && value.id === id) {
                return value;
            }
        }
        return null;
    }

    // 点击修改密码，弹出ChangePasswordForm
    changePassword(e) {
        this.form.resetFields();
        // 修改state中的{}的第一种方法
        this.state.form.isVisible = true;
        this.setState(this.state.form);
    }

    // 通过ref属性将子组件关联到父组件
    saveFormRef = (instance) => {
        this.form = instance;
    }

    // 点击ChangePasswordForm的取消
    handleCancel = (e) => {
        // 修改state中的{}的第二种方法
        this.setState({
            form: Object.assign({}, this.state.form, {isVisible: false})
        });
    }

    // 点击ChangePasswordForm的确定
    handleOk = (e) => {
        this.setState({loading: true});
        let formData = this.form.getFieldsValue();
        changePwd(formData).then(res => {
            this.state.form.isVisible = false;
            this.setState(this.state.form);
            message.success('修改密码成功！');
            this.setState({loading: false});
        });
    }

    render() {
        const {menu, rootId, selectedId} = this.state;
        const menuRender = (mapData) => {
            return mapData.map((item) => {
                if (item.valid !== '1') {return false;}
                if (item.children && item.children.length) {
                    return (<SubMenu key={item.id} data={item} title={<span><Icon type={item.icon} /><span>{item.menuName}</span></span>}>
                        {menuRender(item.children)}
                    </SubMenu>);
                } else {
                    return (<Item key={item.id}><Link to={item.route}><Icon type={item.icon} />{item.menuName}</Link></Item>);
                }
            });
        }
        const menus = menuRender(menu);
        const childrenWithResourceId = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                'resourceId': rootId
            })
        });

        return (
            <Layout>
                <Header style={{background: '#f1f1f1', position: 'fixed', width: '100%', left: 0, zIndex: 100}}>
                    <div style={{display: 'inline-block', width: 200, height: 50, padding: 10, background: '#313536'}}>
                        <img src={process.env.PUBLIC_URL + '/logo.png'} alt='404' />
                    </div>
                    <span style={{color: '#000'}}>
                        <Icon type="user" style={{fontSize: 20, color: '#000'}} />
                        您好，Admin</span>
                    <div style={{float: 'right', width: 80}}>
                        <ChangePasswordForm visible={this.state.form.isVisible} ref={this.saveFormRef} handleCancel={this.handleCancel}
                            handleOk={this.handleOk.bind(this)} />
                        <Button style={{marginLeft: -66, marginTop: 19, width: 65, paddingLeft: 10, background: '#fff', border: 'none', color: '#000'}} type="dashed" onClick={this.changePassword.bind(this)}>修改密码</Button>
                        <Popconfirm placement="topRight" title="确认要退出系统吗？" onConfirm={this.handleLoginOut.bind(this)} okText="确认" cancelText="取消">
                            <Button style={{marginTop: 19, width: 65, marginLeft: 10, background: '#fff', border: 'none', color: '#000'}} type="primary">退出</Button>
                        </Popconfirm>
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 50, zIndex: 10}}>
                        {/* <Menu theme="dark" mode="inline" style={{height: '100%'}} selectedKeys={[selectedId]}
                            defaultOpenKeys={[1]} onClick={this.handleMenuClick.bind(this)}>
                            {menus}
                            </Menu> */}
                        <Menu theme="dark" mode="inline" style={{height: '100%'}} onClick={this.handleMenuClick.bind(this)}>
                            {menus}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={{background: '#fff', overflow: 'hidden', height: '100%', paddingBottom: 66, marginBottom: -66, marginLeft: 200, marginTop: 50}}>
                            {childrenWithResourceId}
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

export default Nav;
