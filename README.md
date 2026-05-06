# Radarr IoT 🛰️

Sistema de visualización de radar para sensores ultrasónicos rotativos basados en ESP32 (Xiao ESP32 u otros). Reconstruye superficies en tiempo real mediante WebSockets.

## 🚀 Inicio Rápido

Para ejecutar la aplicación localmente:

```bash
bun install
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Configuración

1. Navega a la pestaña **Configuración**.
2. Ingresa la URL de tu ESP32 (ej. `ws://192.168.1.100:81`).
3. Si no tienes el hardware listo, activa el **Modo de datos simulados** para ver una demostración.
4. Haz clic en **Guardar Configuración**.

## 🔌 Requisitos de la API (ESP32)

Para que el radar funcione con tu hardware, el ESP32 debe actuar como un servidor WebSocket y enviar mensajes JSON con la siguiente estructura:

### JSON Payload
El sistema espera recibir un objeto JSON por cada lectura del sensor:

```json
{
  "angle": 180.5,
  "distance": 125.3
}
```

- **`angle`**: Valor numérico de 0 a 359 (grados).
- **`distance`**: Valor numérico que representa la distancia medida (normalmente en cm).

### Ejemplo de implementación (Arduino/C++)
Si usas la librería `WebSocketsServer.h`:

```cpp
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

WebSocketsServer webSocket = WebSocketsServer(81);

void sendRadarData(float angle, float distance) {
    StaticJsonDocument<64> doc;
    doc["angle"] = angle;
    doc["distance"] = distance;
    
    String output;
    serializeJson(doc, output);
    webSocket.broadcastTXT(output);
}
```

## 🏗️ Arquitectura

Este proyecto utiliza el **Patrón Adapter** para gestionar las fuentes de datos:

- **`WebSocketRadarAdapter`**: Se conecta a dispositivos reales.
- **`MockRadarAdapter`**: Genera datos de prueba para desarrollo.

## 🛠️ Tecnologías

- **Framework**: TanStack Start (React + Vite)
- **Routing**: TanStack Router (File-based)
- **Estilos**: Tailwind CSS 4
- **Linter/Formatter**: Biome
- **Visualización**: HTML5 Canvas (Optimizado para alto rendimiento)
