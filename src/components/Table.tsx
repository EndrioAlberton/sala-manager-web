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
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                    {column.render
                                        ? column.render(item[column.key], item)
                                        : <div className="text-sm text-gray-900">{item[column.key]}</div>
                                    }
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 