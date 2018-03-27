import React from 'react';
import {Modal, Button, List} from 'antd';

import {getUser} from '../../api';

export default class UserViewModal extends React.Component {
    // 定义状态属性
    state = {
        record: {}
    }

    // props发生变化
    componentWillReceiveProps(nextProps) {
        // 判定发生有效变化
        if (nextProps.dataKeys !== this.props.dataKeys && nextProps.dataKeys.length > 0) {
            console.log("componentWillReceiveProps, dataKeys=" + nextProps.dataKeys);

            // 加载数据
            getUser(nextProps.dataKeys[0]).then(res => {
                this.setState({
                    record: res.data
                });
            });
        }
    }

    render() {
        let {visible, onClose} = this.props;
        let {record} = this.state;

        return (
            <Modal visible={visible} title="查看用户" onCancel={onClose} footer={<Button type="primary" onClick={onClose}>关闭</Button>} >
                <List itemLayout="horizontal" >
                    <List.Item>
                        <List.Item.Meta title="用户名" description={record.userName} />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title="姓名" description={record.userRealname} />
                    </List.Item>
                </List>
            </Modal>
        );
    }
}
