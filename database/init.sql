-- Create the database
CREATE DATABASE IF NOT EXISTS carsDB;

-- Create a user
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'carsDB';

-- Grant privileges on the db to the corresponding user
GRANT ALL PRIVILEGES ON carsDB.* TO 'appuser'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Use the database
USE carsDB;

-- Create the table for testing
CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Brand VARCHAR(100),
  Model VARCHAR(100),
  AccelSec FLOAT, 
  TopSpeed_KmH INT,   
  Range_Km INT,
  Efficiency_WhKm FLOAT,
  FastCharge_KmH INT,
  RapidCharge BOOLEAN,
  PowerTrain VARCHAR(100),
  PlugType VARCHAR(50),
  BodyStyle VARCHAR(50),
  Segment VARCHAR(50),
  Seats INT,
  PriceEuro DECIMAL(10,2),
  Date DATE
);