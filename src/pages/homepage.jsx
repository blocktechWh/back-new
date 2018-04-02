import React from 'react';
import {Layout, Menu, Icon, Popconfirm, Button, message} from 'antd';

export default class Homepage extends React.Component {
    render() {
        return (
            <div>
                <span style={{color: '#000'}}><Icon type="user" style={{fontSize: 20, color: '#000'}} />您好，Admin</span>
            </div >
        )
    }
}
