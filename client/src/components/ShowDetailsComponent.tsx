import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getData, getSchema } from '../apis/dataGridService';

const ShowDetailsComponent: React.FC = () => {
  const { tableName, id } = useParams<{ tableName: string, id: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch data and schema
  useEffect(() => {
    const fetchData = async () => {
      if (!tableName) return;
      
      try {
        setLoading(true);
        setError('');

        // Fetch schema and data in parallel
        const [schemaResponse, dataResponse] = await Promise.all([
          getSchema(),
          getData(tableName)
        ]);

        // Get columns for this table
        const tableColumns = schemaResponse[tableName] || [];
        const formattedColumns = tableColumns.map((col: any) => ({
          field: col.Field,
          headerName: col.Field,
          type: col.Type.toLowerCase().includes("date") ? "date" : 
                col.Type.toLowerCase().includes("bool") ? "boolean" :
                col.Type.toLowerCase().includes("int") ? "number" : "string",
        }));

        // Format data with IDs
        const rowsWithId = dataResponse.map((row: any, index: number) => ({
          id: row.id || index,
          ...row,
        }));

        setColumns(formattedColumns);
        setData(rowsWithId);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load record details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  // Handle back
  const handleBack = () => {
    navigate('/');
  };

  const rowData = data.find(row => row.id.toString() === id);

  // Loading
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Data Grid
        </Button>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Record not found
  if (!rowData) {
    return (
      <Box sx={{ p: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Data Grid
        </Button>
        <Typography variant="h6" color="error">
          Record not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Back button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Data Grid
      </Button>

      {/* Record details */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Record Details
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Table: {tableName} | ID: {rowData.id}
        </Typography>
        
        <Divider sx={{ my: 2 }} />

        {/* Record details grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3
          }}
        >
          {columns
            .filter(col => col.field !== 'id' && col.field !== 'actions')
            .map((column) => {
              const value = rowData[column.field];
              let displayValue = value;

              if (column.type === 'date' && value) {
                displayValue = new Date(value).toLocaleDateString();
              } else if (column.type === 'dateTime' && value) {
                displayValue = new Date(value).toLocaleString();
              } else if (column.type === 'boolean') {
                displayValue = value ? 'Yes' : 'No';
              } else if (value === null || value === undefined || value === '') {
                displayValue = 'N/A';
              }

              return (
                <Box key={column.field} sx={{ mb: 2 }}>
                  {/* Column header */}
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {column.headerName || column.field}
                  </Typography>

                  {/* Column value */}
                  {column.type === 'boolean' ? (
                    <Chip 
                      label={displayValue} 
                      color={value ? 'success' : 'default'}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight="medium">
                      {displayValue}
                    </Typography>
                  )}
                </Box>
              );
            })}
        </Box>
      </Paper>
    </Box>
  );
};

export default ShowDetailsComponent;
