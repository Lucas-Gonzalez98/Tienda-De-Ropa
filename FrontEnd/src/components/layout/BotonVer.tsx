import React from "react";
import iconVer from "../../assets/eye-svgrepo-com (1).svg";
import { Button } from "react-bootstrap";
interface BotonVerProps {
  onClick?: () => void;
}

const BotonVer: React.FC<BotonVerProps> = ({ onClick }) => {
  return (
    <Button style={{ width: 30, height: 30 }} className="me-2 d-flex justify-content-center" onClick={onClick}>
      <img src={iconVer} alt="Ver" style={{ width: 16, height: 16 }} />
    </Button>
  );
};

export default BotonVer;