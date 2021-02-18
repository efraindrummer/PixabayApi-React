import { useEffect, useState } from "react";
import Formulario from "./components/Formulario";
import ListadoImagenes from "./components/ListadoImagenes";

function App() {

  const [busqueda, guardarBusqueda] = useState('');
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaActual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarAPI = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '20328298-2773c408c85d10e72a4e22365';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const resp = await fetch(url);
      const result = await resp.json();

      guardarImagenes(result.hits);

      //Calcula el total de paginas
      const calcularTotalPaginas = Math.ceil(result.totalHits /imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);
      //mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'});
    }

    consultarAPI();
  }, [busqueda, paginaActual]);

  //definicion de la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginActual = paginaActual - 1;
    if(nuevaPaginActual === 0) return;
    guardarPaginaActual(nuevaPaginActual);
  }

  //definicion de la pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginActual = paginaActual + 1;
    if(nuevaPaginActual > totalPaginas) return;
    guardarPaginaActual(nuevaPaginActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">
          Buscador de imagenes
        </p>
        <Formulario
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes
          imagenes={imagenes}
        />
        
        { (paginaActual === 1) ? null : (
          <button
            type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior}
          >&laquo; Anterior</button>
        ) }

        { (paginaActual === totalPaginas) ? null : (
          <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguiente}
          >Siguiente &raquo;</button>
        )}
      </div>
    </div>
  );
}

export default App;
