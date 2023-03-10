import FaucetStatus from './componentes/FaucetStatus';
import Operacoes from './componentes/Operacoes';



function App() {
  return (
    <div style={{ backgroundImage: `url(/chain.jpg)` }} className="App">
      <FaucetStatus/>
      <Operacoes/>
    </div>
  );
}

export default App;
