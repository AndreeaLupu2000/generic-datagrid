import express from 'express';
import { getSchema, getData, filterData, deleteData, getDetails } from '../controllers/dataControllers';
import { RequestHandler } from 'express';

const router = express.Router();

// List all tables in the database
router.get('/schema', getSchema as RequestHandler);

// Fetch all data from a table
router.get('/data/:table', getData as RequestHandler);

// Filter data from a table
router.post('/data/:table', filterData as RequestHandler);

// Get details of a specific record
router.get('/details/:table/:id', getDetails as RequestHandler);

// Delete a record
router.delete('/data/:table/:id', deleteData as RequestHandler);

export default router;