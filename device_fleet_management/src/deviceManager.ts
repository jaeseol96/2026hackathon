export interface Device {
    id: string;
    name: string;
    version: string;
    user_id: string;
    status: 'active' | 'inactive';
    location: {
        latitude: number;
        longitude: number;
    };
}

export class DeviceManager {
    private devices: Map<string, Device>;
    private count: number;
    // constructor, gets called when a new instance of the class is created
    constructor() {
        this.devices = new Map<string, Device>;
        this.count = 0;
    }

    addDevice(device: Device): void {
        if (!device || !device.id || device.id.trim() === '') {
            throw new Error("Device must have an id");
        } else if (this.devices.has(device.id)) {
            throw new Error(`Device with id ${device.id} already exists`);
        }

        this.devices.set(device.id, device);
        this.count ++;
    }

    removeDevice(id: string): void {
        if (id.trim() === '') {
            throw new Error("Device must have an id");

        } else if (!this.devices.has(id)) {
            throw new Error(`Device with id ${id} not found`);
        }

        this.devices.delete(id);
        this.count --;
    }

    getDevice(id: string): Device | null {
      return this.devices.get(id) ?? null;
    }

    getDevicesByVersion(version: string): Device[] | null {
        const matches = Array.from(this.devices.values()).filter((d) => d.version === version);
        return matches.length ? matches : [];
    }

    getDevicesByUserId(user_id: string): Device[] | null {
        const matches = Array.from(this.devices.values()).filter((d) => d.user_id === user_id);
        return matches.length ? matches : [];
    }

    getDevicesByStatus(status: 'active' | 'inactive' | 'pending' | 'failed'): Device[] | null {
        const matches = Array.from(this.devices.values()).filter((d) => d.status === status);
        return matches.length ? matches : [];
    }

    getDevicesInArea(latitude: number, longitude: number, radius_km: number): Device[] | null {
        return Array.from(this.devices.values()).filter((device) => {
            const distance = this.getDistanceKm(
                latitude,
                longitude,
                device.location.latitude,
                device.location.longitude
            );
            return distance <= radius_km;
        });
    }

    getDevicesNearDevice(device_id: string, radius_km: number): Device[] | null {
        const sourceDevice = this.getDevice(device_id);
        if (!sourceDevice) {
            return null;
        }

        const { latitude, longitude } = sourceDevice.location;

        return Array.from(this.devices.values())
            .filter((device) => {
                const distance = this.getDistanceKm(
                    latitude,
                    longitude,
                    device.location.latitude,
                    device.location.longitude
                );
            return device.id !== device_id && distance <= radius_km});
    }

    getAllDevices(): Device[] {
        return [...this.devices.values()];
    }

    getDeviceCount(): number {
        return this.count;
    }

    getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371; // Earth's radius in km

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
