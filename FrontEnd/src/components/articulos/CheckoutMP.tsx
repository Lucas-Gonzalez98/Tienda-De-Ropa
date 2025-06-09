import { useEffect, useState } from "react";
import PreferenceMP from "../../models/mercadopago/PreferenceMP";
import { useSavePreferenceMP } from "../../services/mercadopago/MercadoPagoApi"; // ← cambio aquí
import Pedido from "../../models/Pedido";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

function CheckoutMP({ pedido }: { pedido: Pedido }) {
  const [idPreference, setIdPreference] = useState<string>('');
  const savePreferenceMP = useSavePreferenceMP(); // ← uso del hook

  const getPreferenceMP = async () => {
    try {
      const response: PreferenceMP = await savePreferenceMP(pedido); // ← llamada usando la función que devuelve el hook
      console.log("preference " ,response)
      if (response && response.id) {
        setIdPreference(response.id);
        console.log(response.id)
      } else {
        alert("Error al generar la preferencia de Mercado Pago");
      }
    } catch (e) {
      alert("Error de autenticación o al generar preferencia!");
    }
  };

  useEffect(() => {
    if (pedido) getPreferenceMP();
    // eslint-disable-next-line
  }, [pedido]);

  useEffect(() => {
    initMercadoPago('APP_USR-952520fb-4647-48b8-b7ef-b10e19201384', { locale: 'es-AR' });
  }, []);

  return (
    <div className="mt-3">
      {idPreference && (
        <Wallet
          initialization={{ preferenceId: idPreference, redirectMode: "blank" }}
        />
      )}
    </div>
  );
}

export default CheckoutMP;