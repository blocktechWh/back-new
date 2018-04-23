import React from 'react';
import {Layout} from 'antd';

export default class extends React.Component {
	render() {
		return (
			<Layout>
				<Layout.Content>
					{React.cloneElement(this.props.children)}
				</Layout.Content>
			</Layout>
		);
	}
}
