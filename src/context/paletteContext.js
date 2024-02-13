import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';

const paletteReducer = (state, action) => {
  switch (action.type) {
    case 'change_theme':
      return { ...state, palette: state.palettes[action.payload] };
    case 'change_active_palette':
      return { ...state, activePalette: action.payload };
    case 'change_bg':
      return { ...state, activeBgImage: action.payload };
    case 'change_active_bg':
      return { ...state, background: state.backgrounds[action.payload] };
    case 'fonts_loaded':
      return { ...state, fontsLoaded: action.payload };
    default:
      return state;
  }
};

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const changeTheme = dispatch => (index) => {
  dispatch({ type: 'change_theme', payload: index });
  dispatch({ type: 'change_active_palette', payload: index });
  storeData('theme', JSON.stringify(index));
};

const changeBG = dispatch => (index) => {
  dispatch({ type: 'change_bg', payload: index });
  dispatch({ type: 'change_active_bg', payload: index });
  storeData('bg', JSON.stringify(index));
};

const fontsLoadedStatus = dispatch => (val) => {
  dispatch({ type: 'fonts_loaded', payload: val });
};

export const { Provider, Context } = createDataContext(
  paletteReducer,
  { changeTheme, changeBG, fontsLoadedStatus },
  {
    activePalette: 0,
    activeBgImage: 0,
    fontsLoaded: false,
    palette: {
      background: '#faeed9',
      text: '#113231',
      buttonsInactive: '#cf7033',
      metricsTop: '#b6541c',
      metricsBottom: '#5c2f16',
      mapstyle: [
        {
          elementType: 'geometry',
          stylers: [
            {
              color: '#ebe3cd',
            },
          ],
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#523735',
            },
          ],
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#f5f1e6',
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#c9b2a6',
            },
          ],
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#dcd2be',
            },
          ],
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#ae9e90',
            },
          ],
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [
            {
              color: '#dfd2ae',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#dfd2ae',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#93817c',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#a5b076',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#447530',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f5f1e6',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              color: '#fdfcf8',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f8c967',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#e9bc62',
            },
          ],
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [
            {
              color: '#e98d58',
            },
          ],
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#db8555',
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#806b63',
            },
          ],
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [
            {
              color: '#dfd2ae',
            },
          ],
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#8f7d77',
            },
          ],
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#ebe3cd',
            },
          ],
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [
            {
              color: '#dfd2ae',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#b9d3c2',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#92998d',
            },
          ],
        },
      ],
    },
    background: {
      image: require('../../assets/bg4.png'),
    },
    palettes: [
      {
        background: '#faeed9',
        text: '#113231',
        buttonsInactive: '#cf7033',
        metricsTop: '#b6541c',
        metricsBottom: '#5c2f16',
        mapstyle: [
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#523735',
              },
            ],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#c9b2a6',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#dcd2be',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#ae9e90',
              },
            ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#93817c',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#a5b076',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#447530',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
              {
                color: '#fdfcf8',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f8c967',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#e9bc62',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e98d58',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#db8555',
              },
            ],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#806b63',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#8f7d77',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#b9d3c2',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#92998d',
              },
            ],
          },
        ],
      },
      {
        background: '#f8f4cb',
        text: '#222e34',
        buttonsInactive: '#408384',
        metricsTop: '#ee7755',
        metricsBottom: '#ae5c4e',
        mapstyle: [
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#523735',
              },
            ],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#c9b2a6',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#dcd2be',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#ae9e90',
              },
            ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#93817c',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#a5b076',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#447530',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
              {
                color: '#fdfcf8',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f8c967',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#e9bc62',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e98d58',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#db8555',
              },
            ],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#806b63',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#8f7d77',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#b9d3c2',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#92998d',
              },
            ],
          },
        ],
      },
      {
        background: '#9af5d7',
        text: '#0c243d',
        buttonsInactive: '#0c5d7a',
        metricsTop: '#8696b8',
        metricsBottom: '#6583be',
        mapstyle: [],
      },
      {
        background: '#f1a4f5',
        text: '#161a2e',
        buttonsInactive: '#636379',
        metricsTop: '#316072',
        metricsBottom: '#263667',
        mapstyle: [
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#f4dff7',
              },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#523735',
              },
            ],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#c9b2a6',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#dcd2be',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#ae9e90',
              },
            ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#93817c',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#a5b076',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#447530',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
              {
                color: '#fdfcf8',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f8c967',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#e9bc62',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e98d58',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#db8555',
              },
            ],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#806b63',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#8f7d77',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#aed5d4',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#92998d',
              },
            ],
          },
        ],
      },
      {
        background: '#fa508b',
        text: '#161a2e',
        buttonsInactive: '#636379',
        metricsTop: '#316072',
        metricsBottom: '#263667',
        mapstyle: [
          {
            stylers: [
              {
                color: '#f8a0a0',
              },
            ],
          },
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#f7d4d4',
              },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#523735',
              },
            ],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#c9b2a6',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#dcd2be',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#ae9e90',
              },
            ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#93817c',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#a5b076',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#447530',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f1e6',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
              {
                color: '#fdfcf8',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#f8c967',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#e9bc62',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e98d58',
              },
            ],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#db8555',
              },
            ],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#806b63',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#8f7d77',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#ebe3cd',
              },
            ],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dfd2ae',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#aed5d4',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#92998d',
              },
            ],
          },
        ],
      },
    ],
    backgrounds: [
      {
        image: require('../../assets/bg4.png'),
      },
      {
        image: require('../../assets/bg5.png'),
      },
      {
        image: require('../../assets/bg6.png'),
      },
      {
        image: require('../../assets/bg8.png'),
      },
      {
        image: require('../../assets/bg9.png'),
      },
      {
        image: require('../../assets/bg10.png'),
      },
    ],
  },
);
