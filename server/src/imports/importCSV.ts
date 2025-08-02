import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import db from '../configs/db';

// Path to the CSV file
const csvFilePath = path.join('./src/imports/data/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');

// Function to import the CSV file into the database to test the app
const importCSV = async () => {
  // Initialize an empty array to store the rows
  const rows: any[] = [];

  // Read the CSV file and parse the data
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // Remove trailing whitespace from string fields (whitespace that was followed by commas)
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          data[key] = data[key].replace(/\s+$/, ''); // Remove trailing whitespace
        }
      });

      // filter out the NaN values
      const parseNumber = (value: string): number | null => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      const parseInt = (value: string): number | null => {
        const parsed = Number.parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
      };

      // Normalize boolean and date fields if needed
      data.RapidCharge = data.RapidCharge.toLowerCase() === 'true' ? 1 : 0;
      data.Seats = parseInt(data.Seats || '0');
      data.AccelSec = parseNumber(data.AccelSec || '0');
      data.TopSpeed_KmH = parseInt(data.TopSpeed_KmH || '0');
      data.Range_Km = parseInt(data.Range_Km || '0');
      data.Efficiency_WhKm = parseNumber(data.Efficiency_WhKm || '0');
      data.FastCharge_KmH = parseInt(data.FastCharge_KmH || '0');
      data.PriceEuro = parseNumber(data.PriceEuro || '0');
      data.Date = data.Date ? new Date(data.Date) : null;

      rows.push(data);
    })
    .on('end', async () => {
      try {
        for (const row of rows) {
          await db.promise().query(
            `INSERT INTO cars (
              Brand, Model, AccelSec, TopSpeed_KmH, Range_Km,
              Efficiency_WhKm, FastCharge_KmH, RapidCharge, PowerTrain,
              PlugType, BodyStyle, Segment, Seats, PriceEuro, Date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              row.Brand,
              row.Model,
              row.AccelSec,
              row.TopSpeed_KmH,
              row.Range_Km,
              row.Efficiency_WhKm,
              row.FastCharge_KmH,
              row.RapidCharge,
              row.PowerTrain,
              row.PlugType,
              row.BodyStyle,
              row.Segment,
              row.Seats,
              row.PriceEuro,
              row.Date ? row.Date.toISOString().split('T')[0] : null
            ]
          );
        }

        // Exit the process successfully
        console.log('[INFO] - Import completed successfully.');
        process.exit(0);
      } catch (err) {
        console.error('[Error] - Import failed with:', err);
        process.exit(1);
      }
    });
};

importCSV();
