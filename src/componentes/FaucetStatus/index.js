import React, {useState, useEffect} from "react";
import './FaucetStatus.css';  
import Conn from '../../connection.ts';

const FaucetStatus = () => {
    
    /*useEffect(() => {
        if(window.ethereum) {
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          })
          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          })
      
          // Your extra code here
        }
      })*/



    const [amount, setAmount] = useState(0);
    const [flag, isFaucetEnabled] = useState(false);
     useEffect(() => { 
        async function obtemDados() {
            var conn = new Conn();
            var quant = (await conn.getAmount()).toNumber()/100;
            var enable = await conn.isFaucetEnabled();
            setAmount(quant);
            isFaucetEnabled(enable);
    };
       obtemDados();
    }, []);

    let faucetStatus;
        if(flag) {
            faucetStatus = <div><img src="imagens/on.png" alt=""/><h4>MPE Faucet <span className="on">Ligado</span></h4></div>
        } else {
            faucetStatus = <div><img src="imagens/off.png" alt=""/><h4>MPE Faucet <span className="off">Desligado</span></h4></div>
        }
        
        return (
            <div className="status">
                <h3>{faucetStatus} </h3>
                <h3>Valor para retirada: {amount} MPE</h3>
            </div>
        )
}

export default FaucetStatus;