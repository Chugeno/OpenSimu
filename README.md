# OpenSimu ⚡

> **Simulador Electrotécnico Libre, Moderno y 100% en el Navegador.**  
> Diseña, cablea, simula y verifica circuitos de automatización industrial, cuadros de mando y potencia eléctrica sin instalar nada.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active%20development-orange.svg)]()
[![Single File HTML](https://img.shields.io/badge/dist-OpenSimu.html-success.svg)]()

---

## 🏛️ Homenaje y Agradecimiento a CADe_SIMU

Este proyecto nació directamente de la admiración y el respeto hacia **CADe_SIMU** y su legendario creador, **Juan Luis Villanueva Montoto**. Durante décadas, CADe_SIMU ha sido la herramienta formativa y profesional de referencia indiscutida para miles de estudiantes, profesores, electricistas, técnicos e ingenieros de habla hispana en todo el mundo.

**OpenSimu** es un sincero homenaje a esa gran obra:
- **Compatibilidad con archivos `.cad`**: OpenSimu puede abrir e interpretar directamente esquemas creados en CADe_SIMU, reconociendo líneas de fase, neutro, protección, cables de mando, contactores, relés térmicos, protecciones termomagnéticas, pulsadores, finales de carrera, temporizadores y motores.
- **Exportación a `.cad`**: Permite guardar y continuar el trabajo en CADe_SIMU cuando lo necesites.
- **Formato moderno `.json`**: Guarda y comparte circuitos ligeros y legibles en cualquier plataforma.

---

## ✨ Características Principales

- **Zero Instalación / 100% Offline**: Todo el simulador se empaqueta en un único archivo standalone (`OpenSimu.html`). Descárgalo, haz doble clic y funciona en cualquier navegador moderno sin conexión a internet ni servidores.
- **Motor de Simulación Eléctrica de Grafos**:
  - Propagación de potenciales (L1, L2, L3, N, PE, +, -).
  - Detección precisa de cortocircuitos entre polos de distinta fase o fase-neutro con modal de advertencia y coordenadas.
  - Sincronización automática de elementos por Tag: al accionar un pulsador o energizar una bobina `-KM1`, conmutan instantáneamente sus contactos de potencia y auxiliares asociados (`13-14`, `21-22`, etc.).
  - Retenciones y enclavamientos (marcha/paro clásico).
  - Temporizadores a la conexión (ON-delay), a la desconexión (OFF-delay) e intermitentes (ON/OFF-delay).
  - Bobinas biestables (set/reset) y selectores rotativos conmutados (I-0-II).
  - Motores trifásicos y monofásicos con animación de rotor giratorio y sentido de giro (horario / antihorario).
- **Herramientas de Edición Profesionales**:
  - Cuadrícula magnética de 20px compatible con las distancias de CADe_SIMU.
  - Rotación en 90° horario y antihorario (`R` / `Shift+R`).
  - Espejado horizontal y vertical (`H` / `Shift+H` o `Y`).
  - **Textos y bornes siempre legibles (Upright)**: Al rotar o espejar cualquier elemento, las etiquetas (`-KM1`, `X1/X2`, `1/2`, etc.) acompañan al símbolo pero se mantienen horizontales y erguidas, legibles de izquierda a derecha.
  - Cableado inteligente ortogonal multinodo con colores normalizados (Marrón, Negro, Gris, Azul, Verde/Amarillo, Rojo).
  - Historial infinito de Deshacer / Rehacer (`Ctrl+Z` / `Ctrl+Y`).
  - Zoom fluido y paneo con rueda del ratón o arrastre.
  - Diccionario técnico multi-dialecto: cambia dinámicamente entre términos de Argentina (Termomagnética), España (Magnetotérmico) e Internacional (Inglés).

---

## 🚀 Cómo Usarlo

### Opción 1: Descargar y Usar (Sin programar)
1. Ve a la carpeta `dist/` o a la sección de [Releases](https://github.com/Chugeno/OpenSimu/releases).
2. Descarga el archivo **`OpenSimu.html`**.
3. Haz doble clic para abrirlo en Chrome, Firefox, Edge, Safari o cualquier navegador web. ¡Listo!

### Opción 2: Ejecutar en Desarrollo o Compilar
Requiere [Node.js](https://nodejs.org/) (versión 18 o superior):

```bash
# 1. Clonar el repositorio
git clone https://github.com/Chugeno/OpenSimu.git
cd OpenSimu

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor local de desarrollo con recarga rápida
npm run dev

# 4. Compilar la versión final standalone (OpenSimu.html)
npm run build
```
El archivo compilado quedará listo para distribuir en `dist/OpenSimu.html`.

---

## 🎨 Personalización de Símbolos SVG

OpenSimu utiliza una arquitectura híbrida única: los símbolos gráficos se dibujan a partir de archivos vectoriales SVG limpios creados en Adobe Illustrator, Inkscape o código directo.

Puedes modificar la estética de los componentes o agregar nuevas variantes. Consulta la guía detallada paso a paso en:
📖 **[Guía de Personalización de Símbolos](docs/CUSTOMIZING_SYMBOLS.md)**

---

## 🛠️ Estado del Proyecto e Invitación a Probarlo

OpenSimu es un proyecto independiente en constante evolución. Te invitamos a probarlo con tus propios circuitos, abrir esquemas `.cad` existentes, reportar cualquier discrepancia o sugerir nuevos elementos en la pestaña de [Issues](https://github.com/Chugeno/OpenSimu/issues).

Si eres docente, estudiante o apasionado de la electricidad y la automatización, ¡tu feedback es invaluable para hacer crecer esta herramienta libre!

---

## ☕ Apoya el Proyecto

Si OpenSimu te resulta útil en tus estudios, clases o trabajo, puedes apoyar su desarrollo continuo invitándome un cafecito:

- 🇦🇷 **Argentina (Mercado Pago)**: [link.mercadopago.com.ar/eugenioazurmendi](https://link.mercadopago.com.ar/eugenioazurmendi)
- 🌎 **Internacional (Buy Me a Coffee)**: [buymeacoffee.com/chugeno](https://buymeacoffee.com/chugeno)

¡Muchas gracias por impulsar el software libre y la educación técnica!

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
