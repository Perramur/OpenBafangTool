import { WheelDiameterTable } from '../../constants/BafangCanConstants';
import { BesstReadedCanFrame } from '../../device/besst/besst-types';
import {
    AssistLevel,
    BafangCanBatteryCapacityData,
    BafangCanBatteryStateData,
    BafangCanControllerParameter1,
    BafangCanControllerParameter2,
    BafangCanControllerRealtime0,
    BafangCanControllerRealtime1,
    BafangCanControllerSpeedParameters,
    BafangCanDisplayData1,
    BafangCanDisplayData2,
    BafangCanDisplayRealtimeData,
    BafangCanRideMode,
    BafangCanSensorRealtime,
    SpeedSensorChannelNumber,
    SystemVoltage,
} from '../../types/BafangCanSystemTypes';
import { charsToString } from '../utils';

function decodeCurrentAssistLevel(
    currentAssistLevelCode: number,
    totalAssistLevels: number,
): AssistLevel {
    const assistLevelTable: {
        [key: number]: { [key: number]: AssistLevel };
    } = {
        3: { 0: 0, 12: 1, 2: 2, 3: 3, 6: 'walk' },
        4: { 0: 0, 1: 1, 12: 2, 21: 3, 3: 4, 6: 'walk' },
        5: { 0: 0, 11: 1, 13: 2, 21: 3, 23: 4, 3: 5, 6: 'walk' },
        9: {
            0: 0,
            1: 1,
            11: 2,
            12: 3,
            13: 4,
            2: 5,
            21: 6,
            22: 7,
            23: 8,
            3: 9,
            6: 'walk',
        },
    };
    if (
        (totalAssistLevels <= 3 || totalAssistLevels >= 5) &&
        totalAssistLevels !== 9
    ) {
        totalAssistLevels = 5;
    }
    return assistLevelTable[totalAssistLevels][currentAssistLevelCode];
}

export function parseErrorCodes(data: number[]): number[] {
    const errors: number[] = [];
    let errorString = charsToString(data);
    while (errorString.length >= 2) {
        errors.push(parseInt(errorString.substring(0, 2), 10));
        errorString = errorString.substring(2);
    }
    return errors;
}

export function parseDisplayPackage0(
    packet: BesstReadedCanFrame,
): BafangCanDisplayRealtimeData {
    return {
        assist_levels: packet.data[0] & 0b1111,
        ride_mode:
            packet.data[0] & 0b10000
                ? BafangCanRideMode.BOOST
                : BafangCanRideMode.ECO,
        boost: (packet.data[0] & 0b100000) >> 5 === 1,
        current_assist_level: decodeCurrentAssistLevel(
            packet.data[1],
            packet.data[0] & 0b1111,
        ),
        light: (packet.data[2] & 1) === 1,
        button: (packet.data[2] & 0b10) >> 1 === 1,
    };
}

export function parseDisplayPackage1(
    packet: BesstReadedCanFrame,
): BafangCanDisplayData1 {
    return {
        total_mileage:
            (packet.data[2] << 16) + (packet.data[1] << 8) + packet.data[0],
        single_mileage:
            ((packet.data[5] << 16) + (packet.data[4] << 8) + packet.data[3]) /
            10,
        max_speed: ((packet.data[7] << 8) + packet.data[6]) / 10,
    };
}

export function parseDisplayPackage2(
    packet: BesstReadedCanFrame,
): BafangCanDisplayData2 {
    return {
        average_speed: ((packet.data[1] << 8) + packet.data[0]) / 10,
        service_mileage:
            ((packet.data[4] << 16) + (packet.data[3] << 8) + packet.data[2]) /
            10,
    };
}

export function parseControllerPackage0(
    packet: BesstReadedCanFrame,
): BafangCanControllerRealtime0 {
    const tmp = (packet.data[7] << 8) + packet.data[6];
    return {
        remaining_capacity: packet.data[0],
        single_trip: ((packet.data[2] << 8) + packet.data[1]) / 100,
        cadence: packet.data[3],
        torque: (packet.data[5] << 8) + packet.data[4],
        remaining_distance: tmp < 65535 ? tmp / 100 : -255,
    };
}

export function parseControllerPackage1(
    packet: BesstReadedCanFrame,
): BafangCanControllerRealtime1 {
    return {
        speed: ((packet.data[1] << 8) + packet.data[0]) / 100,
        current: ((packet.data[3] << 8) + packet.data[2]) / 100,
        voltage: ((packet.data[5] << 8) + packet.data[4]) / 100,
        temperature: packet.data[6] - 40,
        motor_temperature: packet.data[7] === 255 ? -255 : packet.data[7] - 40,
    };
}

