import { Button } from "react-bootstrap";
import pencilIcon from "../../assets/pencil-svgrepo-com.svg";
interface BotonEditarProps {
  onClick?: () => void;
}

const BotonEditar: React.FC<BotonEditarProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick}
            variant="warning"
            size="sm"
            className="me-2"
          >
            <img src={pencilIcon} alt="Editar" style={{ width: 16, height: 16 }} />
        </Button>
    );
}

export default BotonEditar;