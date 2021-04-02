import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './utils';
import LineGraph from './LineGraph';

function App() {
  const [countries, setCounteries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 22.80746, lng: 70.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);
  const onCountryChange = async (e) => {
    setCountry(e.target.value);
    const url =
      e.target.value === 'worldwide'
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${e.target.value}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        // setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        if (e.target.value === 'worldwide') {
          setMapZoom(3);
          setMapCenter({ lat: 22.80746, lng: 70.4796 });
        } else {
          // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
          setMapZoom(4);
          // console.log(mapCenter);
          // console.log(mapZoom);
        }
      });
  };
  useEffect(() => {
    const getCountries = async () => {
      const res = await fetch('https://disease.sh/v3/covid-19/countries');
      const data = await res.json();
      // console.log(data);
      const sortedData = sortData(data);
      setTableData(sortedData);
      const countriesList = data.map((country) => {
        return {
          name: country.country,
          value: country.countryInfo.iso2,
        };
      });
      setMapCountries(data);
      setCounteries(countriesList);
    };
    getCountries();
  }, []);
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide' key='world'>
                WorldWide
              </MenuItem>
              {countries.map((item, index) => (
                <MenuItem value={item.value} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title='CoronaVirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            isGreen
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <div className='app__right'>
        <Card>
          <CardContent>
            Live Cases by Country
            <Table countries={tableData} />
            <h2>WorldWide {casesType}</h2>
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
