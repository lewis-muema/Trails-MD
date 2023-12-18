import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Banner = ({ message, type }) => {
  const bannerType = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: '#fde8e9',
          color: '#c91f1f',
          borderColor: '#E5E7EB',
        };
      case 'success':
        return {
          backgroundColor: '#dff7ec',
          color: '#056c4e',
          borderColor: '#E5E7EB',
        };
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    errorContainer: {
      ...bannerType(),
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
    },
    text: {
      ...bannerType(),
      marginLeft: 10,
      fontSize: 14,
    },
    icon: {
      ...bannerType(),
      fontSize: 16,
    },
  });

  return <View style={styles.errorContainer}>
    <AntDesign name="infocirlce" style={styles.icon} />
    <Text style={styles.text}>{ message }</Text>
  </View>;
};

export default Banner;
