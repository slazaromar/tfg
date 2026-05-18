from fastapi import APIRouter, Depends

from app.core.seguridad           import requerir_clave_api
from app.models.esquemas          import SolicitudRecomendacion, RespuestaRecomendacion
from app.services.recomendacion   import generar_recomendacion

router = APIRouter()


@router.post(
    "/recomendar",
    response_model=RespuestaRecomendacion,
    summary="Generar recomendación de alineación",
)
async def recomendar_alineacion(
    cuerpo: SolicitudRecomendacion,
    _clave: str = Depends(requerir_clave_api),
) -> RespuestaRecomendacion:
    return generar_recomendacion(
        jugadores=cuerpo.jugadores,
        formacion=cuerpo.formacion,
        partido=cuerpo.partido,
    )
