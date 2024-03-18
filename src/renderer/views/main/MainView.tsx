import React from 'react';
import {
    FileOutlined,
    ControlOutlined,
    BookOutlined,
    ArrowLeftOutlined,
    WarningOutlined,
    PercentageOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import BafangUartMotorInfoView from '../panels/bafang/full/BafangUartMotorInfoView';
import BafangUartMotorSettingsView from '../panels/bafang/full/BafangUartMotorSettingsView';
import IConnection from '../../device/Connection';
import BafangUartMotor from '../../device/BafangUartMotor';
import DocumentationView from '../panels/common/DocumentationView';
import { DocPages } from '../../../docs/document_resolver';
import YamahaSystemBatteryView from '../panels/yamaha/YamahaSystemBatteryView';
import YamahaSystem from '../../device/YamahaSystem';
import YamahaSystemMotorDiagnosticsView from '../panels/yamaha/YamahaSystemMotorDiagnosticsView';
import DifficultyLevel from '../../models/DifficultyLevel';
import BafangUartMotorSettingsSimplifiedView from '../panels/bafang/simplified/BafangUartMotorSettingsSimplifiedView';

const { Sider } = Layout;

type MainProps = {
    connection: IConnection;
    difficultyLevel: DifficultyLevel;
    backHook: () => void;
};

type MainState = {
    tab: string;
};

const menuItems = {
    yamaha_system: {
        simplified: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: '1',
                icon: <ControlOutlined />,
                label: 'nav 1',
            },
        ],
        normal: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'yamaha_system_battery_info',
                icon: <PercentageOutlined />,
                label: 'Battery info',
            },
            {
                key: 'yamaha_system_motor_diagnostics',
                icon: <WarningOutlined />,
                label: 'Motor diagnostics',
            },
            {
                key: 'manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.GeneralManualDocument}`,
                        label: 'General manual',
                    },
                    {
                        key: `manual_${DocPages.YamahaParamsDocument}`,
                        label: 'Parameters',
                    },
                    {
                        key: `manual_${DocPages.YamahaDeviceAPIDocument}`,
                        label: 'Device API',
                    },
                    {
                        key: `manual_${DocPages.YamahaProtocolDocument}`,
                        label: 'UART Protocol',
                    },
                ],
            },
        ],
        pro: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: '1',
                icon: <ControlOutlined />,
                label: 'nav 1',
            },
        ],
    },
    bafang_uart_motor: {
        simplified: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'bafang_motor_settings_simplified',
                icon: <ControlOutlined />,
                label: 'Parameters',
            },
            {
                key: 'bafang_motor_manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.BafangUartMotorGeneralManualDocument}`,
                        label: 'General manual',
                    },
                    {
                        key: `manual_${DocPages.BafangUartMotorParamsSimplifiedDocument}`,
                        label: 'Parameters',
                    },
                ],
            },
        ],
        normal: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: '1',
                icon: <ControlOutlined />,
                label: 'nav 1',
            },
        ],
        pro: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'bafang_motor_info',
                icon: <FileOutlined />,
                label: 'Info',
            },
            {
                key: 'bafang_motor_settings',
                icon: <ControlOutlined />,
                label: 'Parameters',
            },
            {
                key: 'bafang_motor_manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.BafangUartMotorGeneralManualDocument}`,
                        label: 'General manual',
                    },
                    {
                        key: `manual_${DocPages.BafangUartMotorParamsDocument}`,
                        label: 'Parameters',
                    },
                    {
                        key: `manual_${DocPages.BafangUartMotorAPIDocument}`,
                        label: 'Motor Protocol',
                    },
                    {
                        key: `manual_${DocPages.BafangUartProtocolDocument}`,
                        label: 'UART Protocol',
                    },
                ],
            },
        ],
    },
    bafang_uart_display: {
        simplified: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'bafang_motor_manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.BafangUartMotorGeneralManualDocument}`,
                        label: 'General manual',
                    },
                ],
            },
        ],
        normal: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'bafang_motor_manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.BafangUartMotorGeneralManualDocument}`,
                        label: 'General manual',
                    },
                ],
            },
        ],
        pro: [
            {
                key: 'back',
                icon: <ArrowLeftOutlined />,
                label: 'Back',
            },
            {
                key: 'bafang_motor_manual',
                icon: <BookOutlined />,
                label: 'Manual',
                children: [
                    {
                        key: `manual_${DocPages.BafangUartMotorGeneralManualDocument}`,
                        label: 'General manual',
                    },
                ],
            },
        ],
    },
};

class MainView extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = {
            tab: menuItems[props.connection.deviceName][
                props.difficultyLevel
            ][1].key,
        };
        this.switchTab = this.switchTab.bind(this);
        const { connection } = this.props;
        connection.loadData();
    }

    switchTab(event: { key: string }) {
        if (event.key === 'back') {
            const { backHook } = this.props;
            backHook();
        }
        this.setState({ tab: event.key });
    }

    render() {
        const { connection, difficultyLevel } = this.props;
        const { tab } = this.state;
        return (
            <Layout hasSider>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: '20px',
                    }}
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[
                            menuItems[connection.deviceName][difficultyLevel][1]
                                .key,
                        ]}
                        items={
                            menuItems[connection.deviceName][difficultyLevel]
                        }
                        onSelect={this.switchTab}
                    />
                </Sider>
                <Layout style={{ marginLeft: 200, backgroundColor: 'white' }}>
                    {tab === 'bafang_motor_settings_simplified' && (
                        <BafangUartMotorSettingsSimplifiedView
                            connection={connection as BafangUartMotor}
                        />
                    )}
                    {tab === 'bafang_motor_info' && (
                        <BafangUartMotorInfoView
                            connection={connection as BafangUartMotor}
                        />
                    )}
                    {tab === 'bafang_motor_settings' && (
                        <BafangUartMotorSettingsView
                            connection={connection as BafangUartMotor}
                        />
                    )}
                    {tab === 'yamaha_system_battery_info' && (
                        <YamahaSystemBatteryView
                            connection={connection as YamahaSystem}
                        />
                    )}
                    {tab === 'yamaha_system_motor_diagnostics' && (
                        <YamahaSystemMotorDiagnosticsView
                            connection={connection as YamahaSystem}
                        />
                    )}
                    {tab.indexOf('manual') === 0 && (
                        <DocumentationView page={tab.substring(7)} />
                    )}
                </Layout>
            </Layout>
        );
    }
}

export default MainView;
