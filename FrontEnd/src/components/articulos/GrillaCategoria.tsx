import { useState, useEffect } from "react";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import BotonVer from "../layout/BotonVer";
import BotonEliminar from "../layout/BotonEliminar";
import BotonModificar from "../layout/BotonModificar";
import BotonAlta from "../layout/BotonAlta";

function GrillaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const darDeAlta = async (id: number) => {
    if (!window.confirm("¿Seguro que desea dar de alta esta categoría?")) return;
    try {
      await CategoriaService.changeEliminado(id);
      cargarCategorias();
      alert("Categoría dada de alta correctamente");
    } catch (err) {
      alert("Error al dar de alta la categoría");
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (!window.confirm("¿Seguro que desea eliminar esta categoría?")) return;
    try {
      await CategoriaService.delete(id);
      cargarCategorias();
      alert("Categoría eliminada correctamente");
    } catch (err) {
      alert("Error al eliminar la categoría");
    }
  };

  const handleActualizar = (cat: Categoria) => {
    window.location.href = `/fromCategoria?id=${cat.id}`;
  };

  const handleVer = (cat: Categoria) => {
    setCategoriaSeleccionada(cat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoriaSeleccionada(null);
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const CategoriaItem = ({ cat }: { cat: Categoria }) => {
    const isExpanded = expanded[cat.id!];

    return (
      <div style={{ marginLeft: "1rem", borderLeft: "2px solid #eee", paddingLeft: "1rem", marginBottom: "0.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: cat.subcategorias?.length ? "pointer" : "default",
            fontWeight: 600,
            fontSize: 16,
            color: "#444"
          }}
          onClick={() => cat.subcategorias?.length && toggleExpand(cat.id!)}
        >
          <span style={{ flex: 1 }}>{cat.denominacion}</span>
          {cat.subcategorias?.length > 0 && (
            <span style={{ fontSize: 18, marginLeft: 8 }}>
              {isExpanded ? "↑" : "↓"}
            </span>
          )}
          <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
            <BotonVer onClick={() => handleVer(cat)} />
            <BotonModificar onClick={() => handleActualizar(cat)} />
            {!cat.eliminado ? (
              <BotonEliminar onClick={() => eliminarCategoria(cat.id!)} />
            ) : (
              <BotonAlta onClick={() => darDeAlta(cat.id!)} />
            )}
          </div>
        </div>

        {isExpanded && cat.subcategorias?.length > 0 && (
          <div style={{ marginTop: "0.5rem" }}>
            {cat.subcategorias.map(sub => (
              <CategoriaItem key={sub.id} cat={sub} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filtra solo las categorías raíz (sin padre)
  const categoriasRaiz = categorias.filter(cat =>
    !categorias.some(c => c.subcategorias.some(sub => sub.id === cat.id))
  );

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Categorias</h2>
        <Button variant="outline-dark" onClick={() => window.location.href = "/fromCategoria"}>
          Nueva Categoría
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {categoriasRaiz.map(cat => (
          <div key={cat.id} style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 1px 4px #0001",
            padding: "1rem"
          }}>
            <CategoriaItem cat={cat} />
          </div>
        ))}
      </div>

      {/* Modal de ver categoría */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de la Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoriaSeleccionada && (
            <div>
              <p><b>Nombre:</b> {categoriaSeleccionada.denominacion}</p>
              <p>
                <b>Categoría Padre:</b>{" "}
                {
                  categorias.find(cat =>
                    cat.subcategorias.some(sub => sub.id === categoriaSeleccionada.id)
                  )?.denominacion || "Sin categoría padre"
                }
              </p>
              <p><b>Estado:</b> {categoriaSeleccionada.eliminado ? "Eliminado" : "Activo"}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GrillaCategorias;
