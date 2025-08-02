import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSchema, getData, filterData, deleteData } from "../apis/dataGridService";
import { DataGrid, GridActionsCellItem, type GridRowId, type GridColDef } from '@mui/x-data-grid';
import FilterComponent from '../components/FilterComponent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const DataGridView = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const navigate = useNavigate();

  // Init localStorage
  const getTableName = () => localStorage.getItem('tableName') || '';
  const setTableName = (name: string) => localStorage.setItem('tableName', name);

  const mapTypes = (sqlType: string): string => {
    const type = sqlType.toLowerCase();
    if (type.includes("int")) return "number";
    if (type.includes("date") || type.includes("time")) return "date";
    if (type.includes("bool")) return "boolean";
    if (type.includes("varchar")) return "string";
    if (type.includes("text")) return "string";
    if (type.includes("json")) return "string";
    if (type.includes("enum")) return "string";
    if (type.includes("set")) return "string";
    if (type.includes("bit")) return "boolean";
    if (type.includes("float")) return "number";
    if (type.includes("double")) return "number";
    if (type.includes("decimal")) return "number";
    if (type.includes("numeric")) return "number";
    if (type.includes("real")) return "number";
    if (type.includes("smallint")) return "number";
    if (type.includes("bigint")) return "number";
    return "string";
  };

  // Handle view
  const handleView = useCallback(
    (id: GridRowId) => () => {
      const tableName = getTableName();
      navigate(`/details/${tableName}/${id}`);
    },
    [navigate],
  );

  // Handle delete
  const handleDelete = useCallback(
    (id: GridRowId) => () => {
      const tableName = getTableName();

      const confirmDelete = window.confirm('Are you sure you want to delete this record?');

      if (confirmDelete && tableName) { 
        deleteData(tableName, id.toString());
        setData((prevData) => prevData.filter((row) => row.id !== id));
      }
    },
    [],
  );

  // Fetch schema
  const fetchSchema = async () => {
    const response = await getSchema();

    const [firstTableName, columns] = Object.entries(response)[0] as [
      string,
      any[]
    ];

    setTableName(firstTableName);

    const formattedColumns = columns.map((col) => {
      const colType = mapTypes(col.Type);
      const column: any = {
        field: col.Field,
        headerName: col.Field,
        type: colType,
        width: 150,
      };
      
      if (colType === 'date') {
        column.valueGetter = (value: any) => {
          if (!value) return null;
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };
      }
      
      return column;
    });

    // Actions column definition
    const actionsColumn: GridColDef = {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={handleView(params.id)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDelete(params.id)}
          color="inherit"
        />,
      ],
    };

    setColumns([...formattedColumns, actionsColumn]);
  };

  // Fetch data
  const fetchData = async (tableName: string) => {
    if (!tableName) return;

    const result = await getData(tableName);

    // Ensure a unique ID for each row
    const rowsWithId = result.map((row: any, index: number) => ({
      id: row.id || index, 
      ...row,
    }));

    setData(rowsWithId);
  };

  // Handle apply filter
  const handleApplyFilter = async (filters: any) => {
    try {
      const tableName = getTableName();
      const result = await filterData(tableName, filters);
      const rowsWithId = result.map((row: any, index: number) => ({
        id: row.id || index,
        ...row,
      }));
      setData(rowsWithId);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  // Handle clear filter
  const handleClearFilter = () => {
    const tableName = getTableName();
    fetchData(tableName);
  };

  // Fetch schema on mount
  useEffect(() => {
    fetchSchema();
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const tableName = getTableName();
    if (tableName) fetchData(tableName);
  }, []);

  return (
    <div style={{ height: 700, width: '100%', display: 'flex', flexDirection: 'column' }}>
      <FilterComponent
        columns={columns.filter(col => col.field !== 'actions')}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />
      <DataGrid rows={data} columns={columns} />
    </div>
  );
};

export default DataGridView;
