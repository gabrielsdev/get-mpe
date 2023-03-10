import React, {useState, useEffect} from "react";
import './Operacoes.css';
import CampoTexto from '../CampoTexto';
import CampoTextoBotao from '../CampoTextoBotao';
import Botao from '../Botao';
import Conn from '../../connection.ts';

var conn = new Conn();

const Operacoes = () => {
    const [flagFaucet, isFaucetEnabled] = useState(false);
    const [flagAdmin, isAdmin] = useState(false);

    useEffect(() => { 
        async function obtemDados() {
            isFaucetEnabled(await conn.isFaucetEnabled());
            isAdmin(await conn.isAdmin());
    };
       obtemDados();
    }, []);

    const [obtainMPE1Value, setObtainMPE1Value] = useState(0);
    const [obtainMPE2Value, setObtainMPE2Value] = useState(0);
    const [depositMPE1Value, setDepositMPE1Value] = useState(0);
    const [depositMPE2Value, setDepositMPE2Value] = useState(0);
    const [amountValue, setNewAmount] = useState(0);

    const setFaucetState = async () => {
        await conn.setFaucetState(!flagFaucet);
    }

    const obtainMPE1 = async () => {
        await conn.obtainMPE1(obtainMPE1Value);
    }

    const obtainMPE2 = async () => {
        await conn.obtainMPE2(obtainMPE2Value);
    }

    const approveDepositMPE1 = async () => {
        await conn.approveDepositMPE1(depositMPE1Value);
    }

    const depositMPE1 = async () => {
        await conn.depositMPE1(depositMPE1Value);
    }

    const approveDepositMPE2 = async () => {
        await conn.approveDepositMPE2(depositMPE2Value);
    }

    const depositMPE2 = async () => {
        await conn.depositMPE2(depositMPE2Value);
    }

    const setAmount = async () => {
        await conn.setAmount(amountValue);
    }

    let faucet;
    let classEnableFaucetButton;
    let nameEnableFaucetButton;
    if (flagFaucet) {
        faucet = <React.Fragment>
                    <div className='usuario'>
                        <h2>Obter MPE</h2>
                        <CampoTextoBotao inputValue={inputvalue => setObtainMPE1Value(inputvalue)} submit={obtainMPE1} label="Quantidade de MPE1 para receber:" placeholder="Digite a quantidade de MPE1 que deseja receber" buttonName="Obter MPE1"/>
                        <CampoTextoBotao inputValue={inputvalue => setObtainMPE2Value(inputvalue)} submit={obtainMPE2} label="Quantidade de MPE2 para receber:" placeholder="Digite a quantidade de MPE2 que deseja receber" buttonName="Obter MPE2"/>
                    </div>
                    <div className='usuario'>
                        <h2>Depositar MPE</h2>
                        <CampoTexto inputValue={inputvalue => setDepositMPE1Value(inputvalue)} label="Quantidade de MPE1 para depositar:" placeholder="Digite a quantidade de MPE1 que deseja depositar"/>
                        <Botao submit={approveDepositMPE1} classState="approve" name="Aprovar"/>
                        <Botao submit={depositMPE1} name="Depositar MPE1"/>
                        <CampoTexto inputValue={inputvalue => setDepositMPE2Value(inputvalue)} label="Quantidade de MPE2 para depositar:" placeholder="Digite a quantidade de MPE2 que deseja depositar"/>
                        <Botao submit={approveDepositMPE2} classState="approve" name="Aprovar"/>
                        <Botao submit={depositMPE2} name="Depositar MPE2"/>
                    </div>
                </React.Fragment>;
        classEnableFaucetButton = "disable";
        nameEnableFaucetButton = "Desativar Faucet";
    } else {
        classEnableFaucetButton = "enable";
        nameEnableFaucetButton = "Ativar Faucet";
    }

    let admin;
    if (flagAdmin) {
        admin = <div className='admin'>
                    <h1>Somente administrador</h1>
                    <Botao submit={setFaucetState} classState={classEnableFaucetButton} name={nameEnableFaucetButton}/>
                    <CampoTextoBotao inputValue={inputvalue => setNewAmount(inputvalue)} submit={setAmount} label="Valor máximo para obter MPE1 e MPE2" placeholder="Digite o novo valor máximo para obter MPE1 e MPE2" buttonName="Alterar valor"/>
                    <h2>Trocar endereços dos tokens MPE1 e MPE2</h2>
                    <CampoTexto label="Endereço do MPE1:" placeholder="Digite o endereço do token MPE1"/>
                    <CampoTexto label="Endereço do MPE2:" placeholder="Digite o endereço do token MPE2"/>
                    <Botao name="Trocar endereços de MPE1 e MPE2"/>
                </div>
    }

    return (
        <div className='operacoes'>
            {faucet}
            {admin}
        </div>
    )
}

export default Operacoes;