# Guía de Personalización de Símbolos en OpenSimu 🎨📐

OpenSimu incluye un compilador automático de símbolos vectoriales (`scripts/bundle-symbols.ts`). Esta arquitectura permite editar o crear nuevos símbolos en editores vectoriales como **Adobe Illustrator** o **Inkscape**, y empaquetarlos directamente en el simulador sin ralentizar la carga ni requerir llamadas asíncronas en tiempo de ejecución.

---

## 📁 Estructura de Carpetas

Todos los símbolos se encuentran en el directorio `public/symbols/`, organizados por tipo de componente:

```text
public/symbols/
├── contactor_1p/
│   ├── 0.svg    # Estado en reposo (abierto / desenergizado)
│   └── 1.svg    # Estado accionado (cerrado / energizado)
├── pushbutton_no/
│   ├── 0.svg    # Estado en reposo
│   └── 1.svg    # Estado presionado
├── pushbutton_emergency_nc/
│   ├── 0.svg    # Sin retención - Reposo
│   ├── 1.svg    # Sin retención - Presionado
│   ├── 2.svg    # Con retención (enclavamiento) - Reposo
│   └── 3.svg    # Con retención - Enclavado
└── ...
```

---

## 📐 Reglas Fundamentales de Diseño y Medidas

Para que un símbolo coincida perfectamente con la cuadrícula de OpenSimu y sea 100% compatible con los diagramas de **CADe_SIMU**, debes respetar las siguientes reglas geométricas:

### 1. Cuadrícula y Dimensiones Base
- **Paso de cuadrícula**: **20 px** (los cables y nodos se unen siempre en múltiplos de 20).
- **Altura estándar de componentes de paso**: **80 px** (distancia entre bornes superiores y bornes inferiores: `Y = 0` y `Y = 80`).
- **Ancho por polo**: **40 px** de separación entre polos en elementos multipolares (ej. Contactores o Guardamotores 3P tienen bornes en `X = 0`, `X = 40`, `X = 80`).
- **ViewBox**:
  - Para un componente monopolar estándar: `viewBox="0 0 40 80"` (ancho 40, alto 80).
  - Para un componente bipolar: `viewBox="0 0 80 80"`.
  - Para un componente tripolar: `viewBox="0 0 120 80"`.

---

## 🔌 Identificación de Bornes de Conexión (Terminales)

El compilador de OpenSimu detecta automáticamente dónde deben conectarse los cables leyendo el atributo `id` de los elementos gráficos en el SVG:

### Sintaxis de los IDs:
- Debe tener el prefijo `terminal_` o `t_` seguido del nombre del borne.
- Ejemplos:
  - `id="terminal_13"`
  - `id="terminal_14"`
  - `id="terminal_a1"`
  - `id="terminal_a2"`
  - `id="terminal_x1"`
  - `id="terminal_x2"`

### Elementos admitidos para bornes:
Puedes definir el borne con un `<circle>`, `<line>` o `<rect>`:
```xml
<!-- Círculo de borne superior en (20, 0) -->
<circle id="terminal_13" cx="20" cy="0" r="2.5" fill="#1e293b" />

<!-- Círculo de borne inferior en (20, 80) -->
<circle id="terminal_14" cx="20" cy="80" r="2.5" fill="#1e293b" />
```

> [!IMPORTANT]
> Las coordenadas `cx`/`cy` del elemento con `id="terminal_..."` determinan el punto exacto de conexión eléctrica del cable. Asegúrate de que caigan exactamente en la coordenada deseada (por ejemplo `Y = 0` o `Y = 80`).

---

## 🎨 Paleta de Colores y Estilos IEC Recomendados

Para mantener la estética limpia y profesional del proyecto:
- **Trazos principales (contactos, bornes, cuchillas)**:
  - Color: `#1e293b` (azul pizarra oscuro) o `#0f172a`.
  - Grosor de línea: `1.8px` (o `1.5px` para detalles finos).
  - Terminales de línea: `stroke-linecap="round" stroke-linejoin="round"`.
- **Enlaces mecánicos punteados**:
  - Color: `#94a3b8` (gris intermedio).
  - Grosor: `1.2px`.
  - Punteado: `stroke-dasharray="2 2"`.
- **Detalles térmicos o de emergencia**:
  - Color de seta de emergencia o bimetal: `#dc2626` o `#ef4444`.

---

## ⚙️ Pasos para Compilar los Nuevos Símbolos

Una vez que guardaste tus archivos `.svg` en la carpeta correspondiente dentro de `public/symbols/`:

1. Abre una terminal en la raíz del proyecto.
2. Ejecuta el comando de empaquetado y compilación:
   ```bash
   npm run build
   ```
3. El script `scripts/bundle-symbols.ts` realizará automáticamente lo siguiente:
   - Escanea recursivamente todos los SVGs.
   - Extrae el `viewBox` y las coordenadas de todos los `terminal_*`.
   - Genera el archivo tipado `src/core/EmbeddedSymbols.ts` con todos los metadatos precalculados.
   - Compila la aplicación completa en un único archivo standalone: `dist/OpenSimu.html`.
4. ¡Abre `dist/OpenSimu.html` en tu navegador y verás tus nuevos símbolos integrados y listos para simular!
