/* eslint-disable prefer-destructuring */
import EventEmitter from 'events';
import { DeviceName } from '../models/DeviceType';
import IConnection from './Connection';

export default class YamahaSystem implements IConnection {
    private port: string;

    readonly deviceName: DeviceName = DeviceName.YamahaSystem;

    public emitter: EventEmitter;

    constructor(port: string) {
        this.port = port;
        this.emitter = new EventEmitter();
        this.loadData = this.loadData.bind(this);
    }

    connect(): Promise<boolean> {
        if (this.port === 'simulator' || true) {
            console.log('Simulator connected');
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        }
    }

    disconnect(): void {
        if (this.port === 'simulator' || true) {
            console.log('Simulator disconnected');
        }
    }

    testConnection(): Promise<boolean> {
        if (this.port === 'simulator' || true) {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        }
    }

    loadData(): void {
        if (this.port === 'simulator' || true) {
            setTimeout(() => this.emitter.emit('data'), 300);
        }
    }

    saveData(): boolean {
        return false;
    }
}
