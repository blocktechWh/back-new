import React from 'react';
import {Modal, Table, message} from 'antd';

import Api from '../../api';

export default class extends React.Component {
	// 页面即将加载
	componentWillMount() {
		this.userId = ''; // 角色id
		this.selfRoles = []; // 登录用户角色列表
		this.selfRoleIdSet = new Set();
		this.userRoles = []; // 待操作用户角色列表
		this.userRoleIdSet = new Set();

		// 加载登录用户角色列表
		Api.getSelfRole().then(res => {
			if (200 === res.status) {
				this.selfRoles = res.data;
				this.selfRoles.forEach(role => {
					this.selfRoleIdSet.add(role.id);
				});
			} else {
				message.error(res.msg);
			}
		});
	}

	// 定义状态属性
	state = {
		dataSource: [],
		selectedRowKeys: [], // 已选中记录
	}

	// props发生变化
	componentWillReceiveProps(nextProps) {
		// 判定发生有效变化
		if (nextProps.dataKeys !== this.props.dataKeys && nextProps.dataKeys) {
			console.log("componentWillReceiveProps, dataKeys=" + nextProps.dataKeys);
			this.userId = nextProps.dataKeys;

			// 加载用户角色列表
			Api.getUserRole(this.userId).then(res => {
				if (200 === res.status) {
					this.userRoles = res.data;
					this.userRoleIdSet.clear();
					this.userRoles.forEach(role => {
						this.userRoleIdSet.add(role.id);
					});

					// 最终展示的角色列表应为 登录用户角色列表 及 待操作用户角色列表 的并集
					let roles = this.selfRoles;
					this.userRoles.forEach(role => {
						if (!this.selfRoleIdSet.has(role.id)) {
							roles.push(role);
						}
					});

					this.setState({
						selectedRowKeys: Array.from(this.userRoleIdSet),
						dataSource: roles,
					});

					this.selectedRowKeys = [];
				} else {
					message.error(res.msg);
				}
			});
		}
	}

	doSubmit = () => {
		console.log('[userId]', this.userId, ', [selectedRowKeys]', this.state.selectedRowKeys)

		Api.updateUserRole(this.userId, {
			roleIds: this.state.selectedRowKeys,
		}).then(res => {
			if (200 === res.status) {
				message.info('分配角色成功');
			} else {
				message.error(res.msg);
			}
		});
	}

	render() {
		let {visible, onClose} = this.props;

		const columns = [{
			title: '角色名称',
			dataIndex: 'roleName',
			width: 200
		}, {
			title: '角色描述',
			dataIndex: 'roleDesc',
			width: 320
		}];

		// 选中记录变化
		const rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys,
			// 选择框的默认属性配置
			getCheckboxProps: (record) => {
				if (!this.selfRoleIdSet.has(record.id) && this.userRoleIdSet.has(record.id)) { // A没有B有
					return {
						checked: true,
						disabled: true,
					};
				} else {
					return {};
				}
			},
			// 选择事件
			onChange: (selectedRowKeys) => {
				this.setState({selectedRowKeys})
			}
		};

		return (
			<Modal visible={visible} title='分配角色' okText='确定' cancelText='取消' onOk={this.doSubmit} onCancel={onClose}>
				<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} bordered={true}
					rowKey={record => record.id} pagination={false} onChange={this.doTableChange} />
			</Modal>
		);
	}
}
