"use client"

import type React from "react"
import { useState } from "react"
import EnhancedTable, { type TableColumn, type PaginationConfig, type SelectionConfig } from "./enhanced-table"

// Datos de ejemplo
const sampleData = [
    {
        id: 1,
        nombre: "Juan Pérez",
        email: "juan@email.com",
        edad: 25,
        activo: true,
        fechaRegistro: "2024-01-15",
        categoria: "Premium",
        salario: 50000,
    },
    {
        id: 2,
        nombre: "María García",
        email: "maria@email.com",
        edad: 30,
        activo: false,
        fechaRegistro: "2024-02-20",
        categoria: "Básico",
        salario: 35000,
    },
    {
        id: 3,
        nombre: "Carlos López",
        email: "carlos@email.com",
        edad: 35,
        activo: true,
        fechaRegistro: "2024-03-10",
        categoria: "Premium",
        salario: 75000,
    },
    // Agregar más datos para probar paginación...
    ...Array.from({ length: 50 }, (_, i) => ({
        id: i + 4,
        nombre: `Usuario ${i + 4}`,
        email: `usuario${i + 4}@email.com`,
        edad: 20 + (i % 40),
        activo: i % 2 === 0,
        fechaRegistro: `2024-${String(Math.floor(i / 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        categoria: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Básico" : "Estándar",
        salario: 30000 + i * 1000,
    })),
    ]

    const TableExample: React.FC = () => {
    const [globalFilter, setGlobalFilter] = useState("")
    const [selectedRows, setSelectedRows] = useState<any[]>([])

    // Definición de columnas
    const columns: TableColumn[] = [
        {
        key: "id",
        label: "ID",
        sortable: true,
        filterable: true,
        filter: { type: "number", placeholder: "Filtrar por ID" },
        width: "80px",
        },
        {
        key: "nombre",
        label: "Nombre",
        sortable: true,
        filterable: true,
        filter: { type: "text", placeholder: "Buscar nombre..." },
        render: (value, row) => (
            <div className="d-flex align-items-center">
            <div
                className="avatar me-2"
                style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#e9ecef",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                {value.charAt(0).toUpperCase()}
            </div>
            <div>
                <div className="fw-bold">{value}</div>
                <small className="text-muted">{row.email}</small>
            </div>
            </div>
        ),
        },
        {
        key: "edad",
        label: "Edad",
        sortable: true,
        filterable: true,
        filter: { type: "number", placeholder: "Edad", min: 18, max: 65 },
        width: "100px",
        },
        {
        key: "categoria",
        label: "Categoría",
        sortable: true,
        filterable: true,
        filter: {
            type: "select",
            options: [
            { value: "Básico", label: "Básico" },
            { value: "Estándar", label: "Estándar" },
            { value: "Premium", label: "Premium" },
            ],
        },
        render: (value) => {
            const badgeClass = value === "Premium" ? "bg-success" : value === "Estándar" ? "bg-warning" : "bg-secondary"
            return <span className={`badge ${badgeClass}`}>{value}</span>
        },
        },
        {
        key: "salario",
        label: "Salario",
        sortable: true,
        filterable: true,
        filter: { type: "number", placeholder: "Salario mínimo" },
        render: (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value),
        },
        {
        key: "activo",
        label: "Estado",
        sortable: true,
        filterable: true,
        filter: { type: "boolean" },
        render: (value) => (
            <span className={`badge ${value ? "bg-success" : "bg-danger"}`}>{value ? "Activo" : "Inactivo"}</span>
        ),
        },
        {
        key: "fechaRegistro",
        label: "Fecha Registro",
        sortable: true,
        filterable: true,
        filter: { type: "date" },
        render: (value) => new Date(value).toLocaleDateString("es-AR"),
        },
        {
        key: "acciones",
        label: "Acciones",
        render: (_, row) => (
            <div className="btn-group" role="group">
            <button className="btn btn-sm btn-outline-primary" title="Editar">
                ✏️
            </button>
            <button className="btn btn-sm btn-outline-danger" title="Eliminar">
                🗑️
            </button>
            </div>
        ),
        },
    ]

    // Configuración de paginación
    const paginationConfig: PaginationConfig = {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50],
        showInfo: true,
        showSizeSelector: true,
    }

    // Configuración de selección
    const selectionConfig: SelectionConfig = {
        enabled: true,
        multiple: true,
        onSelectionChange: (rows, keys) => {
        setSelectedRows(rows)
        console.log("Filas seleccionadas:", rows)
        console.log("Keys seleccionadas:", keys)
        },
        selectableRowFn: (row) => row.activo, // Solo permitir seleccionar usuarios activos
    }

    return (
        <div className="container-fluid py-4">
        <div className="row">
            <div className="col-12">
            <div className="card">
                <div className="card-header">
                <h5 className="card-title mb-0">Tabla Mejorada - Ejemplo Completo</h5>
                </div>
                <div className="card-body">
                {/* Información de selección */}
                {selectedRows.length > 0 && (
                    <div className="alert alert-info mb-3">
                    <strong>Seleccionados:</strong> {selectedRows.length} usuario(s)
                    <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={() => console.log("Procesar seleccionados:", selectedRows)}
                    >
                        Procesar Seleccionados
                    </button>
                    </div>
                )}

                {/* Tabla mejorada */}
                <EnhancedTable
                    columns={columns}
                    data={sampleData}
                    keyField="id"
                    // Estilos
                    striped
                    hover
                    responsive
                    // Funcionalidades
                    pagination={paginationConfig}
                    selection={selectionConfig}
                    // Filtro global
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    // Estados
                    loading={false}
                    emptyMessage="No se encontraron usuarios"
                />
                </div>
            </div>
            </div>
        </div>

        {/* Ejemplo con virtualización para datasets grandes */}
        <div className="row mt-4">
            <div className="col-12">
            <div className="card">
                <div className="card-header">
                <h5 className="card-title mb-0">Tabla Virtualizada - Para Datasets Grandes</h5>
                </div>
                <div className="card-body">
                <EnhancedTable
                    columns={columns.slice(0, 5)} // Menos columnas para mejor rendimiento
                    data={Array.from({ length: 10000 }, (_, i) => ({
                    id: i + 1,
                    nombre: `Usuario ${i + 1}`,
                    email: `usuario${i + 1}@email.com`,
                    edad: 20 + (i % 40),
                    categoria: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Básico" : "Estándar",
                    }))}
                    keyField="id"
                    // Virtualización habilitada
                    virtualization={{
                    enabled: true,
                    rowHeight: 50,
                    overscan: 10,
                    }}
                    // Paginación deshabilitada para virtualización
                    pagination={{ enabled: false }}
                    responsive={false} // Deshabilitado para virtualización
                />
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default TableExample
