import React, { useState, useEffect } from "react";
import {MenuItem, FormControl,Select, Card, CardContent  } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import {prettyPrintStats, sortData} from "./util";
import LineGraph from "./LineGraph";
import Map from "./Map";
import './App.css';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] =  useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  }, [])

  
  
  useEffect(() => {
    //The code inside here will run once
    // when the component loads and not again 
    // async -> send a request, wait for it, do something with
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2,
          }
        ));
          const sortedData = sortData(data);

        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;

    
    const url = 
    countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;

     await fetch(url).then(response => response.json()).then(data => {
       setCountry(countryCode);
       setCountryInfo(data)

       
       setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
       setMapZoom(4);
       
        
     });
  };

  

  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
      <h1>COVID 19 TRACKER </h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country} >
            <MenuItem value="worldwide">Worldwide</MenuItem>
             {
              countries.map((country)=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
         </Select>
       </FormControl>
      </div>
      <div className="app_stats">
          <InfoBox 
          onClick = {(e) => setCasesType('cases')}
          title="Coronavirus Cases" cases={prettyPrintStats(countryInfo.todayCases)} total={prettyPrintStats(countryInfo.cases)}/>  
          <InfoBox 
          onClick ={(e) =>setCasesType('recovered')}
          title="Recovered" cases={prettyPrintStats(countryInfo.todayRecovered)} total={prettyPrintStats(countryInfo.recovered)}/> 
          <InfoBox 
          onClick = {(e)=>setCasesType('deaths')}
          title="Deaths" cases={prettyPrintStats(countryInfo.todayDeaths)} total={prettyPrintStats(countryInfo.deaths)}/>
 
      </div>
     
     
     <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
    </div>
    <Card className="app_right">
      <CardContent>
        <h3>Live Cases by country</h3>
         
         <Table countries = {tableData} />
         <h3>World wide new {casesType} </h3>
         <LineGraph casesType={casesType}/>
      </CardContent>          
    </Card>
  </div>
  );
}

export default App;
