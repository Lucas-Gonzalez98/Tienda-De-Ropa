import { Wallet } from "@mercadopago/sdk-react";

export function BotonWallet({idPreference}:{idPreference: string}){
    return(
        <div>
            <Wallet
                initialization={{ preferenceId: idPreference, redirectMode: "blank" }}
            />
        </div>
    )
}