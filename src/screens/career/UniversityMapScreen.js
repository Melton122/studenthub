import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function UniversityMapScreen({ route }) {
  const { university } = route.params || {};
  // In a real app, you would have coordinates. Here we use a default location (Cape Town).
  const region = {
    latitude: -33.9249,
    longitude: 18.4241,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {university && (
          <Marker
            coordinate={{ latitude: -33.9249, longitude: 18.4241 }}
            title={university.name}
            description={university.country}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});