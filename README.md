# Protocolo Criósfera: Escape Antártida (Boreas Zero)

Sala de escape virtual de alta complejidad ambientada en una base secreta antártica retro-cyberpunk. El objetivo del jugador es detener una catástrofe climática global resolviendo cinco niveles de acertijos basados en principios de física, termodinámica, acústica y lógica de redes.

## 🛠️ Stack Tecnológico

*   **Frontend:** React 19, TypeScript
*   **Estilos:** Tailwind CSS v4 (con utilidades personalizadas para efectos de brillo de neón y superposiciones CRT)
*   **Iconografía:** Lucide React
*   **Audio:** Web Audio API (Sintetizador `SoundEngine` personalizado para efectos sonoros retro-cyberpunk y frecuencias de puzzles)
*   **Build Tool:** Vite

## 📂 Estructura del Proyecto

*   `/src/components/levels`: Contiene la lógica y la interfaz de los 5 niveles del juego.
    *   `Level1Airlock.tsx`: Estratificación atmosférica y calibración barométrica.
    *   `Level2Elevator.tsx`: Rompecabezas de conductividad térmica y masa física.
    *   `Level3Lasers.tsx`: Sintetizador de frecuencias acústicas y formas de onda.
    *   `Level4Mainframe.tsx`: Enrutamiento de matriz cuántica (puzzle de red 5x5).
    *   `Level5SelfDestruct.tsx`: Teclado del código maestro y purga de válvulas criogénicas.
*   `/src/data/gameData.ts`: Definición estática de las variables del juego (patrones meteorológicos, llaves criogénicas, configuración de láseres, código maestro).
*   `/src/utils/audio.ts`: Motor de audio procedural que maneja la retroalimentación sonora sin depender de archivos externos.
*   `/src/App.tsx`: Gestor de estado principal (progreso, códigos descubiertos, notas del usuario, temporizador) con persistencia en `localStorage`.

## 🚀 Instalación y Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/esprado1976/prueba_sala_escape_01.git](https://github.com/esprado1976/prueba_sala_escape_01.git)
    cd prueba_sala_escape_01
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env.local` en la raíz del proyecto. Dado que el proyecto incluye dependencias de `@google/genai`, definir la clave API (si aplica a funciones extendidas):
    ```env
    GEMINI_API_KEY="TU_CLAVE_API"
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## ⚙️ Mecánicas Principales

*   **Progresión Lineal y Códigos:** Cada uno de los primeros 4 niveles proporciona un dígito vital para el código maestro final del nivel 5.
*   **Bitácora de Campo (Notebook):** Un modal persistente que permite al usuario revisar informes de inteligencia, manuales técnicos y guardar anotaciones libres.
*   **Sistema de Pistas (Hint System):** Sistema de ayuda gradual (Orientación, Especificación Técnica, Solución Detallada) que penaliza métricas finales si se abusa de él.
*   **Persistencia:** El estado del juego (nivel actual, tiempo transcurrido, notas, códigos) se guarda en el `localStorage` del navegador.
