import getDistanceFromLatLonInKm from './distanceCalc';

const getTotalDistance = (polylines) => {
  let totalDist = 0;
  polylines.forEach((locs) => {
    let distance = 0;
    if (locs.length > 1) {
      let prevLong = locs[0]?.coords?.longitude;
      let prevLat = locs[0]?.coords?.latitude;
      locs.forEach((loc, i) => {
        if (i > 0) {
          prevLong = locs[i - 1]?.coords?.longitude;
          prevLat = locs[i - 1]?.coords?.latitude;
          distance = getDistanceFromLatLonInKm(
            prevLat, prevLong, loc?.coords?.latitude, loc?.coords?.longitude,
          ) + distance;
        }
      });
    }
    totalDist = distance + totalDist;
  });
  return totalDist;
};

export default getTotalDistance;
