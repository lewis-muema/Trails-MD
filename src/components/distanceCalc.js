export default () => {
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in m
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

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

  const getTotalTime = (polylines) => {
    let totalTime = 0;
    polylines.forEach((locs) => {
      if (locs.length > 1) {
        const firstTime = locs[0]?.timestamp;
        const lastTime = locs[locs.length - 1]?.timestamp;
        totalTime = (lastTime - firstTime) + totalTime;
      }
    });
    return totalTime;
  };

  const getPolylines = (locations) => {
    const arr = [];
    locations.forEach((location) => {
      const index = location.index - 1;
      arr[index] ? arr.splice(index, 1, [...arr[index], location])
        : arr.splice(index, 0, [location]);
    });
    return arr;
  };

  const centerOfMap = (locations, zoom) => {
    const longitudes = [];
    const latitudes = [];
    const lastIndex = locations.length - 1;
    locations.forEach((location) => {
      longitudes.push(location.coords.longitude);
      latitudes.push(location.coords.latitude);
    });
    longitudes.sort((a, b) => { return a - b; });
    latitudes.sort((a, b) => { return a - b; });
    const distance = getDistanceFromLatLonInKm(
      latitudes[0], longitudes[0], latitudes[lastIndex], longitudes[lastIndex],
    );
    const centerCoordinates = {
      ...locations[0].coords,
      longitude: (longitudes[lastIndex] + longitudes[0]) / 2,
      latitude: (latitudes[lastIndex] + latitudes[0]) / 2,
      latitudeDelta: (zoom / 750) * distance,
      longitudeDelta: (zoom / 750) * distance,
    };
    return centerCoordinates;
  };

  return {
    getDistanceFromLatLonInKm,
    getTotalDistance,
    getPolylines,
    centerOfMap,
    getTotalTime,
  };
};
