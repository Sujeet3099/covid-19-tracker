import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
const casesTypeColors = {
  cases: {
    hex: '#CC1034',
    multiplier: 250,
  },
  recovered: {
    hex: '#7dd71d',
    multiplier: 300,
  },
  deaths: {
    hex: '#fb4443',
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const newData = [...data];
  newData.sort((a, b) => {
    return b.cases - a.cases;
  });
  return newData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format('0.0a')}` : '+0';

export const showDataOnMap = (data, casesType = 'cases') => {
  // console.log(casesTypeColors[casesType]);
  return data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className='info-container'>
          <div
            className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>
            Cases: {numeral(country.cases).format('0,0')}
          </div>
          <div className='info-recovered'>
            Recovered: {numeral(country.recovered).format('0,0')}
          </div>
          <div className='info-deaths'>
            Deaths: {numeral(country.deaths).format('0,0')}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};
