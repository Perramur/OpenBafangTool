import React from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
    Button,
    Checkbox,
    Form,
    Select,
    Typography,
    Space,
    message,
} from 'antd';
import IConnection from '../../device/Connection';
import BafangUartMotor from '../../device/BafangUartMotor';
import {
    DeviceBrand,
    DeviceInterface,
    DeviceType,
} from '../../models/DeviceType';
import DifficultyLevel from '../../models/DifficultyLevel';
import YamahaSystem from '../../device/YamahaSystem';

const { Option } = Select;

type DeviceSelectionProps = {
    deviceSelectionHook: (
        connection: IConnection,
        difficulty_level: DifficultyLevel,
    ) => void;
};

type DeviceSelectionState = {
    portList: string[];
    connectionChecked: boolean;
    connection: IConnection | null;
    difficultyLevel: DifficultyLevel | null;
    deviceBrand: DeviceBrand | null;
    deviceInterface: DeviceInterface | null;
    deviceType: DeviceType | null;
    devicePort: string | null;
    localLawsAgreement: boolean | null;
    disclaimerAgreement: boolean | null;
};

class DeviceSelectionView extends React.Component<
    DeviceSelectionProps,
    DeviceSelectionState
> {
    constructor(props: DeviceSelectionProps) {
        super(props);
        this.state = {
            portList: [],
            connectionChecked: false,
            connection: null,
            difficultyLevel: null,
            deviceBrand: null,
            deviceInterface: null,
            deviceType: null,
            devicePort: null,
            localLawsAgreement: false,
            disclaimerAgreement: false,
        };

        setInterval(() => {
            window.electron.ipcRenderer.sendMessage('list-serial-ports', []);

            window.electron.ipcRenderer.once('list-serial-ports', (arg) => {
                this.setState({ portList: arg as string[] });
            });
        }, 1000);
    }

    render() {
        const { deviceSelectionHook } = this.props;
        const {
            portList,
            connectionChecked,
            connection,
            difficultyLevel,
            deviceBrand,
            deviceInterface,
            deviceType,
            devicePort,
        } = this.state;

        const portComponents = portList.map((item) => {
            return (
                <Option value={item} key={item}>
                    {item}
                </Option>
            );
        });

        return (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Form
                    name="device-selection"
                    onFinish={() => {
                        deviceSelectionHook(
                            connection as IConnection,
                            difficultyLevel as DifficultyLevel,
                        );
                    }}
                >
                    <Typography.Title level={3}>Select device</Typography.Title>
                    <Form.Item
                        name="device_brand"
                        label="Device brand"
                        rules={[
                            {
                                required: true,
                                message: 'Device brand is required',
                            },
                        ]}
                    >
                        <Select
                            onChange={(value: DeviceBrand) => {
                                this.setState({
                                    deviceBrand: value,
                                    connectionChecked: false,
                                });
                            }}
                            allowClear
                            style={{ minWidth: '150px' }}
                        >
                            <Option value={DeviceBrand.Bafang}>Bafang</Option>
                            <Option value={DeviceBrand.Yamaha}>Yamaha</Option>
                        </Select>
                    </Form.Item>
                    {deviceBrand == DeviceBrand.Bafang && (
                        <Form.Item
                            name="device_interface"
                            label="Device interface"
                            rules={[
                                {
                                    required: true,
                                    message: 'Device interface is required',
                                },
                            ]}
                        >
                            <Select
                                onChange={(value: DeviceInterface) => {
                                    this.setState({
                                        deviceInterface: value,
                                        connectionChecked: false,
                                    });
                                }}
                                allowClear
                                style={{ minWidth: '150px' }}
                            >
                                <Option value={DeviceInterface.UART}>
                                    UART
                                </Option>
                                <Option value={DeviceInterface.CAN} disabled>
                                    CAN - not yet supported
                                </Option>
                            </Select>
                        </Form.Item>
                    )}
                    {deviceBrand === DeviceBrand.Bafang &&
                        deviceInterface === DeviceInterface.UART && (
                            <Form.Item
                                name="device_type"
                                label="Device type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Device type is required',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(value: DeviceType) => {
                                        this.setState({
                                            deviceType: value,
                                            connectionChecked: false,
                                        });
                                    }}
                                    allowClear
                                    style={{ minWidth: '150px' }}
                                >
                                    <Option value={DeviceType.Motor}>
                                        Motor
                                    </Option>
                                    <Option value={DeviceType.Display} disabled>
                                        Display - not yet supported
                                    </Option>
                                </Select>
                            </Form.Item>
                        )}
                    {deviceBrand === DeviceBrand.Bafang &&
                        deviceInterface === DeviceInterface.UART &&
                        deviceType === DeviceType.Motor && (
                            <Form.Item
                                name="difficulty_level"
                                label="Interface type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Interface type is required',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(value: DifficultyLevel) => {
                                        this.setState({
                                            difficultyLevel: value,
                                            connectionChecked: false,
                                        });
                                    }}
                                    allowClear
                                    style={{ minWidth: '150px' }}
                                >
                                    <Option value={DifficultyLevel.Simplified}>
                                        Simplified
                                    </Option>
                                    <Option value={DifficultyLevel.Pro}>
                                        Full
                                    </Option>
                                </Select>
                            </Form.Item>
                        )}
                    {(deviceBrand == DeviceBrand.Yamaha ||
                        (deviceBrand == DeviceBrand.Bafang &&
                            deviceInterface == DeviceInterface.UART)) && (
                        <Form.Item
                            name="port"
                            label="Serial port"
                            rules={[
                                {
                                    required: true,
                                    message: 'Serial port is required',
                                },
                            ]}
                        >
                            <Select
                                onChange={(value: string) => {
                                    this.setState({
                                        devicePort: value,
                                        connectionChecked: false,
                                    });
                                }}
                                allowClear
                                style={{ minWidth: '150px' }}
                            >
                                <Option value="simulator">Simulator</Option>
                                {portComponents}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item
                        name="local_laws_agreement"
                        label=""
                        initialValue={false}
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error(
                                                  'You should obey the law',
                                              ),
                                          ),
                            },
                        ]}
                    >
                        <Checkbox
                            onChange={(value: CheckboxChangeEvent) => {
                                this.setState({
                                    localLawsAgreement: value.target.checked,
                                });
                            }}
                            style={{ fontSize: '12px' }}
                        >
                            I checked local laws and regulations and
                            <br />
                            will not use this program to violate them
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="disclaimer_agreement"
                        label=""
                        initialValue={false}
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              new Error(
                                                  'Developer does not carry any responsibility',
                                              ),
                                          ),
                            },
                        ]}
                    >
                        <Checkbox
                            onChange={(value: CheckboxChangeEvent) => {
                                this.setState({
                                    disclaimerAgreement: value.target.checked,
                                });
                            }}
                            style={{ fontSize: '12px' }}
                        >
                            I understand, that developer of this software
                            <br />
                            do not care responsibility for any consequences
                            <br />
                            of changing configuration of e-bike or any other
                            device
                            <span style={{ color: 'red' }}>&nbsp;*</span>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => {
                                    let newConnection: IConnection;
                                    if (
                                        deviceBrand === DeviceBrand.Bafang &&
                                        deviceInterface ===
                                            DeviceInterface.UART &&
                                        deviceType === DeviceType.Motor &&
                                        devicePort !== null
                                    ) {
                                        newConnection = new BafangUartMotor(
                                            devicePort,
                                        );
                                    } else if (
                                        deviceBrand === DeviceBrand.Yamaha &&
                                        devicePort !== null
                                    ) {
                                        newConnection = new YamahaSystem(
                                            devicePort,
                                        );
                                    } else {
                                        message.info(
                                            'This kind of device is not supported yet',
                                        );
                                        return;
                                    }
                                    newConnection
                                        .testConnection()
                                        .then((result) => {
                                            if (result) {
                                                this.setState({
                                                    connection: newConnection,
                                                });
                                            } else {
                                                message.error(
                                                    'Connection error!',
                                                );
                                            }
                                            this.setState({
                                                connectionChecked: result,
                                            });
                                            return null;
                                        })
                                        .catch(() => {
                                            this.setState({
                                                connectionChecked: false,
                                            });
                                            message.error('Connection error!');
                                        });
                                }}
                                disabled={
                                    deviceBrand === null ||
                                    devicePort === null ||
                                    (deviceBrand === DeviceBrand.Bafang &&
                                        (deviceInterface === null ||
                                            deviceType === null ||
                                            difficultyLevel === null))
                                }
                            >
                                Check connection
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!connectionChecked}
                            >
                                Select
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default DeviceSelectionView;
