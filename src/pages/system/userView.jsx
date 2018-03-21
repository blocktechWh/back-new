import React from 'react';
import {Modal, List} from 'antd';

class UserViewModal extends React.Component {
    render() {
        const {visible, dataSource} = this.props;

        return (
            <Modal visible={visible} title="查看用户">
                <List itemLayout="horizontal" dataSource={dataSource}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta title={item.title} description={item.desc} />
                        </List.Item>
                    )}
                />
            </Modal>
        );
    }
}

export default UserViewModal;
