/**
 * CHALLENGE 1: Single Technician — Shortest Route
 *
 * A technician starts at a known GPS location and must visit every broken
 * box exactly once. Your goal is to find the shortest possible total travel
 * distance.
 *
 * Scoring:
 *   - Correctness  — every box visited exactly once, distance is accurate.
 *   - Route quality — your total distance is compared against other teams;
 *                     shorter routes score higher on the load tests.
 *
 * Do NOT modify any interface or the pre-implemented helper methods.
 * Implement every method marked with TODO.
 */

export interface Location {
  latitude: number; // decimal degrees
  longitude: number; // decimal degrees
}

export interface Box {
  id: string;
  name: string;
  location: Location;
}

export interface Technician {
  id: string;
  name: string;
  startLocation: Location;
}

export interface RouteResult {
  technicianId: string;
  /** Ordered list of box IDs. Every box must appear exactly once. */
  route: string[];
  /** Total travel distance in km. Does NOT include a return leg to start. */
  totalDistanceKm: number;
}

export class RouteOptimizer {
  // ── Pre-implemented helper — do not modify ────────────────────────────────

  /**
   * Returns the great-circle distance in kilometres between two GPS
   * coordinates using the Haversine formula (Earth radius = 6 371 km).
   */
  haversineDistance(loc1: Location, loc2: Location): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLng = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ── Your implementation below ─────────────────────────────────────────────

  calculateRouteDistance(
    technician: Technician,
    boxes: Box[],
    routeIds: string[],
  ): number | null {
    let distance: number = 0;
    let currLocation: Location = technician.startLocation;

    if (routeIds.length === 0) {
      return 0;
    }

    for (let i = 0; i < routeIds.length; i++) {
      const boxId = routeIds[i];
      let box = null;
      for (let j = 0; j < boxes.length; j++) {
        if (boxes[j].id === boxId) {
          box = boxes[j];
          break;
        }
      }
      if (box === null) {
        return null; // invalid data
      }
      distance = distance + this.haversineDistance(currLocation, box.location);
      currLocation = box.location;
    }

    return distance;
  }

  findShortestRoute(technician: Technician, boxes: Box[]): RouteResult {
    // no boxes
    if (boxes.length === 0) {
      return {
        technicianId: technician.id,
        route: [],
        totalDistanceKm: 0,
      };
    }

    let self = this;
    let minDist: number = Number.MAX_VALUE;
    let bestRoute: string[] = [];

    dfs.call(self, technician.startLocation, new Set(), [], 0);

    return {
      technicianId: technician.id,
      route: bestRoute,
      totalDistanceKm: minDist,
    };

    // depth first search to find best route
    function dfs(
      currLocation: Location,
      visited: Set<string>, // tabulation
      currentRoute: string[],
      currentDist: number,
    ) {
      // base case: all boxes visited
      if (visited.size === boxes.length) {
        if (currentDist < minDist) {
          minDist = currentDist;
          bestRoute = [...currentRoute];
        }
        return;
      }

      // recursive case: try each unvisited box
      for (let box of boxes) {
        if (!visited.has(box.id)) {
          const newDist =
            currentDist + self.haversineDistance(currLocation, box.location);

          visited.add(box.id);
          currentRoute.push(box.id);

          dfs.call(self, box.location, visited, currentRoute, newDist);

          currentRoute.pop();
          visited.delete(box.id);
        }
      }
    }
  }
}
