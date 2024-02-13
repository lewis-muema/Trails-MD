/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet, Image, View, Text,
} from 'react-native';
import { Context as PaletteContext } from '../context/paletteContext';

const Loader = ({
  loading, screen, message, centre, offset,
}) => {
  const [loadVal, setLoadVal] = useState(1);
  const [ellipsis, setEllipsis] = useState('.');
  const { state: { palette } } = useContext(PaletteContext);
  const styles = paletteStyles(palette, screen, offset, centre);

  const loadingScreenImage = (num) => {
    const image1 = <Image style={styles.joinImg} source={require('../../assets/load1.png')} />;
    const image2 = <Image style={styles.joinImg} source={require('../../assets/load2.png')} />;
    const image3 = <Image style={styles.joinImg} source={require('../../assets/load3.png')} />;
    const image4 = <Image style={styles.joinImg} source={require('../../assets/load2.png')} />;
    if (num === 4) {
      return image4;
    }
    if (num === 3) {
      return image3;
    }
    if (num === 2) {
      return image2;
    }
    return image1;
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        if (loadVal < 4) {
          setLoadVal(loadVal + 1);
          setEllipsis(loadVal === 2 ? '...' : '..');
        } else {
          setLoadVal(1);
          setEllipsis('.');
        }
      }, 500);
    }
  }, [loading, loadVal]);

  return <View style={
      loading ? styles.loaderContainer : styles.NoloadingContainer
    }>
      { loadingScreenImage(loadVal) }
        <View style={styles.loadingTitle}>
          <Text style={styles.loadingText}>{ message }</Text>
          <Text style={styles.loadingText}>{ ellipsis }</Text>
        </View>
    </View>;
};

const loaderType = (screen, offset, centre) => {
  let styles = {};
  if (screen) {
    styles.backgroundColor = '#000000ad';
  }
  if (offset) {
    styles.paddingTop = '40%';
  }
  if (centre) {
    styles = {
      ...styles,
      position: 'absolute',
      zIndex: 1000,
      justifyContent: 'center',
      height: '100%',
    };
  }
  return styles;
};

const paletteStyles = (palette, screen, offset, centre) => StyleSheet.create({
  spacer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  joinImg: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
  loadingText: {
    color: palette.background,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingTitle: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    ...loaderType(screen, offset, centre),
    alignItems: 'center',
    width: '100%',
  },
  NoloadingContainer: {
    display: 'none',
  },
});

export default Loader;
