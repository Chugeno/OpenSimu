# Catálogo de Símbolos Electrotécnicos Normalizados (IEC 60617)

Este directorio contiene las librerías oficiales de símbolos electrotécnicos vectoriales utilizadas por **OpenSimu**, organizadas para garantizar la trazabilidad del origen de cada componente.

---

## 📁 Estructura de Directorios

```
simbolos_svg/
├── radica/                    # Símbolos vectoriales descargados de Radica Software (Capital X Panel / Vecta)
│   ├── 223_wires/             # 36 símbolos: Puentes, conexiones, líneas trifásicas
│   ├── 225_iec-symbols/       # 226 símbolos: Pulsadores, selectores, contactos, bobinas, señalización
│   ├── 226_electronic-symbols/# 40 símbolos: Semiconductores, diodos, resistencias
│   ├── 227_iec-power-meters/  # 74 símbolos: Motores trifásicos/monofásicos, transformadores, fuentes
│   ├── 228_iec-protections/   # 53 símbolos: Disyuntores, guardamotores, diferenciales, contactores, térmicos
│   └── 229_single-line/       # 126 símbolos: Esquemas unifilares y mando
│
└── qelectrotech/              # Colección oficial open source de QElectroTech (IEC 60617)
    ├── 10_allpole/            # 941 símbolos multifilares (fuerza y maniobra industrial)
    │   ├── 110_network_supplies/
    │   ├── 200_fuses_protective_gears/
    │   │   ├── 10_fuses/
    │   │   ├── 11_circuit_breakers/
    │   │   ├── 12_magneto_thermal_circuit_breakers/
    │   │   ├── 20_disconnecting_switches/
    │   │   ├── 30_thermal_relays/
    │   │   └── 50_residual_current_circuit_breaker/
    │   ├── 310_relays_contactors_contacts/
    │   ├── 380_signaling_operating/
    │   └── 391_consumers_actuators/
    └── 91_en_60617/           # 912 símbolos normalizados EN/IEC 60617 puros (partes 02 a 13)
```

---

## 🔄 Tabla Comparativa de Símbolos Principales

| Componente | Tipo OpenSimu | Radica Software (Vecta) | QElectroTech (QET) |
| :--- | :--- | :--- | :--- |
| **Termomagnética 1P** (Magnetotérmico) | `mcb_1p` | `radica/228_.../4_circuit-breaker-thermal-magnetic-1p.bfafa52300.svg` | `qelectrotech/.../12_.../disjoncteur_magneto-thermique.svg` |
| **Termomagnética 3P** (Magnetotérmico) | `mcb_3p` | `radica/228_.../6_circuit-breaker-thermal-magnetic-3p.3ce27752ef.svg` | `qelectrotech/.../12_.../dis_mag_term_3f-1.svg` |
| **Guardamotor 3P (Magnetotérmico)** | `motor_breaker_3p` | `radica/228_.../40_motor-circuit-breaker-3p.e98b89f353.svg` | `qelectrotech/.../12_.../fa4202_disjoncteur_moteur_3p.svg` |
| **Guardamotor 3P (Magnético puro)** | `motor_breaker_mag_3p`| `radica/229_.../38_circuit-breaker-3p-magnetic.8c82083967.svg` | `qelectrotech/.../11_.../disjonct-m_3f.svg` |
| **Interruptor Diferencial 2P** | `rcd_2p` | `radica/228_.../42_residual-current-circuit-breaker-2p.0bdc6ec232.svg` | `qelectrotech/.../50_.../interrupteur_differentiel.svg` |
| **Interruptor Diferencial 4P** | `rcd_4p` | `radica/228_.../43_residual-current-circuit-breaker-3p.b5f8884a39.svg` | `qelectrotech/.../50_.../int_diff4.svg` |
| **Contactor Potencia 3P** | `contactor_3p` | `radica/228_.../7_contactor-3p.8eaee38221.svg` | `qelectrotech/.../310_.../02_power_contacts/com_puiss6.svg` |
| **Bobina Contactor/Relé (A1-A2)** | `coil` | `radica/225_.../82_coil.8187db8640.svg` | `qelectrotech/.../310_.../01_coils/bobine3.svg` |
| **Contacto Auxiliar NA (13-14)** | `contact_no` | `radica/225_.../98_normally-open-contact.d80186de61.svg` | `qelectrotech/.../310_.../03_contacts/contact_relais.svg` |
| **Contacto Auxiliar NC (11-12)** | `contact_nc` | `radica/225_.../99_normally-closed-contact.7b1c4aac8b.svg` | `qelectrotech/.../310_.../03_contacts/contact_relais_nf.svg` |
| **Pulsador NA (Marcha)** | `pushbutton_no`| `radica/225_.../129_push-button-no-spring-return.d09ff5a60e.svg` | `qelectrotech/.../380_.../20_push_buttons/poussoir.svg` |
| **Pulsador NC (Parada)** | `pushbutton_nc`| `radica/225_.../130_push-button-nc-spring-return.5fcd8782b6.svg` | `qelectrotech/.../380_.../20_push_buttons/poussoir_nf.svg` |
| **Pulsador Seta Emergencia** | `pushbutton_nc`| `radica/229_.../18_emergency-stop-switch.4d5c563ee3.svg` | `qelectrotech/.../380_.../20_push_buttons/arret_urgence_tourner_deverouiller.svg` |
| **Lámpara Piloto (X1-X2)** | `pilot_light` | `radica/225_.../71_pilot-light.3ce54e3e95.svg` | `qelectrotech/.../380_.../11_optical_signaling/lampara-verde.svg` |
| **Relé Térmico 3P** | `thermal_relay`| `radica/228_.../52_thermal-current-overload-3p.22234aaff6.svg` | `qelectrotech/.../200_.../30_thermal_relays/relais_therm4.svg` |
| **Motor Trifásico (U1-V1-W1/PE)** | `motor_3p` | `radica/227_.../67_ac-motor-3p-3-terminal.79b1909019.svg` | `qelectrotech/.../391_.../10_engines/moteur_tri.svg` |

---

## 📌 Licencias y Uso
- **Radica Software**: Uso bajo términos de referencia de esquemas Vecta / Capital X Panel Designer. Archivos SVG preservados en formato original sin alteración binaria.
- **QElectroTech**: Licencia abierta GPL / CC-BY (libre de regalías para diseño técnico). Archivos `.elmt` conservados intactos y exportados a formato estándar `.svg` para compatibilidad universal con Adobe Illustrator, Inkscape y renderizado web.
