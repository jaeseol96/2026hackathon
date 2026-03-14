import { DeviceManager, Device } from './deviceManager';
import { UserManager, User } from './userManager';

export class FleetManager {
    deviceManager: DeviceManager;
    userManager: UserManager;

    constructor(deviceManager: DeviceManager, userManager: UserManager) {
        this.deviceManager = deviceManager;
        this.userManager = userManager;
    }

    addUser(user: User): void {
        return this.userManager.addUser(user);
    }

    removeUser(id: string): void {
        if (!this.userManager.getUser(id)) {
            throw new Error(`User with id ${id} not found`);
        }

        const toRemove = this.deviceManager
            .getAllDevices()
            .filter((device) => device.user_id === id);

        for (const device of toRemove) {
            this.deviceManager.removeDevice(device.id);
        }

        this.userManager.removeUser(id);
    }

    getUser(id: string): User | null {
        return this.userManager.getUser(id) ?? null;
    }

    addDevice(device: Device): void {
        if (!this.userManager.getUser(device.user_id)) {
            throw new Error(`Cannot add device: User with id ${device.user_id} not found`);
        }

        this.deviceManager.addDevice(device);
    }

    removeDevice(id: string): void {
        return this.deviceManager.removeDevice(id);
    }

    getDevice(id: string): Device | null {
        return this.deviceManager.getDevice(id) ?? null;
    }

    getUserDevices(userId: string): Device[] {
        return this.deviceManager.getDevicesByUserId(userId) ?? [];
    }

    getUserCount(): number {
        return this.userManager.getUserCount();
    }

    getDeviceCount(): number {
        return this.deviceManager.getDeviceCount();
    }
}

export { DeviceManager, Device } from './deviceManager';
export { UserManager, User } from './userManager';
