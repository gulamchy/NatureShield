// import * as Location from "expo-location";

// export async function getReadableLocationAndTime() {
//   try {
//     // 1. Ask for permission
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       throw new Error("Location permission not granted");
//     }

//     // 2. Get GPS coordinates
//     const location = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = location.coords;

//     // 3. Convert to readable location (reverse geocoding)
//     const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

//     // 4. Format location name (e.g., City, Region, Country)
//     const locationName = `${place.city || place.name}, ${place.region}, ${place.country}`;

//     // 5. Get current date/time
//     const now = new Date();
//     const timestamp = now.toISOString();

//     return {
//       locationName,
//       timestamp,
//     };
//   } catch (error) {
//     console.error("Error getting location name/time:", error);
//     return null;
//   }
// }


import * as Location from "expo-location";

export async function getReadableLocationAndTime() {
  try {
    // 1. Ask for permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    // 2. Get GPS coordinates
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // 3. Convert to readable location (reverse geocoding)
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

    // 4. Format location name
    const locationName = `${place.city || place.name}, ${place.region}, ${place.country}`;

    // 5. Format current date as MM-DD-YYYY
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;

    return {
      locationName,
      timestamp: formattedDate,
    };
  } catch (error) {
    console.error("Error getting location name/time:", error);
    return null;
  }
}
