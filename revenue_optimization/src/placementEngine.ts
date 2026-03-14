export interface Ad {
    adId: string;
    advertiserId: string;
    timeReceived: number;
    timeout: number;
    duration: number;
    baseRevenue: number;
    bannedLocations: string[];
}

export interface Area {
    areaId: string;
    location: string;
    multiplier: number;
    totalScreens: number;
    timeWindow: number;
}

export interface ScheduledAd {
    adId: string;
    areaId: string;
    startTime: number;
    endTime: number;
}

export type Schedule = Record<string, ScheduledAd[]>;

export class PlacementEngine {

    constructor() {
    }

    isAdCompatibleWithArea(ad: Ad, area: Area): boolean {
        var compatible = true;
        for (const location of ad.bannedLocations) {
            if (location === area.location) {
                compatible = false;
            }
        }
        if (ad.duration > area.timeWindow) {
            compatible = false;
        }
        return compatible;
    }

    getTotalScheduledTimeForArea(areaSchedule: ScheduledAd[]): number {
        let sum: number = 0;
        for (const sched of areaSchedule) {
            sum += sched.endTime - sched.startTime;
        }

        return sum;
    }

    doesPlacementFitTimingConstraints(
        ad: Ad,
        area: Area,
        startTime: number
    ): boolean {
        return (!(startTime < ad.timeReceived)
            && (startTime + ad.duration < ad.timeout)
            && (startTime - ad.timeReceived <= ad.timeout)
            && (ad.duration <= area.timeWindow));
    }

    isAdAlreadyScheduled(adId: string, schedule: Schedule): boolean {
        return false;
    }

    canScheduleAd(
        ad: Ad,
        area: Area,
        schedule: Schedule,
        startTime: number
    ): boolean {
        return false;
    }

    isAreaScheduleValid(area: Area, areaSchedule: ScheduledAd[], ads: Ad[]): boolean {
        return false;
    }
}