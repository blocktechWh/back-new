import React from 'react';
import {Modal, Button, Form, Input, message} from 'antd';
const FormItem = Form.Item;

import Api from '../../api';
import {eventProxy} from '../../utils';

class AddForm extends React.Component {
    // 页面即将加载
    componentWillMount() {
        // 对象信息
        this.objId = 'Role'; // 注意首字母大写
        this.objName = '角色';

        // 在此定义域的配置信息
        this.fieldsConfig = [{
            id: 'name',
            name: '角色名称',
            required: true,
        }, {
            id: 'desc',
            name: '角色描述',
            required: true,
        }];

        // 关联方法
        this.addFunc = Api[`add${this.objId}`];
    }

    doAdd = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.addFunc(values).then(res => {
                    if (200 === res.status) {
                        eventProxy.trigger('reloadEvent');
                        message.info(`新增${this.objName}成功`);
                        this.props.onClose();
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        });
    }

    doReset = () => {
        this.props.form.resetFields();
    }

    render() {
        let {visible, onClose} = this.props;
        let {getFieldDecorator} = this.props.form;

        let formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        // 读取域配置信息，转换为具体组件
        const renderFields = () => {
            return this.fieldsConfig.map(conf => {
                let options = {
                    initialValue: '',
                };

                if (true === conf.required) {
                    let rule = {
                        required: true,
                        message: `${conf.name}不可为空!`,
                    }
                    options.rules = [rule];
                }

                return (
                    <FormItem key={conf.id} label={conf.name} {...formItemLayout}>
                        {getFieldDecorator(`${conf.id}`, options)(
                            <Input />
                        )}
                    </FormItem>
                );
            })
        }

        return (
            <Modal visible={visible} title={`新增${this.objName}`} onCancel={onClose} footer={[
                <Button key="saveBtn" type="primary" onClick={this.doAdd}>保存</Button>,
                <Button key="resetBtn" onClick={this.doReset}>重置</Button>,
                <Button key="closeBtn" onClick={onClose}>取消</Button>,
            ]}>
                <Form layout="vertical">
                    {renderFields()}
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddForm);
