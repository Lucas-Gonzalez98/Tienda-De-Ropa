import Button from "react-bootstrap/Button";
import iconFlecha from "../../assets/up-arrow-svgrepo-com.svg";
interface BotonAltaProps {
  onClick?: () => void;
}

const BotonAlta: React.FC<BotonAltaProps> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            variant="success"
            size="sm"
            className="me-2"
        >
            <img src={iconFlecha} alt="darAlta" style={{width: "16px", height: "16px"}}/>
        </Button>

    );
}

export default BotonAlta;