import React from 'react';
import { Typography, Descriptions, Button, List } from 'antd';
import type { DescriptionsProps } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import YamahaSystem from '../../../device/YamahaSystem';

type DiagnosticsProps = {
    connection: YamahaSystem;
};

type DiagnosticsState = { lastUpdateTime: number }; //BafangUartMotorInfo & ;

class YamahaSystemMotorDiagnosticsView extends React.Component<
    DiagnosticsProps,
    DiagnosticsState
> {
    constructor(props: any) {
        super(props);
        const { connection } = this.props;
        this.state = {
            lastUpdateTime: 0,
        };
        this.getSensorItems = this.getSensorItems.bind(this);
        this.getFunctionCheckItems = this.getFunctionCheckItems.bind(this);
        this.getErrorCodeItems = this.getErrorCodeItems.bind(this);
        this.updateData = this.updateData.bind(this);
        connection.emitter.on('data', this.updateData);
    }

    getSensorItems(): DescriptionsProps['items'] {
        return [
            {
                key: 'speed_sensor',
                label: 'Speed sensor',
                children: '0 times',
            },
            {
                key: 'motor_output_current',
                label: 'Motor output current',
                children: '0%',
            },
            {
                key: 'torque_sensor',
                label: 'Torque sensor',
                children: '0.0V',
            },
        ];
    }

    getFunctionCheckItems(): DescriptionsProps['items'] {
        return [
            {
                key: 'motor_rotation_check',
                label: 'Motor rotation check',
                children: <Button type="primary">Start</Button>,
            },
            {
                key: 'display_function_check',
                label: 'Display function check',
                children: <Button type="primary">Start</Button>,
            },
        ];
    }

    getErrorCodeItems() {
        return [
            {
                name: 'Code 1',
                description: 'Sample error',
            },
            {
                name: 'Code 2',
                description: 'Sample error',
            },
            {
                name: 'Code 3',
                description: 'Sample error',
            },
        ];
    }

    updateData(): void {
        this.setState({ lastUpdateTime: Date.now() });
    }

    render() {
        return (
            <div style={{ margin: '36px' }}>
                <Typography.Title level={2} style={{ margin: 0 }}>
                    Motor and display diagnostics
                </Typography.Title>
                <br />
                <Descriptions
                    bordered
                    title="Sensors"
                    items={this.getSensorItems()}
                    column={1}
                    style={{ marginBottom: '20px' }}
                />
                <Descriptions
                    bordered
                    title="Function check"
                    items={this.getFunctionCheckItems()}
                    column={1}
                    style={{ marginBottom: '20px' }}
                />
                <Typography.Title level={5} style={{ marginBottom: '20px' }}>
                    Error codes
                </Typography.Title>
                <List
                    bordered
                    dataSource={this.getErrorCodeItems()}
                    style={{ marginBottom: '20px' }}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.name}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
                <Button type="primary" icon={<ClearOutlined />}>
                    Erase error codes
                </Button>
            </div>
        );
    }
}

export default YamahaSystemMotorDiagnosticsView;
