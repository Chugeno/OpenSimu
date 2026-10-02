# Iconos SVG de OpenSimu (Secciones y Componentes)

Esta carpeta contiene todos los iconos vectoriales SVG utilizados en la interfaz de OpenSimu, organizados por sección.

## 📐 Lienzo Estándar Recomendado

Todos los iconos se diseñan sobre un lienzo estándar de **32x32 px**:

- **ViewBox:** `viewBox="0 0 32 32"`
- **Dimensiones:** `width="32" height="32"`
- **Estilo de trazo:** `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
- Al usar `currentColor`, el icono hereda automáticamente los colores del tema o del estado hover/activo.
- Puedes utilizar colores directos en cables o bornes (ej: `#0284c7`, `#dc2626`, `#16a34a`) si el elemento representa una fase o función específica.

---

## 📁 Estructura de Carpetas

- **`categories/`**: Iconos de las 9 secciones de la barra superior:
  - `power.svg`: Alimentación
  - `protections.svg`: Protecciones
  - `control.svg`: Accionamientos
  - `contactors.svg`: Contactores
  - `motors.svg`: Motores
  - `coils.svg`: Bobinas
  - `contacts.svg`: Contactos Auxiliares
  - `signaling.svg`: Señalización
  - `cables.svg`: Cables y Conexiones

- **`power/`**: Iconos de fuentes y alimentaciones (`source_l.svg`, `source_n.svg`, `power_3p.svg`, etc.)
- **`protections/`**: Termomagnéticas, guardamotores, diferenciales (`mcb_1p.svg`, `mcb_3p.svg`, `motor_breaker_3p.svg`, etc.)
- **`control/`**: Pulsadores, setas, selectores, fines de carrera (`pushbutton_no.svg`, `pushbutton_emergency_nc.svg`, etc.)
- **`contactors/`**: Contactores de potencia 1P a 4P (`contactor_1p.svg`, etc.)
- **`motors/`**: Motores monofásicos y trifásicos (`motor_1p.svg`, `motor_3p.svg`, etc.)
- **`coils/`**: Bobinas, telerruptor, temporizadores TON/TOF (`coil.svg`, `connection_timer.svg`, etc.)
- **`contacts/`**: Contactos auxiliares NA/NC, temporizados, relé térmico (`contact_no.svg`, `ondelay_no.svg`, etc.)
- **`signaling/`**: Pilotos luminosos, timbres, zumbadores (`pilot_light.svg`, `buzzer.svg`, `ring.svg`, etc.)
- **`cables/`**: Herramientas de cableado y nodos (`wire_phase_l1.svg`, `wire_neutral.svg`, `junction.svg`, etc.)

---

## ⚡ Cómo editar y compilar

1. Abre cualquier archivo `.svg` en Illustrator, Inkscape, Figma, VS Code o tu editor favorito.
2. Modifica el dibujo respetando el `viewBox="0 0 32 32"`.
3. Guarda el archivo.
4. Ejecuta en la terminal:
   ```bash
   npm run build
   ```
   El script `scripts/bundle-symbols.ts` leerá automáticamente tus cambios en `public/icons/`, generará `src/ui/EmbeddedIcons.ts` y compilará la versión final en `dist/OpenSimu.html`.
