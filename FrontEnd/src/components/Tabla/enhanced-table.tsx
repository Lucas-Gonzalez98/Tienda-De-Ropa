"use client"

import type React from "react"
import { useState, useMemo, useCallback, useRef, useEffect } from "react"

// Tipos para filtros
export type FilterType = "text" | "select" | "date" | "number" | "boolean"

export interface FilterOption {
    value: string | number | boolean
    label: string
    }

    export interface ColumnFilter {
    type: FilterType
    options?: FilterOption[] // Para filtros tipo select
    placeholder?: string
    min?: number // Para filtros numéricos
    max?: number
    }

    export interface TableColumn {
    key: string
    label: string
    sortable?: boolean
    filterable?: boolean
    filter?: ColumnFilter
    sortFn?: (a: any, b: any) => number
    render?: (value: any, row: any, index: number) => React.ReactNode
    className?: string
    width?: string | number
    }

    export interface PaginationConfig {
    enabled: boolean
    pageSize?: number
    pageSizeOptions?: number[]
    showInfo?: boolean
    showSizeSelector?: boolean
    }

    export interface SelectionConfig {
    enabled: boolean
    multiple?: boolean
    onSelectionChange?: (selectedRows: any[], selectedKeys: string[]) => void
    selectedKeys?: string[]
    selectableRowFn?: (row: any) => boolean
    }

    export interface VirtualizationConfig {
    enabled: boolean
    rowHeight?: number
    overscan?: number
    }

    export interface EnhancedTableProps {
    columns: TableColumn[]
    data: any[]
    keyField?: string

    // Estilos básicos
    striped?: boolean
    bordered?: boolean
    hover?: boolean
    responsive?: boolean
    size?: "sm" | "lg"
    variant?: "dark" | "light"
    className?: string

    // Estados
    loading?: boolean
    emptyMessage?: string

    // Funcionalidades avanzadas
    pagination?: PaginationConfig
    selection?: SelectionConfig
    virtualization?: VirtualizationConfig

    // Filtros globales
    globalFilter?: string
    onGlobalFilterChange?: (filter: string) => void
    }

    // Componente de filtro por columna
    const ColumnFilterComponent: React.FC<{
    column: TableColumn
    value: any
    onChange: (value: any) => void
    }> = ({ column, value, onChange }) => {
    if (!column.filter) return null

    const { type, options, placeholder, min, max } = column.filter

    switch (type) {
        case "text":
        return (
            <input
            type="text"
            className="form-control form-control-sm"
            placeholder={placeholder || `Filtrar ${column.label}`}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            />
        )

        case "select":
        return (
            <select className="form-select form-select-sm" value={value || ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">Todos</option>
            {options?.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                {option.label}
                </option>
            ))}
            </select>
        )

        case "number":
        return (
            <input
            type="number"
            className="form-control form-control-sm"
            placeholder={placeholder || "Número"}
            value={value || ""}
            min={min}
            max={max}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            />
        )

        case "date":
        return (
            <input
            type="date"
            className="form-control form-control-sm"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            />
        )

        case "boolean":
        return (
            <select
            className="form-select form-select-sm"
            value={value || ""}
            onChange={(e) => onChange(e.target.value === "true" ? true : e.target.value === "false" ? false : "")}
            >
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
            </select>
        )

        default:
        return null
    }
    }

    // Componente de paginación
    const PaginationComponent: React.FC<{
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
    pageSizeOptions: number[]
    showInfo: boolean
    showSizeSelector: boolean
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    }> = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    pageSizeOptions,
    showInfo,
    showSizeSelector,
    onPageChange,
    onPageSizeChange,
    }) => {
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
        }

        if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...")
        } else {
        rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages)
        } else if (totalPages > 1) {
        rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex align-items-center gap-3">
            {showInfo && (
            <span className="text-muted">
                Mostrando {startItem} a {endItem} de {totalItems} registros
            </span>
            )}

            {showSizeSelector && (
            <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Mostrar:</span>
                <select
                className="form-select form-select-sm"
                style={{ width: "auto" }}
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                    {size}
                    </option>
                ))}
                </select>
            </div>
            )}
        </div>

        {totalPages > 1 && (
            <nav>
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                </li>

                {getVisiblePages().map((page, index) => (
                <li
                    key={index}
                    className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
                >
                    {page === "..." ? (
                    <span className="page-link">...</span>
                    ) : (
                    <button className="page-link" onClick={() => onPageChange(page as number)}>
                        {page}
                    </button>
                    )}
                </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                    className="page-link"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
                </li>
            </ul>
            </nav>
        )}
        </div>
    )
    }

    // Componente principal mejorado
    const EnhancedTable: React.FC<EnhancedTableProps> = ({
    columns,
    data,
    keyField = "id",

    // Estilos básicos
    striped = true,
    bordered = false,
    hover = true,
    responsive = true,
    size,
    variant,
    className = "",

    // Estados
    loading = false,
    emptyMessage = "No hay datos disponibles",

    // Funcionalidades avanzadas
    pagination = { enabled: false },
    selection = { enabled: false },
    virtualization = { enabled: false },

    // Filtros globales
    globalFilter = "",
    onGlobalFilterChange,
    }) => {
    // Estados locales
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
    const [columnFilters, setColumnFilters] = useState<Record<string, any>>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(pagination.pageSize || 10)
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(selection.selectedKeys || []))

    // Referencias para virtualización
    const tableRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [containerHeight, setContainerHeight] = useState(400)

    // Configuración de paginación
    const paginationConfig = {
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50, 100],
        showInfo: true,
        showSizeSelector: true,
        ...pagination,
    }

  // Configuración de virtualización
    const virtualizationConfig = {
        rowHeight: 40,
        overscan: 5,
        ...virtualization,
    }

    // Manejo de ordenamiento
    const handleSort = useCallback((column: TableColumn) => {
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
    }, [])

    // Manejo de filtros por columna
    const handleColumnFilter = useCallback((columnKey: string, value: any) => {
        setColumnFilters((prev) => ({
        ...prev,
        [columnKey]: value,
        }))
        setCurrentPage(1) // Resetear a la primera página al filtrar
    }, [])

    // Manejo de selección
    const handleRowSelection = useCallback(
        (rowKey: string, row: any) => {
        if (!selection.enabled) return

        setSelectedKeys((prev) => {
            const newSelected = new Set(prev)

            if (selection.multiple) {
            if (newSelected.has(rowKey)) {
                newSelected.delete(rowKey)
            } else {
                newSelected.add(rowKey)
            }
            } else {
            newSelected.clear()
            newSelected.add(rowKey)
            }

            // Llamar callback si existe
            if (selection.onSelectionChange) {
            const selectedRows = data.filter((item) => newSelected.has(String(item[keyField])))
            selection.onSelectionChange(selectedRows, Array.from(newSelected))
            }

            return newSelected
        })
        },
        [selection, data, keyField],
    )

    // Seleccionar/deseleccionar todos
    const handleSelectAll = useCallback(() => {
        if (!selection.enabled || !selection.multiple) return

        setSelectedKeys((prev) => {
        const allKeys = data
            .filter((row) => !selection.selectableRowFn || selection.selectableRowFn(row))
            .map((row) => String(row[keyField]))

        const newSelected = prev.size === allKeys.length ? new Set<string>() : new Set(allKeys)

        if (selection.onSelectionChange) {
            const selectedRows = data.filter((item) => newSelected.has(String(item[keyField])))
            selection.onSelectionChange(selectedRows, Array.from(newSelected))
        }

        return newSelected
        })
    }, [selection, data, keyField])

    // Datos procesados (filtrados y ordenados)
    const processedData = useMemo(() => {
        let filtered = [...data]

        // Filtro global
        if (globalFilter) {
        filtered = filtered.filter((row) =>
            columns.some((column) => {
            const value = row[column.key]
            return String(value).toLowerCase().includes(globalFilter.toLowerCase())
            }),
        )
        }

        // Filtros por columna
        Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
        if (filterValue !== "" && filterValue !== null && filterValue !== undefined) {
            const column = columns.find((col) => col.key === columnKey)
            if (column?.filter) {
            filtered = filtered.filter((row) => {
                const cellValue = row[columnKey]

                switch (column.filter!.type) {
                case "text":
                    return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
                case "select":
                    return String(cellValue) === String(filterValue)
                case "number":
                    return Number(cellValue) === Number(filterValue)
                case "date":
                    return new Date(cellValue).toISOString().split("T")[0] === filterValue
                case "boolean":
                    return Boolean(cellValue) === filterValue
                default:
                    return true
                }
            })
            }
        }
        })

        // Ordenamiento
        if (sortConfig) {
        const column = columns.find((col) => col.key === sortConfig.key)
        if (column) {
            filtered.sort((a, b) => {
            const aVal = a[column.key]
            const bVal = b[column.key]

            if (column.sortFn) {
                return column.sortFn(a, b) * (sortConfig.direction === "asc" ? 1 : -1)
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
            return 0
            })
        }
        }

        return filtered
    }, [data, columns, globalFilter, columnFilters, sortConfig])

    // Datos paginados
    const paginatedData = useMemo(() => {
        if (!paginationConfig.enabled) return processedData

        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        return processedData.slice(startIndex, endIndex)
    }, [processedData, currentPage, pageSize, paginationConfig.enabled])

    // Datos virtualizados
    const virtualizedData = useMemo(() => {
        if (!virtualizationConfig.enabled) return paginatedData

        const startIndex = Math.floor(scrollTop / virtualizationConfig.rowHeight)
        const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / virtualizationConfig.rowHeight) + virtualizationConfig.overscan,
        paginatedData.length,
        )

        return paginatedData.slice(Math.max(0, startIndex - virtualizationConfig.overscan), endIndex)
    }, [paginatedData, scrollTop, containerHeight, virtualizationConfig.overscan])

    // Manejo de scroll para virtualización
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
        if (virtualizationConfig.enabled) {
            setScrollTop(e.currentTarget.scrollTop)
        }
        },
        [virtualizationConfig.enabled],
    )

    // Efecto para actualizar altura del contenedor
    useEffect(() => {
        if (virtualizationConfig.enabled && tableRef.current) {
        const updateHeight = () => {
            if (tableRef.current) {
            setContainerHeight(tableRef.current.clientHeight)
            }
        }

        updateHeight()
        window.addEventListener("resize", updateHeight)
        return () => window.removeEventListener("resize", updateHeight)
        }
    }, [virtualizationConfig.enabled])

    // Cálculos para paginación
    const totalPages = Math.ceil(processedData.length / pageSize)

    // Clases CSS para la tabla
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

    // Renderizado de iconos de ordenamiento
    const renderSortIcon = (columnKey: string) => {
        if (sortConfig?.key !== columnKey) {
        return <span className="sort-icon ms-1">↕️</span>
        }
        return sortConfig.direction === "asc" ? (
        <span className="sort-icon ms-1">↑</span>
        ) : (
        <span className="sort-icon ms-1">↓</span>
        )
    }

    // Renderizado del contenido de celda
    const renderCellContent = (column: TableColumn, row: any, index: number) => {
        if (column.render) return column.render(row[column.key], row, index)
        return row[column.key] ?? "-"
    }

    // Verificar si una fila es seleccionable
    const isRowSelectable = (row: any) => {
        return !selection.selectableRowFn || selection.selectableRowFn(row)
    }

    // Contenido principal de la tabla
    const tableContent = (
        <div
        ref={tableRef}
        className={virtualizationConfig.enabled ? "table-virtualized" : ""}
        style={virtualizationConfig.enabled ? { height: containerHeight, overflow: "auto" } : {}}
        onScroll={handleScroll}
        >
        <table className={tableClasses} role="table">
            <thead className="sticky-top">
            <tr>
                {selection.enabled && (
                <th scope="col" style={{ width: "50px" }}>
                    {selection.multiple && (
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedKeys.size > 0 && selectedKeys.size === data.filter(isRowSelectable).length}
                        onChange={handleSelectAll}
                        ref={(input) => {
                        if (input) {
                            input.indeterminate =
                            selectedKeys.size > 0 && selectedKeys.size < data.filter(isRowSelectable).length
                        }
                        }}
                    />
                    )}
                </th>
                )}

                {columns.map((column) => (
                <th
                    key={column.key}
                    className={`${column.sortable ? "sortable-header" : ""} ${column.className || ""}`}
                    scope="col"
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleSort(column)
                    }
                    }}
                    tabIndex={column.sortable ? 0 : -1}
                    role={column.sortable ? "button" : undefined}
                    aria-sort={
                    sortConfig?.key === column.key
                        ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                        : column.sortable
                        ? "none"
                        : undefined
                    }
                >
                    <div className="d-flex flex-column">
                    <div className="d-flex align-items-center">
                        {column.label}
                        {column.sortable && renderSortIcon(column.key)}
                    </div>

                    {column.filterable && (
                        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                        <ColumnFilterComponent
                            column={column}
                            value={columnFilters[column.key]}
                            onChange={(value) => handleColumnFilter(column.key, value)}
                        />
                        </div>
                    )}
                    </div>
                </th>
                ))}
            </tr>
            </thead>

            <tbody>
            {loading ? (
                <tr>
                <td colSpan={columns.length + (selection.enabled ? 1 : 0)} className="text-center py-4">
                    <div className="loading-spinner" role="status" aria-label="Cargando datos">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    Cargando datos...
                    </div>
                </td>
                </tr>
            ) : virtualizedData.length === 0 ? (
                <tr>
                <td colSpan={columns.length + (selection.enabled ? 1 : 0)} className="text-center py-4 text-muted">
                    <span>📭</span>
                    <div>{emptyMessage}</div>
                </td>
                </tr>
            ) : (
                virtualizedData.map((row, index) => {
                const rowKey = String(row[keyField])
                const isSelected = selectedKeys.has(rowKey)
                const selectable = isRowSelectable(row)

                return (
                    <tr
                    key={rowKey}
                    className={`${isSelected ? "table-active" : ""} ${!selectable ? "table-secondary" : ""}`}
                    style={
                        virtualizationConfig.enabled
                        ? {
                            height: virtualizationConfig.rowHeight,
                            transform: `translateY(${(Math.floor(scrollTop / virtualizationConfig.rowHeight) + index) * virtualizationConfig.rowHeight}px)`,
                            }
                        : {}
                    }
                    >
                    {selection.enabled && (
                        <td>
                        <input
                            type={selection.multiple ? "checkbox" : "radio"}
                            className="form-check-input"
                            checked={isSelected}
                            disabled={!selectable}
                            onChange={() => handleRowSelection(rowKey, row)}
                        />
                        </td>
                    )}

                    {columns.map((column) => (
                        <td key={column.key} className={column.className}>
                        {renderCellContent(column, row, index)}
                        </td>
                    ))}
                    </tr>
                )
                })
            )}
            </tbody>
        </table>
        </div>
    )

    return (
        <div className="enhanced-table-container">
        {/* Filtro global */}
        {onGlobalFilterChange && (
            <div className="mb-3">
            <div className="row">
                <div className="col-md-6">
                <div className="input-group">
                    <span className="input-group-text">🔍</span>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar en todos los campos..."
                    value={globalFilter}
                    onChange={(e) => onGlobalFilterChange(e.target.value)}
                    />
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Tabla */}
        {responsive && !virtualizationConfig.enabled ? (
            <div className="table-responsive">{tableContent}</div>
        ) : (
            tableContent
        )}

        {/* Paginación */}
        {paginationConfig.enabled && !loading && processedData.length > 0 && (
            <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={processedData.length}
            pageSizeOptions={paginationConfig.pageSizeOptions}
            showInfo={paginationConfig.showInfo}
            showSizeSelector={paginationConfig.showSizeSelector}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
            }}
            />
        )}
        </div>
    )
}

export default EnhancedTable
