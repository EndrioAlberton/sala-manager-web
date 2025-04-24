import { 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableColumn {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
    columns: TableColumn[];
    data: any[];
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}

export function Table({ columns, data, onEdit, onDelete }: TableProps) {
    const hasActions = Boolean(onEdit || onDelete);
    
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 1 }}>
            <MuiTable sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        {columns.map((column) => (
                            <TableCell key={column.key} sx={{ fontWeight: 'medium' }}>
                                {column.label}
                            </TableCell>
                        ))}
                        {hasActions && (
                            <TableCell sx={{ fontWeight: 'medium' }}>
                                Ações
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={columns.length + (hasActions ? 1 : 0)}>
                                Nenhum dado disponível
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            <TableRow key={index} hover>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.render
                                            ? column.render(item[column.key], item)
                                            : item[column.key]}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell>
                                        {onEdit && (
                                            <Tooltip title="Editar">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary" 
                                                    onClick={() => onEdit(item)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {onDelete && (
                                            <Tooltip title="Excluir">
                                                <IconButton 
                                                    size="small" 
                                                    color="error" 
                                                    onClick={() => onDelete(item)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
} 