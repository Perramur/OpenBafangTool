import NotFound from '../../docs/inner-pages/404.md';
import Test from '../../docs/inner-pages/Test page.md';
import BafangUartProtocol from '../../docs/Bafang UART protocol.md';
import BafangUartMotorAPI from '../../docs/Bafang UART motor API.md';
import BafangUartMotorParameters from '../../docs/Bafang UART motor parameters.md';
import GeneralManual from '../../docs/General manual.md';

export enum DocPages {
    BafangUartMotorGeneralManualDocument = 'bafang_uart_motor_general_manual',
    BafangUartMotorParamsDocument = 'bafang_uart_motor_parameters',
    BafangUartMotorAPIDocument = 'bafang_uart_motor_api',
    BafangUartProtocolDocument = 'bafang_uart_protocol',
    YamahaGeneralManualDocument = 'yamaha_system_general_manual',
    YamahaParamsDocument = 'yamaha_system_parameters',
    YamahaDeviceAPIDocument = 'yamaha_system_api',
    YamahaProtocolDocument = 'yamaha_system_protocol',
    TestPage = 'test_page',
}

export function getDocumentById(id: string): string {
    switch (id) {
        case DocPages.BafangUartProtocolDocument:
            return BafangUartProtocol;
        case DocPages.BafangUartMotorAPIDocument:
            return BafangUartMotorAPI;
        case DocPages.BafangUartMotorParamsDocument:
            return BafangUartMotorParameters;
        case DocPages.BafangUartMotorGeneralManualDocument:
            return GeneralManual;
        case DocPages.YamahaGeneralManualDocument:
        case DocPages.YamahaParamsDocument:
        case DocPages.YamahaDeviceAPIDocument:
        case DocPages.YamahaProtocolDocument:
        case DocPages.TestPage:
            return Test;
        default:
            return NotFound;
    }
}
