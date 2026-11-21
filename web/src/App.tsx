import { useEffect, useState } from "react";
import { apiUrl } from "./api";
import { getNivel } from "./utils/utils";
import "./styles/main_app.css";

interface Cuenta {
  id: number;
  codigo: number;
  nombre: string;
  naturaleza: string;
  cuenta_padre_id: number | null;
  active: boolean;
  created_at: string;
}

const CUENTAS_MOCK: Cuenta[] = [
  {
    id: 1,
    codigo: 1,
    nombre: "Activo",
    naturaleza: "Deudora",
    cuenta_padre_id: null,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 2,
    codigo: 11,
    nombre: "Disponible",
    naturaleza: "Deudora",
    cuenta_padre_id: 1,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 3,
    codigo: 1101,
    nombre: "Caja",
    naturaleza: "Deudora",
    cuenta_padre_id: 2,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 4,
    codigo: 110101,
    nombre: "Caja Principal",
    naturaleza: "Deudora",
    cuenta_padre_id: 3,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 5,
    codigo: 110102,
    nombre: "Caja Sucursal",
    naturaleza: "Deudora",
    cuenta_padre_id: 3,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 6,
    codigo: 1102,
    nombre: "Bancos",
    naturaleza: "Deudora",
    cuenta_padre_id: 2,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 7,
    codigo: 110201,
    nombre: "Cuenta Corriente",
    naturaleza: "Deudora",
    cuenta_padre_id: 6,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 8,
    codigo: 12,
    nombre: "Inversiones",
    naturaleza: "Deudora",
    cuenta_padre_id: 1,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 9,
    codigo: 1201,
    nombre: "Inversiones Temporales",
    naturaleza: "Deudora",
    cuenta_padre_id: 8,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 10,
    codigo: 2,
    nombre: "Pasivo",
    naturaleza: "Acreedora",
    cuenta_padre_id: null,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 11,
    codigo: 21,
    nombre: "Obligaciones Financieras",
    naturaleza: "Acreedora",
    cuenta_padre_id: 10,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 12,
    codigo: 2101,
    nombre: "Préstamos Bancarios",
    naturaleza: "Acreedora",
    cuenta_padre_id: 11,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 13,
    codigo: 210101,
    nombre: "Préstamo Corto Plazo",
    naturaleza: "Acreedora",
    cuenta_padre_id: 12,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 14,
    codigo: 3,
    nombre: "Patrimonio",
    naturaleza: "Acreedora",
    cuenta_padre_id: null,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 15,
    codigo: 31,
    nombre: "Capital",
    naturaleza: "Acreedora",
    cuenta_padre_id: 14,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 16,
    codigo: 3101,
    nombre: "Capital Social",
    naturaleza: "Acreedora",
    cuenta_padre_id: 15,
    active: true,
    created_at: "2026-01-01",
  },
  {
    id: 17,
    codigo: 310101,
    nombre: "Aportes Ordinarios",
    naturaleza: "Acreedora",
    cuenta_padre_id: 16,
    active: true,
    created_at: "2026-01-01",
  },
];

function App() {
  const [cuentaActual, setCuentaActual] = useState<Cuenta | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>(CUENTAS_MOCK);
  const [filteredCuentas, setFilteredCuentas] =
    useState<Cuenta[]>(CUENTAS_MOCK);
  const [nivel, setNivel] = useState<number>(1);

  function handleCuentaClick(cuenta: Cuenta) {
    setCuentaActual(cuenta);
  }

  function handleRaizClick() {
    setCuentaActual(null);
  }

  function filterCuentasByPadreId(padreId: number | null) {
    const filtered = cuentas.filter(
      (cuenta) => cuenta.cuenta_padre_id === padreId,
    );
    setFilteredCuentas(filtered);
  }

  useEffect(() => {
    //fetch a la api y actualizar cuentas
    // fetch(apiUrl('/'))
    //   .then((respuesta) => {
    //     if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
    //     return respuesta.text()
    //   })
    //   .then((mensaje) => setEstado({ tipo: 'ok', mensaje }))
    //   .catch((error: Error) => setEstado({ tipo: 'error', mensaje: error.message }))
  }, []);

  useEffect(() => {
    if (cuentaActual) {
      const nivelActual = getNivel(cuentaActual.codigo);
      setNivel(nivelActual);

      //fetch para la cuenta
      fetch(apiUrl(`/cuentas/${cuentaActual.id}`));

      //filtrar cuentas
      filterCuentasByPadreId(cuentaActual.id);
    } else {
      setNivel(0);
      filterCuentasByPadreId(null);
    }
  }, [cuentaActual]);

  return (
    <main>
      <h1>CATALOGO CUENTAS</h1>
      <p>
        Navega entre los distintos niveles de cuentas y subcuentas. Visualiza,
        crea nuevas o eliminalas.
      </p>

      <div className="breadcrumbs text-sm max-w-full w-full flex flex-row justify-between">
        <ul className="flex flex-row gap-2">
          <li>
            <button onClick={handleRaizClick}>Raiz</button>
          </li>
          {nivel >= 1 && (
            <li>
              <button>Clase</button>
            </li>
          )}
          {nivel >= 2 && (
            <li>
              <button>Grupo</button>
            </li>
          )}
          {nivel >= 3 && (
            <li>
              <button>Cuenta</button>
            </li>
          )}
          {nivel >= 4 && (
            <li>
              <button>Subcuenta</button>
            </li>
          )}
        </ul>
        <div className="flex flex-row gap-2 ml-auto justify-center items-center">
          <span className="badge">
            Codigo Actual: {cuentaActual?.codigo ?? "Ninguno"}
          </span>
          <button className="btn">Agregar</button>
        </div>
      </div>

      <ul>
        {filteredCuentas.map((cuenta) => (
          <li key={cuenta.id}>
            <button onClick={() => handleCuentaClick(cuenta)}>
              <span className="hover:bg-blue-500">
                {" "}
                {cuenta.codigo} - {cuenta.nombre}{" "}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
