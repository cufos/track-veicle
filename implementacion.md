# Plan de Implementación – Vehicle Maintenance Tracker (React Native)

## 1. Visión General

Aplicación móvil desarrollada con **React Native (Expo)** para gestionar múltiples vehículos y sus mantenimientos o vencimientos.

Permite:
- Registrar vehículos.
- Asociar mantenimientos por vehículo.
- Visualizar alertas agrupadas.
- Configurar parámetros generales.
- Mostrar imagen del modelo del vehículo mediante API pública.

---

# 2. Arquitectura Técnica

## Stack Tecnológico

- React Native (Expo)
- React Navigation (Bottom Tabs + Stack)
- AsyncStorage (persistencia local)
- Context API o Zustand (estado global)
- Fetch API (integración API externa)

---

# 3. Navegación Principal

## Bottom Tabs (3 secciones)

1. Vehículos
2. Alertas
3. Ajustes

Cada tab tendrá su propio Stack interno.

---

# 4. Flujo 1 – Vehículos

## 4.1 Pantalla: Lista de Vehículos

Contenido:
- Lista de vehículos registrados.
- Botón flotante “Agregar Vehículo”.
- Estado vacío si no hay vehículos.

Cada vehículo muestra:
- Imagen miniatura.
- Nombre personalizado.
- Modelo.
- Año.
- Indicador visual si tiene alertas vencidas.

Acciones:
- Tap → Detalle del vehículo.
- Editar / Eliminar.

---

## 4.2 Crear / Editar Vehículo

Campos:
- Nombre personalizado
- Marca
- Modelo
- Año
- Matrícula (opcional)

Al guardar:
- Se consulta una API pública para recuperar imagen.
- Si no hay imagen → fallback genérico.

Posibles APIs:
- NHTSA API
- Unsplash (marca + modelo)
- API automotriz pública

---

## 4.3 Pantalla: Detalle del Vehículo

Estructura:

### 1. Encabezado Superior
- Nombre grande
- Imagen del modelo (API)

### 2. Sección clickeable
- Nombre
- Modelo
- Año
- Botón "+"
- Tap → Agregar mantenimiento

### 3. Lista inferior
- Próximos mantenimientos
- Ordenados por fecha
- Indicadores:
  - 🔴 Vencido
  - 🟡 Próximo
  - 🟢 En regla
- Editar / Eliminar

---

## 4.4 Crear / Editar Mantenimiento

Campos:
- Título
- Tipo (fecha fija / intervalo)
- Fecha vencimiento
- Recordatorio anticipado
- Notas

Estados:
- Vencido
- Próximo
- En regla

---

# 5. Flujo 2 – Alertas

Pantalla global agrupada por vehículo:

Ejemplo:

Vehículo 1
- 🔴 Revisión técnica vencida
- 🟡 Cambio aceite en 10 días

Vehículo 2
- 🔴 Seguro vencido

Funciones:
- Filtro: Todos / Vencidos / Próximos
- Orden por urgencia
- Tap → Navega al detalle

---

# 6. Flujo 3 – Ajustes

Secciones:

## 6.1 Configuración de Alertas
- Días antes de vencimiento
- Activar/desactivar notificaciones (futuro)

## 6.2 Apariencia
- Tema claro/oscuro
- Color principal

## 6.3 Datos
- Exportar JSON
- Resetear app

## 6.4 Información
- Versión
- Política privacidad

---

# 7. Modelo de Datos

## Vehicle

- id
- name
- brand
- model
- year
- imageUrl
- createdAt

## Maintenance

- id
- vehicleId
- title
- dueDate
- reminderDaysBefore
- type
- notes
- createdAt

---

# 8. Lógica de Alertas

```
daysRemaining = dueDate - today

if daysRemaining < 0 → Vencido
if daysRemaining <= reminderThreshold → Próximo
else → En regla
```

---

# 9. Persistencia

- AsyncStorage
  - vehicles[]
  - maintenances[]

Carga inicial en App.
Guardado automático en cada modificación.

---

# 10. Fases de Desarrollo

## Fase 1 – Base
- Inicializar proyecto Expo
- Configurar navegación
- Crear estructura de carpetas
- Configurar AsyncStorage

## Fase 2 – Vehículos
- CRUD vehículos
- Integrar API imagen
- Pantalla detalle

## Fase 3 – Mantenimientos
- CRUD mantenimientos
- Cálculo estados

## Fase 4 – Alertas
- Pantalla agrupada
- Filtros

## Fase 5 – Ajustes
- Configuración días
- Tema
- Export / Reset

## Fase 6 – Futuro
- Notificaciones push
- Sincronización nube
- Intervalo por kilómetros

---

# 11. Estructura de Carpetas

```
src/
 ├── navigation/
 ├── screens/
 │    ├── vehicles/
 │    ├── alerts/
 │    ├── settings/
 ├── components/
 ├── context/
 ├── services/
 ├── utils/
 ├── models/
