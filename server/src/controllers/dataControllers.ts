import db from '../configs/db';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

// Get schema of DB (all tables and columns)
export const getSchema = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get all tables by running the query
    const [tables] = await db.promise().query("SHOW TABLES");

    const schema: Record<string, any> = {};

    for (const row of tables as any) {
      const tableName = Object.values(row)[0] as string;

      // Get columns for each table by running the query
      const [columns] = await db.promise().query(`SHOW COLUMNS FROM \`${tableName}\``);
      schema[tableName] = columns as any;
    }

    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all data from a specific table
export const getData = asyncHandler(async (req: Request, res: Response) => {
  const { table } = req.params;

  try {
    const [rows] = await db.promise().query(`SELECT * FROM \`${table}\``);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Filter data from a specific table
export const filterData = asyncHandler(async (req: Request, res: Response) => {
  const { table } = req.params;
  const { filters } = req.body;
  const whereClause = parseFilter(filters);

  try{
    const [rows] = await db.promise().query(`SELECT * FROM ${table} ${whereClause}`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getDetails = asyncHandler(async (req: Request, res: Response) => {
  const { table, id } = req.params;
  try{
    const [row] = await db.promise().query(`SELECT * FROM ${table} WHERE id = ${id}`);
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const deleteData = asyncHandler(async (req: Request, res: Response) => {
  const { table, id } = req.params;
  const [row] = await db.promise().query(`DELETE FROM ${table} WHERE id = ${id}`);
  res.status(200).json(row);
});

// Options for the filter
const options: Record<string, string> = {
  eq: "=",
  ne: "!=",
  l: "<",
  le: "<=",
  g: ">",
  ge: ">=",
  contains: "LIKE",
  startsWith: "LIKE",
  endsWith: "LIKE",
  isEmpty: "IS NULL",
  isNotEmpty: "IS NOT NULL",
};

// Filter structure
type FilterStruct = 
  | {field: string, op: string, value: any}
  | {and: FilterStruct[]}
  | {or: FilterStruct[]}


export function parseFilter(filter: FilterStruct): string {
  if (!filter) return '';

  // Build the condition for the where clause
  const buildCondition = (f: FilterStruct): string => {
    // Handle simple field filter
    if ('field' in f && 'op' in f && 'value' in f) {
      const { field, op, value } = f;
      
      // Handle LIKE operations
      if (op === 'contains') {
        const escapedValue = value.toString().replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_');
        return `${field} LIKE '%${escapedValue}%'`;
      }
      if (op === 'startsWith') {
        const escapedValue = value.toString().replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_');
        return `${field} LIKE '${escapedValue}%'`;
      }
      if (op === 'endsWith') {
        const escapedValue = value.toString().replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_');
        return `${field} LIKE '%${escapedValue}'`;
      }
      
      // Handle simple operations
      const sqlOp = options[op];
      if (sqlOp) {
        const sqlValue = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
        return `${field} ${sqlOp} ${sqlValue}`;
      }
      
      throw new Error(`Unsupported operation: ${op}`);
    }
    
    // Handle AND operation
    if ('and' in f) {
      if (f.and.length === 0) return '1=1';
      const conditions = f.and.map(buildCondition);
      return `(${conditions.join(' AND ')})`;
    }
    
    // Handle OR operation
    if ('or' in f) {
      if (f.or.length === 0) return '1=0'; 
      const conditions = f.or.map(buildCondition);
      return `(${conditions.join(' OR ')})`;
    }
    
    throw new Error('Invalid filter structure');
  };
  
  return `WHERE ${buildCondition(filter)}`;
}