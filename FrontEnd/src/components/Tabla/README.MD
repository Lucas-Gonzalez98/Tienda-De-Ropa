
INTEGRACION CON API EJEMPLO

        const TablaConAPI = () => {
        const [data, setData] = useState([])
        const [loading, setLoading] = useState(false)
        const [searchTerm, setSearchTerm] = useState("")

        useEffect(() => {
            const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/datos')
                const result = await response.json()
                setData(result)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
            }

            fetchData()
        }, [])

        return (
            <EnhancedTable
            columns={columns}
            data={data}
            loading={loading}
            globalFilter={searchTerm}
            onGlobalFilterChange={setSearchTerm}
            pagination={{ enabled: true }}
            emptyMessage="No se encontraron datos"
            />
        )
    }
    