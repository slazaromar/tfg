from datetime import date
from typing   import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class JugadorEntrada(BaseModel):
    """Jugador tal y como llega desde el backend (claves en castellano)."""
    id:                  str
    nombre:              str
    posicion:            str
    rol_equipo:          str = "rotacion"
    edad:                Optional[int]   = None
    contrato_hasta:      Optional[str]   = None   # ISO date
    puntuacion_forma:    Optional[float] = Field(None, ge=1, le=10)
    puntuacion_general:  Optional[int]   = Field(None, ge=1, le=100)
    esta_lesionado:      bool = False
    esta_sancionado:     bool = False
    valor_mercado:       Optional[int]   = None


class PartidoEntrada(BaseModel):
    id:                str
    equipo_local:      Optional[Dict[str, Any]] = None
    equipo_visitante:  Optional[Dict[str, Any]] = None
    fecha_partido:     Optional[str] = None
    competicion:       Optional[str] = None


class SolicitudRecomendacion(BaseModel):
    jugadores:  List[JugadorEntrada]
    partido:    Optional[PartidoEntrada] = None
    formacion:  str = "4-3-3"


class JugadorPuntuado(BaseModel):
    id:                       str
    nombre:                   str
    posicion:                 str
    posicion_alineacion:      str
    rol_equipo:               str
    puntuacion_forma:         Optional[float]
    puntuacion_general:       Optional[int]
    contrato_hasta:           Optional[str]
    esta_lesionado:           bool
    esta_sancionado:          bool
    es_titular:               bool
    puntuacion_recomendacion: float
    desglose_puntuacion:      Dict[str, float]


class RespuestaRecomendacion(BaseModel):
    formacion:        str
    jugadores:        List[JugadorPuntuado]
    puntuacion_media: float
    total_puntuados:  int
    metadatos:        Dict[str, Any] = {}
