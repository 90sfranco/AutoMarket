# build-images.ps1
param()

# Si alguno falla, detenemos el script
$ErrorActionPreference = 'Stop'

function Build-Image {
    param(
        [string]$Name,
        [string]$Path
    )
    Write-Host "Construyendo imagen $Name desde $Path..."
    docker build -t $Name $Path
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al construir la imagen $Name. Deteniendo el script."
        exit 1
    }
    else {
        Write-Host "Imagen $Name construida exitosamente.`n"
    }
}

# Listar todas las imágenes que queremos construir, en orden:
Build-Image -Name "kafkastreams-ms:latest"         -Path "./automarket_KafkaStreams"
Build-Image -Name "usuarios-ms:latest"             -Path "./UsuariosMsAuto"
Build-Image -Name "vehiculos-queries-ms:latest"    -Path "./VehiculosMsAuto_Queries"
Build-Image -Name "vehiculos-commands-ms:latest"   -Path "./VehiculosMsAuto_Commands"
Build-Image -Name "contratos-ms:latest"            -Path "./ContratosMsAuto"
Build-Image -Name "ventas-ms:latest"               -Path "./VentasMsAuto"
Build-Image -Name "automarketweb:latest"           -Path "./automarketweb"

Write-Host "Successfully built all images."
