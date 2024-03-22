import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { City, Country, Region } from '../../interfaces/schema/schema.interface';

export class ReadAddress {
  async getCountries(): Promise<Country[]> {
    return new Promise<Country[]>((resolve, reject) => {
      const countries: Country[] = [];
      createReadStream('././src/public/data/locations/countries.csv')
        .pipe(csv())
        .on('data', (row: any) => countries.push(row))
        .on('error', reject)
        .on('end', () => resolve(countries));
    }).then((countries) => {
      return countries.map((el: any) => ({
        id: el.id,
        name: el.name,
        iso3: el.iso3,
        iso2: el.iso2,
        numericCode: el.numeric_code,
        phoneCode: el.phone_code,
        capital: el?.capital ?? 'N/A',
        currency: el.currency,
        currencyName: el.currency_name,
        currencySymbol: el.currency_symbol,
        tld: el.tld,
        native: el.native,
        region: el.region,
        regionId: el.region_id,
        subregion: el?.subregion ?? 'N/A',
        subregionId: el?.subregion_id ?? 'N/A',
        nationality: el.nationality,
        timezones: el.timezones,
        latitude: el.latitude,
        longitude: el.longitude,
        emoji: el.emoji,
        emojiU: el.emojiU,
      }));
    });
  }

  async getCities(): Promise<City[]> {
    return new Promise<City[]>((resolve, reject) => {
      const cities: City[] = [];
      createReadStream('././src/public/data/locations/cities.csv')
        .pipe(csv())
        .on('data', (row: any) => cities.push(row))
        .on('error', reject)
        .on('end', () => resolve(cities));
    }).then((cities) => {
      return cities.map((el: any) => ({
        id: el.id,
        name: el.name,
        stateId: el.state_id,
        stateCode: el.state_code,
        stateName: el.state_name,
        countryId: el.country_id,
        countryCode: el.country_code,
        countryName: el.country_name,
        latitude: el.latitude,
        longitude: el.longitude,
        wikiDataId: el.wikiDataId,
      }));
    });
  }

  async getRegions(): Promise<Region[]> {
    return new Promise<Region[]>((resolve, reject) => {
      const regions: Region[] = [];
      createReadStream('././src/public/data/locations/regions.csv')
        .pipe(csv())
        .on('data', (row: any) => regions.push(row))
        .on('error', reject)
        .on('end', () => resolve(regions));
    }).then((regions) => {
      return regions.map((el: any) => ({
        id: el.id,
        name: el.name,
        stateId: el.state_id,
        stateCode: el.state_code,
        stateName: el.state_name,
        countryId: el.country_id,
        countryCode: el.country_code,
        countryName: el.country_name,
        latitude: el.latitude,
        longitude: el.longitude,
        wikiDataId: el.wikiDataId,
      }));
    });
  }

  async getSubRegions(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const regions: any[] = [];
      createReadStream('././src/public/data/locations/subregions.csv')
        .pipe(csv())
        .on('data', (row: any) => regions.push(row))
        .on('error', reject)
        .on('end', () => resolve(regions));
    }).then((regions) => {
      return regions.map((el: any) => ({
        id: el.id,
        name: el.name,
        regionId: el.region_id,
        wikiDataId: el.wikiDataId,
      }));
    });
  }

  async getStates(): Promise<any[] | void> {
    return new Promise<Region[]>((resolve, reject) => {
      const states: Region[] = [];
      createReadStream('././src/public/data/locations/states.csv')
        .pipe(csv())
        .on('data', (row: any) => states.push(row))
        .on('error', reject)
        .on('end', () => resolve(states));
    }).then((states) => {
      return states.map((el: any) => ({
        id: el.id,
        name: el.name,
        countryId: el.country_id,
        countryCode: el.country_code,
        countryName: el.country_name,
        stateCode: el.state_code,
        type: el.type,
        latitude: el.latitude,
        longitude: el.longitude,
      }));
    });
  }
}
