import React from 'react';
import {Tree, Modal, message} from 'antd';
const TreeNode = Tree.TreeNode;

import Api from '../../api';
import {fullMenu} from '../../menuFunc';

export default class extends React.Component {
	// 页面即将加载
	componentWillMount() {
		this.funcPre = '_func.'; // 菜单功能key前缀，用于区分菜单key
		this.funcMap = new Map();
		this.roleId = ''; // 角色id

		// 加载完整菜单功能
		Api.getAllFunc().then(res => {
			if (200 === res.status) {
				res.data.forEach(item => {
					this.funcMap.set(item.funcCode, item);
				})
			} else {
				message.error(res.msg);
			}
		});
	}

	// 定义状态属性
	state = {
		checkedKeys: [], // 树选中keys
	}

	// props发生变化
	componentWillReceiveProps(nextProps) {
		// 判定发生有效变化
		if (nextProps.dataKeys !== this.props.dataKeys && nextProps.dataKeys) {
			console.log("componentWillReceiveProps, dataKeys=" + nextProps.dataKeys);
			this.roleId = nextProps.dataKeys;

			// 加载角色已关联权限
			Api.getRoleFunc(this.roleId).then(res => {
				if (200 === res.status) {
					this.initKeys = [];

					res.data.menuCodes.forEach(item => {
						this.initKeys.push(item);
					})

					res.data.functionCodes.forEach(item => {
						this.initKeys.push(`${this.funcPre}${item}`);
					})

					// 初始选中
					console.log('[initKeys]', this.initKeys);
					this.setState({checkedKeys: this.initKeys});
				} else {
					message.error(res.msg);
				}
			});
		}
	}

	onCheck = (checkedKeys) => {
		this.setState({checkedKeys});
	}

	// 发生select时，同步到check
	onSelect = (selectedKeys, e) => {
		let checkedKeys = this.state.checkedKeys;
		const selectKey = e.node.props.eventKey; // 事件相关key

		if (e.selected && !checkedKeys.includes(selectKey)) { // 选中，添加key
			checkedKeys.push(selectKey);
			this.setState({checkedKeys});
		} else if (!e.selected && checkedKeys.includes(selectKey)) { // 取消选中，移除key
			checkedKeys = checkedKeys.filter(key => {
				return key !== selectKey;
			})
			this.setState({checkedKeys});
		}
	}

	doSubmit = () => {
		let menuCodes = [];
		let functionCodes = [];

		this.state.checkedKeys.forEach(key => {
			if (key.startsWith(this.funcPre)) {
				functionCodes.push(key.substr(this.funcPre.length));
			} else {
				menuCodes.push(key);
			}
		})

		console.log('[roleId]', this.roleId, '[menuCodes]', menuCodes, '[functionCodes]', functionCodes)

		Api.updateRoleFunc(this.roleId, {
			menuCodes: menuCodes,
			functionCodes: functionCodes,
		}).then(res => {
			if (200 === res.status) {
				message.info('分配权限成功');
			} else {
				message.error(res.msg);
			}
		});
	}

	renderTreeNodes = (data) => {
		return data.map((item) => {
			// 有子菜单
			if (item.subMenus) {
				return (
					<TreeNode key={item.key} title={item.title} >
						{this.renderTreeNodes(item.subMenus)}
					</TreeNode>
				);
			}

			// 有菜单功能
			if (item.functions) {
				return (
					<TreeNode key={item.key} title={item.title} >
						{item.functions.map(func => {
							let title = '';
							if (!this.funcMap.has(func.name)) {
								title = `${func.name} (未同步)`;
							} else if (this.funcMap.get(func.name).requestName) {
								title = this.funcMap.get(func.name).requestName + ` (${func.name})`;
							} else {
								title = `${func.name} (未关联)`;
							}
							return <TreeNode key={`${this.funcPre}${func.name}`} title={title} />;
						})}
					</TreeNode>
				);
			}

			return (<TreeNode key={item.key} title={item.title} />);
		});
	}

	render() {
		let {visible, onClose} = this.props;

		return (
			<Modal visible={visible} title='分配权限' okText='确定' cancelText='取消' onOk={this.doSubmit} onCancel={onClose} wrapClassName={'roleLinkMenuModal'}>
				<Tree checkable={true} defaultExpandAll={true} onCheck={this.onCheck} onSelect={this.onSelect} checkedKeys={this.state.checkedKeys}>
					{this.renderTreeNodes(fullMenu)}
				</Tree>
			</Modal>
		);
	}
}
