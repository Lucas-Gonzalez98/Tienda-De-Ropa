import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoriaService from "../../services/CategoriaService";
import Categoria from "../../models/Categoria";
import { Button } from "react-bootstrap";

function FormCategoria() {
  const [denominacion, setDenominacion] = useState("");
  const [eliminado, setEliminado] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaPadreId, setCategoriaPadreId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");

  useEffect(() => {
  if (idFromUrl) {
    // Si es edición, carga ambas cosas en paralelo
    Promise.all([
      CategoriaService.getAll(),
      CategoriaService.getById(Number(idFromUrl))
    ]).then(([todas, cat]) => {
      setCategorias(todas);
      setDenominacion(cat.denominacion);
      setEliminado(cat.eliminado);

      // Busca el padre si existe
      const padre = todas.find(c =>
        c.subcategorias.some(sub => sub.id === cat.id)
      );
      setCategoriaPadreId(padre?.id ?? "");
    });
  } else {
    // Si es alta, solo carga todas las categorías
    CategoriaService.getAll().then(setCategorias);
  }
}, [idFromUrl]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Construye el objeto para enviar
    const categoria: any = {
      denominacion,
      eliminado,
      subcategorias: []
    };
    if (categoriaPadreId) {
      categoria.categoriaPadre = { id: categoriaPadreId };
    }

    try {
      if (idFromUrl) {
        await CategoriaService.update(Number(idFromUrl), { ...categoria, id: Number(idFromUrl) });
        alert("Categoría actualizada correctamente");
      } else {
        await CategoriaService.create(categoria);
        alert("Categoría creada correctamente");
      }
      window.location.href = "/admin";
    } catch (error) {
      alert("Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 d-flex flex-column align-items-center">
      <h2>{idFromUrl ? "Editar" : "Crear"} Categoría</h2>
      <form className="formContainer d-flex flex-column gap-3 text-start" onSubmit={handleSubmit}>
        <div>
          <label>Denominación:</label>
          <input
            type="text"
            value={denominacion}
            onChange={e => setDenominacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría Padre (opcional):</label>
          <select
  value={categoriaPadreId}
  onChange={e => setCategoriaPadreId(e.target.value ? Number(e.target.value) : "")}
>
  <option value="">Sin categoría padre</option>
  {categorias
    .filter(cat => !idFromUrl || cat.id !== Number(idFromUrl)) // No puede ser su propio padre
    .map(cat => (
      <option key={cat.id} value={cat.id}>
        {cat.denominacion}
      </option>
    ))}
</select>
        </div>
        <div>
          <label>Estado:</label>
          <select
            value={eliminado ? "eliminado" : "activo"}
            onChange={e => setEliminado(e.target.value === "eliminado")}
          >
            <option value="activo">Activo</option>
            <option value="eliminado">Eliminado</option>
          </select>
        </div>
        <Button
          variant="success"
          type="submit"
          disabled={loading || !denominacion}
        >
          {idFromUrl ? "Actualizar" : "Crear"}
        </Button>
      </form>
    </div>
  );
}

export default FormCategoria;