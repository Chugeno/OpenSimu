# 🔢 El Código Clásico de CADe_SIMU (4962) y Cómo Desactivarlo

## El Origen del Homenaje
En el mítico software **CADe_SIMU** (creado por **Juan Luis Villanueva Montoto**), cada vez que se abría el programa aparecía una calculadora tosca estilo Windows 98/2000 que obligaba al usuario a escribir con el ratón la clave `4962` para poder simular y guardar diagramas.

Como guiño y homenaje cariñoso a la historia de la electrotecnia en habla hispana, **OpenSimu** incluye esta clásica pantalla de acceso al iniciar. 

Sin embargo, en **OpenSimu** no hay restricciones:
- Si ingresas cualquier número o pulsas `OK`, podrás utilizar el simulador sin limitaciones.
- Si ingresas el código maestro histórico **`4962`**, se te ofrecerá un botón directo para desactivar permanentemente la pantalla de acceso.

---

## 🛠️ Cómo desactivar la calculadora con el "Hack del Bloc de Notas"

Si deseas eliminar esta ventana por completo sin necesidad de entrar a la interfaz:

1. Haz clic derecho sobre el archivo `OpenSimu.html` (o `dist/OpenSimu.html`).
2. Selecciona **Abrir con... -> Bloc de notas** (o cualquier editor de texto).
3. Busca cerca del inicio del archivo el bloque:
   ```html
   <script>
     window.CADESIMU_KEY_REQUIRED = true;
   </script>
   ```
4. Cambia `true` por `false`:
   ```html
   <script>
     window.CADESIMU_KEY_REQUIRED = false;
   </script>
   ```
5. Guarda el archivo (`Ctrl + G` o `Archivo -> Guardar`).

¡Listo! A partir de ese momento, OpenSimu abrirá directamente al lienzo de trabajo sin mostrar la calculadora.
