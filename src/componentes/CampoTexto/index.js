import './CampoTexto.css'

const CampoTexto = (props) => {

    const valor = (evento) => {
        props.inputValue(evento.target.value)
    }

    return(
        <div className="campo-texto">
            <label>{props.label}</label>
            <input onChange={valor} placeholder={props.placeholder} type={props.type || "number"} step={props.step || "0.01"} min={props.min || "0"}/>
        </div>
    )
}

export default CampoTexto;