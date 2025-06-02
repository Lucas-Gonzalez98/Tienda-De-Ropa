import React, { useState } from "react"

interface TableColumn {
        key: string
        label: string
        sortable?: boolean
        sortFn?: (a: any, b: any) => number
        render?: (value: any, row: any) => React.ReactNode
        className?: string
}

interface ReusableTableProps {
        columns: TableColumn[]
        data: any[]
        striped?: boolean
        bordered?: boolean
        hover?: boolean
        responsive?: boolean
        size?: "sm" | "lg"
        variant?: "dark" | "light"
        className?: string
        emptyMessage?: string
        loading?: boolean
}

const ReusableTable: React.FC<ReusableTableProps> = ({
    columns,
    data,
    striped = true,
    bordered = false,
    hover = true,
    responsive = true,
    size,
    variant,
    className = "",
    emptyMessage = "No hay datos disponibles",
    loading = false,
}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

    const handleSort = (column: TableColumn) => {
        if (!column.sortable) return

    setSortConfig((prev) => {
        if (prev?.key === column.key) {
            return {
            key: column.key,
            direction: prev.direction === "asc" ? "desc" : "asc",
            }
        }
        return { key: column.key, direction: "asc" }
        })
    }

    const getSortedData = () => {
        if (!sortConfig) return data

    const column = columns.find((col) => col.key === sortConfig.key)
        if (!column) return data

    const sorted = [...data].sort((a, b) => {
        const aVal = a[column.key]
        const bVal = b[column.key]

        if (column.sortFn) {
            return column.sortFn(a, b) * (sortConfig.direction === "asc" ? 1 : -1)
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
        return 0
    })

        return sorted
    }

    const tableClasses = [
        "table",
        striped && "table-striped",
        bordered && "table-bordered",
        hover && "table-hover",
        size && `table-${size}`,
        variant && `table-${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ")

    const renderCellContent = (column: TableColumn, row: any) => {
    if (column.render) {
        const content = column.render(row[column.key], row);
        // Si el contenido es un <div>, clónalo y agrégale la clase de la columna
        if (
            React.isValidElement(content) &&
            content.type === "div" &&
            column.className
        ) {
            // Type assertion para que TS sepa que props tiene className
            const element = content as React.ReactElement<{ className?: string }>;
            return React.cloneElement(element, {
                className: [element.props.className, column.className].filter(Boolean).join(" "),
            });
        }
        return content;
    }
    return row[column.key] ?? "-";
};

    const sortedData = getSortedData()

    const renderSortIcon = (columnKey: string) => {
        if (sortConfig?.key !== columnKey) {
        return <i className="bi bi-arrow-down-up ms-1" style={{ fontSize: "0.8rem" }} />
        }
    return sortConfig.direction === "asc" ? (
        <i className="bi bi-arrow-up-short ms-1" style={{ fontSize: "0.8rem" }} />
    ) : (
        <i className="bi bi-arrow-down-short ms-1" style={{ fontSize: "0.8rem" }} />
    )
    }

    const tableContent = (
        <table className={tableClasses}>
        <thead>
            <tr>
            {columns.map((column) => (
                <th
                key={column.key}
                className={`cursor-pointer ${column.className || ""}`}
                scope="col"
                onClick={() => handleSort(column)}
                style={{ userSelect: "none" }}
                >
                {column.label}
                {column.sortable && renderSortIcon(column.key)}
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {loading ? (
            <tr>
                <td colSpan={columns.length} className="text-center py-4">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                Cargando datos...
                </td>
            </tr>
            ) : sortedData.length === 0 ? (
            <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted">
                <i className="bi bi-inbox me-2" />
                {emptyMessage}
                </td>
            </tr>
            ) : (
            sortedData.map((row, index) => (
                <tr key={row.id || index}>
                {columns.map((column) => (
                    <td key={column.key} className={column.className}>
                    {renderCellContent(column, row)}
                    </td>
                ))}
                </tr>
            ))
            )}
        </tbody>
        </table>
    )

    if (responsive) {
        return <div className="table-responsive">{tableContent}</div>
    }

    return tableContent
    }

export default ReusableTable
