import Botao from '../Botao';
import CampoTexto from '../CampoTexto';
import './CampoTextoBotao.css';

const CampoTextoBotao = (props) => {
    return(
        <div className='campo-texto-botao'>
            <CampoTexto label={props.label} inputValue={props.inputValue} placeholder={props.placeholder} type="number" step="0.01" min="0"/>
            <Botao name={props.buttonName} submit={props.submit}/>
        </div>
    )
}

export default CampoTextoBotao;