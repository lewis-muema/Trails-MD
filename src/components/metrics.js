import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Context as locationContext } from '../context/locationContext';

const Metrics = () => {
  const {
    state: {
      currentLocation, distance,
    },
  } = useContext(locationContext);
  const [mini, setMini] = useState(true);
  return <SafeAreaView style={styles.metricsContainer}>
          { mini
            ? <TouchableOpacity onPress={() => setMini(false)}>
                <View style={styles.metricsMini}>
                    <Ionicons style={styles.metricsIcon} name="expand" size={18} color="#5c2f16" />
                  <View style={styles.metricsSections}>
                    <View style={styles.metricsSection}>
                      <View style={styles.metricsValuesMini}>
                        <Text style={styles.metricsValuesTopMini}>Distance</Text>
                        <Text style={styles.metricsValuesBottomMini}>
                          { distance >= 1000 ? `${distance / 1000} km` : `${distance} m` }
                        </Text>
                      </View>
                      <View style={styles.metricsValuesMini}>
                        <Text style={styles.metricsValuesTopMini}>Speed</Text>
                        <Text style={styles.metricsValuesBottomMini}>
                          { `${Math.trunc(currentLocation?.coords?.speed * 3.6)} km/h` }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => setMini(true)}>
                <View style={styles.metrics}>
                    <MaterialCommunityIcons style={styles.metricsIcon} name="arrow-collapse-all" size={24} color="#5c2f16" />
                  <Text style={styles.metricsTitle}>Metrics</Text>
                  <View style={styles.metricsSections}>
                    <View style={styles.metricsSection}>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Distance</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { distance >= 1000 ? `${distance / 1000} km` : `${distance} m` }
                        </Text>
                      </View>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Bearing</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { `${currentLocation?.coords?.heading}°` }
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metricsSection}>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Speed</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { `${Math.trunc(currentLocation?.coords?.speed * 3.6)} km/h` }
                        </Text>
                      </View>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Elevation</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { currentLocation?.coords?.altitude }
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metricsSection}>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Longitude</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { Math.round(currentLocation?.coords?.longitude * 1000) / 1000 }
                        </Text>
                      </View>
                      <View style={styles.metricsValues}>
                        <Text style={styles.metricsValuesTop}>Latitiude</Text>
                        <Text style={styles.metricsValuesBottom}>
                          { Math.round(currentLocation?.coords?.latitude * 1000) / 1000 }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          }
        </SafeAreaView>;
};

const styles = StyleSheet.create({
  metrics: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#faeed9',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  metricsMini: {
    width: 110,
    alignSelf: 'flex-start',
    marginLeft: '7%',
    backgroundColor: '#faeed9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  metricsIcon: {
    position: 'absolute',
    right: 7,
    top: 10,
    zIndex: 1000,
  },
  metricsSections: {
    flexDirection: 'row',
  },
  metricsSection: {
    flex: 1,
  },
  metricsTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#5c2f16',
    marginBottom: 5,
  },
  metricsValues: {
    marginVertical: 10,
    alignItems: 'center',
  },
  metricsValuesTop: {
    fontWeight: '600',
    fontSize: 13,
    color: '#b6541c',
  },
  metricsValuesBottom: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 2,
    color: '#5c2f16',
  },
  metricsValuesTopMini: {
    fontWeight: '600',
    fontSize: 12,
    color: '#b6541c',
  },
  metricsValuesBottomMini: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 2,
    color: '#5c2f16',
  },
  metricsValuesMini: {
    marginVertical: 3,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
});

export default Metrics;
