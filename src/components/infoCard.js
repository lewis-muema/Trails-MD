import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Context as PaletteContext } from '../context/paletteContext';
import { Context as locationContext } from '../context/locationContext';

const InfoCard = ({
  message, title, link, type, cta,
}) => {
  const { state: { palette, infoCard }, showInfoCard } = useContext(PaletteContext);
  const { state: { permission }, setPermission } = useContext(locationContext);

  const styles = paletteStyles(palette, infoCard, type);

  const OpenURLButton = async () => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    }
  };

  const close = async () => {
    setPermission('accept');
    await AsyncStorage.setItem('permissions', 'accept');
    showInfoCard(false);
  };

  return <View style={styles.privacy}>
          <TouchableOpacity onPress={() => showInfoCard(false)} style={styles.background}>
          </TouchableOpacity>
          <View style={styles.errorContainer}>
            <View style={styles.title}>
              <AntDesign name="infocirlce" style={styles.icon} />
              <Text style={styles.textTitle}>{ title }</Text>
            </View>
            <View>
              {
                type === 'permission'
                  ? <Image style={styles.mapImg} source={require('../../assets/map.png')} />
                  : null
              }
              <FlatList
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  data={message}
                  style={styles.rows}
                  renderItem={({ item }) => <Text style={styles.textBody}>{ item }</Text> }
                />
            </View>
            { link ? <TouchableOpacity onPress={() => OpenURLButton(false)}>
              <Text style={styles.linkText}>{ link }</Text>
            </TouchableOpacity> : null }
            { type === 'permission'
              ? <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => showInfoCard(false)}>
                    <View style={styles.deny}>
                      <Text style={styles.denyText}>Deny</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => close()}>
                    <View style={styles.cancelTop}>
                      <Text style={styles.cancel}>Accept</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              : <TouchableOpacity onPress={() => showInfoCard(false)}>
                  <View style={styles.cancelTop}>
                    <Text style={styles.cancel}>{ cta }</Text>
                  </View>
                </TouchableOpacity>
            }
          </View>
        </View>;
};

const paletteStyles = (palette, infoCard, type) => StyleSheet.create({
  errorContainer: {
    backgroundColor: palette.background,
    color: palette.text,
    padding: type === 'permission' ? 0 : 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    paddingVertical: type === 'permission' ? 0 : 20,
    zIndex: 1000,
    marginHorizontal: type === 'permission' ? 0 : 20,
    height: type === 'permission' ? '100%' : 'auto',
    justifyContent: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textTitle: {
    color: palette.text,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    color: palette.text,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  textBody: {
    color: palette.text,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  icon: {
    color: palette.text,
    fontSize: 16,
  },
  privacy: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    display: infoCard ? '' : 'none',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000060',
    zIndex: 900,
  },
  cancel: {
    marginVertical: 10,
    backgroundColor: palette.text,
    color: palette.background,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelTop: {
    borderRadius: 10,
    backgroundColor: palette.text,
    alignSelf: 'center',
    width: 150,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  denyText: {
    borderRadius: 10,
    backgroundColor: palette.background,
    alignSelf: 'center',
    width: 150,
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 15,
    fontWeight: '500',
  },
  mapImg: {
    width: 'auto',
    height: 200,
    resizeMode: 'cover',
    margin: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});

export default InfoCard;
