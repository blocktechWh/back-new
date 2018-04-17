import React from 'react';
import {Icon} from 'antd';

export default class Homepage extends React.Component {
	// 页面即将加载
	componentWillMount() {
		this.userRealname = localStorage.getItem('userRealname');
	}

	render() {
		return (
			<div>
				<span style={{color: '#000'}}><Icon type="user" style={{fontSize: 20, color: '#000'}} />您好，{this.userRealname}</span>
			</div >
		)
	}
}