export function parseControllerPackage3(
    packet: BesstReadedCanFrame,
): BafangCanControllerSpeedParameters | null {
    const diameter = WheelDiameterTable.find(
        (item) =>
            item.code[0] === packet.data[2] && item.code[1] === packet.data[3],
    );
    if (diameter)
        return {
            speed_limit: ((packet.data[1] << 8) + packet.data[0]) / 100,
            wheel_diameter: diameter,
            circumference: (packet.data[5] << 8) + packet.data[4],
        };
    return null;
}

export function parseControllerParameter1( // TODO add checksum
    packet: BesstReadedCanFrame,
): BafangCanControllerParameter1 | null {
    const pkg: BafangCanControllerParameter1 = {
        system_voltage: packet.data[0] as SystemVoltage,
        current_limit: packet.data[1],
        overvoltage: packet.data[2],
        undervoltage: packet.data[3],
        undervoltage_under_load: packet.data[4],
        battery_recovery_voltage: packet.data[5],
        battery_capacity: (packet.data[8] << 8) + packet.data[7],
        max_current_on_low_charge: packet.data[9],
        full_capacity_range: packet.data[12],
        pedal_sensor_type: packet.data[13],
        coaster_brake: packet.data[14] === 1,
        pedal_sensor_signals_per_rotation: packet.data[15],
        speed_sensor_channel_number: packet
            .data[16] as SpeedSensorChannelNumber,
        motor_type: packet.data[18],
        motor_pole_pair_number: packet.data[19],
        speedmeter_magnets_number: packet.data[20],
        temperature_sensor_type: packet.data[21],
        deceleration_ratio: ((packet.data[23] << 8) + packet.data[22]) / 100,
        motor_max_rotor_rpm: (packet.data[25] << 8) + packet.data[24],
        motor_d_axis_inductance: (packet.data[27] << 8) + packet.data[26],
        motor_q_axis_inductance: (packet.data[29] << 8) + packet.data[28],
        motor_phase_resistance: (packet.data[31] << 8) + packet.data[30],
        motor_reverse_potential_coefficient:
            (packet.data[33] << 8) + packet.data[32],
        throttle_start_voltage: packet.data[34] / 10,
        throttle_max_voltage: packet.data[35] / 10,
        start_current: packet.data[37],
        current_loading_time: packet.data[38] / 10,
        current_shedding_time: packet.data[39] / 10,
        assist_levels: [],
        displayless_mode: packet.data[58] === 1,
        lamps_always_on: packet.data[59] === 1,
    };
    for (let i = 0; i < 9; i++) {
        pkg.assist_levels.push({
            current_limit: packet.data[40 + i],
            speed_limit: packet.data[49 + i],
        });
    }
    return pkg;
}

export function parseControllerParameter2( // TODO add checksum
    packet: BesstReadedCanFrame,
): BafangCanControllerParameter2 | null {
    const pkg: BafangCanControllerParameter2 = {
        torque_profiles: [],
    };
    for (let i = 0; i <= 5; i++) {
        pkg.torque_profiles.push({
            start_torque_value: packet.data[0 + i],
            max_torque_value: packet.data[6 + i],
            return_torque_value: packet.data[12 + i],
            min_current: packet.data[24 + i],
            max_current: packet.data[18 + i],
            start_pulse: packet.data[36 + i],
            current_decay_time: packet.data[42 + i] * 5,
            stop_delay: packet.data[48 + i] * 2,
        });
    }
    return pkg;
}

export function parseSensorPackage(
    packet: BesstReadedCanFrame,
): BafangCanSensorRealtime {
    return {
        torque: (packet.data[1] << 8) + packet.data[0],
        cadence: packet.data[2],
    };
}

export function parseCellsPackage(
    packet: BesstReadedCanFrame,
    cells_arr: number[],
): void {
    for (let i = 0; i < packet.data.length / 2; i++) {
        cells_arr[(packet.canCommandSubCode - 2) * 4 + i] =
            ((packet.data[i * 2 + 1] << 8) + packet.data[i * 2]) / 1000;
    }
}

export function parseCapacityPackage(
    packet: BesstReadedCanFrame,
): BafangCanBatteryCapacityData {
    return {
        full_capacity: (packet.data[1] << 8) + packet.data[0],
        capacity_left: (packet.data[3] << 8) + packet.data[2],
        rsoc: packet.data[4],
        asoc: packet.data[5],
        soh: packet.data[6],
    };
}

export function parseStatePackage(
    packet: BesstReadedCanFrame,
): BafangCanBatteryStateData {
    let tmp = (packet.data[1] << 8) + packet.data[0];
    if ((tmp & 32768) > 0) {
        tmp = 65536 - tmp;
    }
    return {
        current: tmp,
        voltage: ((packet.data[3] << 8) + packet.data[2]) * 10,
        temperature: packet.data[4] - 40,
    };
}