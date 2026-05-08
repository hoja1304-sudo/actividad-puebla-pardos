# Puebla de los Pardos: mapa 3D interpretativo

Aplicación web educativa para representar en 3D una zona probable, no exacta, asociada con la Puebla de los Pardos en Cartago, Costa Rica.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño visual y panel educativo.
- `app.js`: mapa CesiumJS, marcadores, poligono aproximado y recorrido narrativo.

## Cómo ejecutarlo

Esta versión usa CesiumJS desde CDN y OpenStreetMap como capa base. No requiere API key de Google Maps ni token de Cesium Ion.

1. Abra la carpeta del proyecto.
2. Inicie un servidor local. Por ejemplo:

```bash
python -m http.server 8000
```

3. Abra en el navegador:

```text
http://localhost:8000
```

Tambien puede usar extensiones como Live Server en VS Code.

## Sobre las coordenadas

Las coordenadas incluidas son aproximaciones actuales de lugares de referencia:

- Basílica Nuestra Señora de los Ángeles
- Cruz de Caravaca
- Tribunales de Justicia de Cartago
- Instituto Tecnológico de Costa Rica
- Río Toyogres
- Centro histórico de Cartago

El polígono "Zona aproximada de la Puebla de los Pardos" es interpretativo. No debe usarse como ubicación histórica exacta confirmada.

## Si desea usar Google Maps o Cesium Ion

La entrega actual no lo necesita. Si se decide migrar a Google Maps Platform, cree un archivo `.env` o configure su llave en el entorno local:

```text
GOOGLE_MAPS_API_KEY=coloque_aqui_su_api_key
```

Si se agrega terreno, edificios 3D o assets de Cesium Ion, configure:

```text
CESIUM_ION_TOKEN=coloque_aqui_su_token
```

No publique llaves privadas en repositorios.
