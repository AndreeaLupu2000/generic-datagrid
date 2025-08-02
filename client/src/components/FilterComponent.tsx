import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, FilterList as FilterIcon } from '@mui/icons-material';

// Filter type
interface FilterType {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Filter component props
interface FilterComponentProps {
  columns: any[];
  onApplyFilter: (filters: any) => void;
  onClearFilter: () => void;
}

// Filter operators
const filterOperators = [
  { value: 'eq', label: 'Equals', needsValue: true },
  { value: 'ne', label: 'Not Equals', needsValue: true },
  { value: 'contains', label: 'Contains', needsValue: true },
  { value: 'startsWith', label: 'Starts With', needsValue: true },
  { value: 'endsWith', label: 'Ends With', needsValue: true },
  { value: 'isEmpty', label: 'Is Empty', needsValue: false },
  { value: 'isNotEmpty', label: 'Is Not Empty', needsValue: false },
  { value: 'g', label: 'Greater Than', needsValue: true },
  { value: 'ge', label: 'Greater Than or Equal', needsValue: true },
  { value: 'l', label: 'Less Than', needsValue: true },
  { value: 'le', label: 'Less Than or Equal', needsValue: true },
];

const FilterComponent: React.FC<FilterComponentProps> = ({
  columns,
  onApplyFilter,
  onClearFilter,
}) => {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Add filter
  const addFilter = () => {
    const newFilter: FilterType = {
      id: Date.now().toString(),
      field: columns[0]?.field || '',
      operator: 'eq',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  // Remove filter
  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  // Update filter
  const updateFilter = (id: string, field: keyof FilterType, value: string) => {
    setFilters(filters.map(filter =>
      filter.id === id ? { ...filter, [field]: value } : filter
    ));
  };

  // Apply filters
  const applyFilters = () => {
    if (filters.length === 0) {
      onClearFilter();
      return;
    }

    const filterStructure = {
      and: filters.map(filter => ({
        field: filter.field,
        op: filter.operator,
        value: filter.value,
      }))
    };

    onApplyFilter(filterStructure);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters([]);
    onClearFilter();
  };

  // Get operator needs value
  const getOperatorNeedsValue = (operator: string) => {
    const op = filterOperators.find(o => o.value === operator);
    return op ? op.needsValue : true;
  };

  return (
    <Box>
      {/* Filter buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        {filters.length > 0 && (
          <>
            <Button variant="contained" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={clearFilters}>
              Clear All
            </Button>
          </>
        )}
      </Box>

      {/* Filter form */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          {/* Filter fields */}
          {filters.map((filter) => (
            <Stack direction="row" spacing={2} key={filter.id} sx={{ mb: 2, alignItems: 'center' }}>
              <Box sx={{ flex: '0 0 25%' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={filter.field}
                    label="Field"
                    onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                  >
                    {columns.map((column) => (
                      <MenuItem key={column.field} value={column.field}>
                        {column.headerName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Operator field */}
              <Box sx={{ flex: '0 0 25%' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={filter.operator}
                    label="Operator"
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                  >
                    {filterOperators.map((operator) => (
                      <MenuItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Value field */}
              <Box sx={{ flex: '0 0 35%' }}>
                {getOperatorNeedsValue(filter.operator) ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  />
                ) : (
                  <Box sx={{ height: 40, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    No value needed
                  </Box>
                )}
              </Box>

              {/* Remove filter button */}
              <Box sx={{ flex: '0 0 15%' }}>
                <IconButton
                  color="error"
                  onClick={() => removeFilter(filter.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          ))}

          {/* Add filter button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addFilter}
            sx={{ mt: 1 }}
          >
            Add Filter
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default FilterComponent; 