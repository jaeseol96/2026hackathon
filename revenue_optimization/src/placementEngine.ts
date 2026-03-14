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
        const placementEndTime = startTime + ad.duration;

        return (
            startTime >= ad.timeReceived
            && startTime <= ad.timeReceived + ad.timeout
            && placementEndTime <= area.timeWindow
        );
    }

    isAdAlreadyScheduled(adId: string, schedule: Schedule): boolean {
        for (const areaSchedule of Object.values(schedule)) {
            for (const scheduledAd of areaSchedule) {
                if (scheduledAd.adId === adId) {
                    return true;
                }
            }
        }

        return false;
    }

    canScheduleAd(
        ad: Ad,
        area: Area,
        schedule: Schedule,
        startTime: number
    ): boolean {
        if (!this.isAdCompatibleWithArea(ad, area)) {
            return false;
        }
        if (this.isAdAlreadyScheduled(ad.adId, schedule)) {
            return false;
        }
        if (!this.doesPlacementFitTimingConstraints(ad, area, startTime)) {
            return false;
        }

        const areaSchedule = schedule[area.areaId] ?? [];
        const placementEndTime = startTime + ad.duration;

        for (const scheduledAd of areaSchedule) {
            const overlapsExisting =
                startTime < scheduledAd.endTime
                && placementEndTime > scheduledAd.startTime;
            if (overlapsExisting) {
                return false;
            }
        }

        return true;
    }

    isAreaScheduleValid(area: Area, areaSchedule: ScheduledAd[], ads: Ad[]): boolean {
        const adById: Record<string, Ad> = {};
        for (const ad of ads) {
            adById[ad.adId] = ad;
        }

        for (const scheduledAd of areaSchedule) {
            const ad = adById[scheduledAd.adId];
            if (!ad) {
                return false;
            }
            if (scheduledAd.areaId !== area.areaId) {
                return false;
            }

            const scheduledDuration = scheduledAd.endTime - scheduledAd.startTime;
            if (scheduledDuration !== ad.duration) {
                return false;
            }
            if (!this.isAdCompatibleWithArea(ad, area)) {
                return false;
            }
            if (!this.doesPlacementFitTimingConstraints(ad, area, scheduledAd.startTime)) {
                return false;
            }
        }

        const sortedSchedule = [...areaSchedule].sort((a, b) => a.startTime - b.startTime);
        for (let i = 1; i < sortedSchedule.length; i++) {
            if (sortedSchedule[i].startTime < sortedSchedule[i - 1].endTime) {
                return false;
            }
        }

        return true;
    }
}