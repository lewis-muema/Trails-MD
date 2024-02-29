import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Context as PaletteContext } from '../context/paletteContext';

const InfoCard = ({ message, title }) => {
  const { state: { palette, infoCard }, showInfoCard } = useContext(PaletteContext);

  const styles = paletteStyles(palette, infoCard);

  return <View style={styles.privacy}>
          <TouchableOpacity onPress={() => showInfoCard(false)} style={styles.background}>
          </TouchableOpacity>
          <View style={styles.errorContainer}>
            <View style={styles.title}>
              <AntDesign name="infocirlce" style={styles.icon} />
              <Text style={styles.textTitle}>{ title }</Text>
            </View>
            <View>
              <FlatList
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  data={message}
                  style={styles.rows}
                  renderItem={({ item }) => <Text style={styles.textBody}>{ item }</Text> }
                />
            </View>
            <TouchableOpacity onPress={() => showInfoCard(false)}>
              <View style={styles.cancelTop}>
                <Text style={styles.cancel}>Got it!</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>;
};

const paletteStyles = (palette, infoCard) => StyleSheet.create({
  errorContainer: {
    backgroundColor: palette.background,
    color: palette.text,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    paddingVertical: 20,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textTitle: {
    color: palette.text,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  textBody: {
    color: palette.text,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  icon: {
    color: palette.text,
    fontSize: 16,
  },
  rows: {
    width: '100%',
  },
  privacy: {
    position: 'absolute',
    top: 0,
    bottom: 0,
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
});

export default InfoCard;
