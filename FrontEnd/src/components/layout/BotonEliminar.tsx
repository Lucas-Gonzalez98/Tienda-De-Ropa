import Button from "react-bootstrap/Button";
import trashIcon from "../../assets/trash-xmark-svgrepo-com.svg";
interface BotonEliminarProps {
  onClick?: () => void;
}

const BotonEliminar: React.FC<BotonEliminarProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick}
            variant="danger"
            size="sm"
            className="me-2"
          >
            <img src={trashIcon} alt="Eliminar" style={{ width: 16, height: 16 }} />
          </Button>
    );
}

export default BotonEliminar;