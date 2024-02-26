import React from 'react';
import { Typography, Descriptions, FloatButton, message } from 'antd';
import type { DescriptionsProps } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import YamahaSystem from '../../../device/YamahaSystem';

type InfoProps = {
    connection: YamahaSystem;
};

type InfoState = { lastUpdateTime: number }; //BafangUartMotorInfo & ;

class YamahaSystemBatteryView extends React.Component<InfoProps, InfoState> {
    constructor(props: any) {
        super(props);
        const { connection } = this.props;
        this.state = {
            lastUpdateTime: 0,
        };
        this.getBatteryItems = this.getBatteryItems.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        connection.emitter.on('data', this.updateInfo);
    }

    getBatteryItems(): DescriptionsProps['items'] {
        return [
            {
                key: 'battery_voltage',
                label: 'Battery voltage',
                children: '0.0V',
            },
            {
                key: 'battery_temperature',
                label: 'Battery temperature',
                children: '0.0°C',
            },
            {
                key: 'residual_capacity',
                label: 'Residual capacity',
                children: '100%',
            },
            {
                key: 'days_since_first_chage',
                label: 'Days since first charge',
                children: '1000',
            },
            {
                key: 'charging_cycles_number',
                label: 'Number of charging cycles',
                children: '4',
            },
            {
                key: 'charging_cycles_number_0_24',
                label: 'Number of charging cycles started from 0-24%',
                children: '1',
            },
            {
                key: 'charging_cycles_number_25_49',
                label: 'Number of charging cycles started from 25-49%',
                children: '1',
            },
            {
                key: 'charging_cycles_number_50_74',
                label: 'Number of charging cycles started from 50-74%',
                children: '1',
            },
            {
                key: 'charging_cycles_number_75_100',
                label: 'Number of charging cycles started from 75-100%',
                children: '1',
            },
        ];
    }

    updateInfo(): void {
        this.setState({ lastUpdateTime: Date.now() });
    }

    render() {
        return (
            <div style={{ margin: '36px' }}>
                <Typography.Title level={2} style={{ margin: 0 }}>
                    Battery info
                </Typography.Title>
                <br />
                <Descriptions
                    bordered
                    items={this.getBatteryItems()}
                    column={1}
                    style={{ marginBottom: '20px' }}
                />
                <FloatButton
                    icon={<SyncOutlined />}
                    type="primary"
                    style={{ right: 24 }}
                    onClick={() => {}}
                />
            </div>
        );
    }
}

export default YamahaSystemBatteryView;
