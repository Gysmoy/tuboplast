# Handoff — Tuboplast

Notas de trabajo para continuar sin perder contexto. Última edición: jun 2026.

## Flujo de trabajo (IMPORTANTE)
- El usuario revisa en **local** (hot reload). **No** hacer `npm run build`, `git commit` ni `git push` por cada cambio.
- Solo construir/commitear/pushear cuando el usuario diga explícitamente "súbelo / sube todo".
- Stack: Laravel + React (Inertia-like vía `CreateReactScript`) + Bootstrap (admin "Adminto") + Tailwind (público). DB MySQL (a veces apagada en local).
- Colores de marca: primary `#004991` (azul), secondary amarillo/ámbar (`#F7DD00` / `#e0a800`).
- **Nada de `<select>` nativos** — no le gustan, no tienen forma. Usar el componente **`Components/CustomDropdown.jsx`** (estilo dashboard). Ya se usa en `AdminTable` (filtros select/operador) y en el dashboard. Aplicarlo a cualquier select futuro (`SelectFormGroup`, etc.).

## Cómo se renderiza una vista admin
- Ruta en `routes/web.php` → `Controller@reactView` (extiende `BasicController`).
- `BasicController::reactView` arma props universales + merge de `setReactViewProperties()` → `Inertia::render('Admin/Xxx', props)`.
- En el `.jsx`: `CreateReactScript((el, properties) => render(<Adminto {...properties}><Xxx {...properties}/></Adminto>))`.
- `ApexCharts` y `moment` son **globales** (window) vía `admin.blade.php`; no importarlos.

## Trabajo hecho esta sesión

### Catálogo (público) + modelo Item
- Migración `2026_06_26_000000_add_catalog_fields_to_items_table.php`: +27 columnas (currency, use_type, material, color, brand, unit, masterpack, pieces, origin_country, nominal_diameter, famcons, family, dims/pesos producto y u.logística, package_type, perishable, hazardous, warranty, features, usage_recommendations, observations, usage_warning).
- `Item` model fillable/casts actualizados. `ItemController.beforeSave` valida todo. `ItemsRest.save` envía todos los campos.
- **Moneda por item** (USD/PEN): `currency`. Catálogo/ficha/cotización muestran símbolo correcto; en cotizaciones admin los totales se separan por moneda (no se suman).
- `LandingController`: `moneyLabel()`, `mapCatalogItem` (+use/material/color/currency), facets +Uso/Material/Color, filtros en `catalogQuery`, `storeQuote` guarda `currency` por item. Catálogo = **12 por página**.
- `ProductController.mapProduct`: grupos Especificaciones / Logística / Diámetros + `notices` (avisos) + currency.
- Frontend: `Catalog.jsx` (filtros Uso/Material/Color con "Ver más" + modal buscador; quitado filtro Diámetro; grid 2-col mobile), `ItemCard.jsx` (Uso en vez de Presión, botón Cotizar full-width mobile, nombre line-clamp-2), `ProductDetail.jsx` (specs en cards + sección Avisos + relacionados en carrusel Swiper), `Home.jsx` (recomendaciones y blog en carrusel Swiper, blog 3+1 desktop, fix imagen mobile), `quoteStorage.js` (currency en quote items).
- Seeder `ProductosImportSeeder` lee `database/data/productos.json` (claves normalizadas, tolera mojibake/#N/A). **Pendiente del usuario**: subir `productos.json` y correr `php artisan db:seed --class="Database\Seeders\ProductosImportSeeder"`.

### Dashboard admin (`Admin/Home.jsx` + `HomeController`)
- Data real: KPIs del periodo con Δ vs anterior, métricas (monto por moneda, ticket, sin leer, items activos), gráfico Apex, embudo por `quote_status`, tabla "Últimas cotizaciones".
- **Filtro de periodo**: dropdown modo `Por mes` / `Por año`. Mes → month-picker custom (popover, celdas "Ene 2026"); Año → dropdown años. Endpoint `GET /api/admin/dashboard?mode=&month=&year=` (`HomeController@data`, grupo auth).
- Diseño estilo referencia weFem con colores Tuboplast (clases `wfd-*`).

### Cotizaciones (`Admin/Quotes.jsx`)
- Migrado de dxDataGrid a **tabla custom** + modal custom (diseño referencia, colores Tuboplast).
- Sin buscador global; **filtros por columna** (fila de inputs en thead). Refresh arriba-derecha.
- Archivar abre **modal custom** pidiendo motivo.
- Sigue usando `rest.paginate` (se necesitará luego).

### Componentes reutilizables  ← USAR EN LOS DEMÁS CRUDS
- **`Components/AdminTable.jsx`** — tabla admin genérica (clases `at-*`). Props: `rest, columns, title, icon, countSuffix, defaultSort, perPage, perPageOptions, minWidth, rowKey, rowClassName, onRowClick, headerActions`.
  - `columns`: `{ key, header, render(row), field, filterFields, filterType, filterOptions, filterable, sortField, sortable, align, nowrap, width }`.
  - **Filtros por columna** (fila de inputs en thead): `filterType`:
    - `'text'` (def): input contains. Con `filterFields:['a','b']` filtra varias columnas con **OR**.
    - `'select'`: dropdown custom (no `<select>`), `filterOptions:[{value,label}]` + opción "Todos", operador `=`.
    - `'date'`: un solo control tipo input ("Filtrar…") que abre un popover (`DateRangeFilter`) con operador (`= ↔ > < ≥ ≤`) + calendario; "↔" pide 2 fechas (tabs Desde/Hasta). Al **Aplicar** muestra resumen corto sin agrandar la columna. Genera filtros sobre datetime con rangos de día.
  - **Orden por header** (click): asc/desc con flecha; `sortField`/`field`; `sortable:false` desactiva.
  - Maneja `paginate` (skip/take/sort/filter/requireTotalCount), paginación en pills, refresh con loading (arriba-derecha, se deshabilita).
  - `ref` expone `{ reload, patchRow(id,patch), removeRow(id) }`.
  - Filtro DevExtreme: ver parser real `app/Models/dxDataGrid.php` (contains/=/<>/>/</>=/<=, grupos `and`/`or`; sin `and` = OR).
- **`Components/CustomDropdown.jsx`** — dropdown custom estilo dashboard, menú en **portal** (position fixed) para no recortarse en contenedores con overflow. Props: `value, options, onChange, placeholder, minWidth, menuWidth, compact`.
- **`Components/CustomDatePicker.jsx`** — date-picker custom (calendario popover, portal, ES) para formularios. `value:'YYYY-MM-DD'`, `onChange(str)`.
- **`Components/DateRangeFilter.jsx`** — filtro de fecha (un control → popover con operador + calendario + rango), resumen corto. Lo usa `AdminTable` para columnas `filterType:'date'`.
- **`Components/ConfirmModal.jsx`** — modal de confirmación custom (portal, variant danger/primary, loading). Usar en lugar de `confirm()`/`alert()` para borrar/confirmar. Props: `open, title, message, confirmLabel, cancelLabel, variant, loading, onConfirm, onCancel`.
- Ejemplo de uso completo: `Admin/Quotes.jsx` (cliente filtra name+business, contacto email+phone, fecha con operador, estado con dropdown).

## CRUDs migrados a AdminTable (diseño Tuboplast)
- `Admin/Quotes.jsx` (icono `ti ti-receipt-2`), `Admin/Club.jsx` (icono `ti ti-users-group`).
- `Admin/Messages.jsx` → `Admin/MessageInbox.jsx` (compartido) migrado a `AdminTable` (icono `ti ti-message-dots`, prop `icon`/`countSuffix`). Modal detalle custom (`wfm-*`) + `ConfirmModal`. Columnas Contacto (name+business), Correo, Motivo, Fecha (date filter), Acciones.
- `Admin/Items.jsx` (icono `ti ti-package`): tabla a `AdminTable` (headerAction "Nuevo item", switch de estado con `filterOptions` Activo/Inactivo, ConfirmModal). **El modal de crear/editar se rehízo como modal custom** (`wfi-*`, misma línea que Quotes: overlay portal-less con `display` toggle, secciones `wfi-sec`, header/body/foot, botones pill). Los 5 selects select2 → `CustomDropdown` (estado `selects`, helper `FieldSelect`); `alert` de imagen requerida → error inline (`wfi-err`). Form siempre montado, se muestra/oculta con `formOpen`.
- `Admin/Categories.jsx` (icono `ti ti-category`): `AdminTable` + modal custom (`wfca-*`) + `ConfirmModal`. Columnas name/description/image/status/created_at(date)/acciones. Imagen con fallback `/assets/img/items/item-1.png`.
- `Admin/Distributors.jsx` (icono `ti ti-truck-delivery`) y `Admin/Branches.jsx` (icono `ti ti-building-store`): **renombrados a inglés** desde `Distribuidores.jsx`/`Sucursales.jsx`. `AdminTable` + modal custom (`wfd-*`/`wfb-*`) con mapa Google + selects dept/prov/distrito como `CustomDropdown` (controlados por estado; se eliminaron los `*Ref` de select2 y sus effects de sync). `ConfirmModal` para borrar. Controllers `$reactView` → `Admin/Distributors` / `Admin/Branches`. Rutas (`/admin/distributors`, `/admin/branches`) y `Menu.jsx` ya estaban en inglés. **OJO**: `public/build/manifest.json` aún referencia los nombres viejos — se regenera con `npm run build`. Los Rest siguen siendo `DistribuidoresRest`/`SucursalesRest` (endpoints sin cambio).
- Iconos copiados del `Menu.jsx` por sección.

## Distribuidores y sucursales conectados a BD (público lee de la tabla)
- **Migración** `2026_06_27_000000_add_directory_fields_to_distribuidores_table`: + `name`, `phone`, `business_hours`, `featured` (bool). `Distribuidor` model fillable/casts actualizados. `DistributorController.beforeSave` valida los nuevos campos (`featured` normalizado a 0/1).
- **Admin `Distributors.jsx`**: formulario con sección "Datos del distribuidor" (nombre comercial, teléfono, horario, toggle **Destacado** custom controlado `wfd-tg` — NO usar `SwitchFormGroup` para campos del form porque es uncontrolled/no re-monta). Columna "Distribuidor" (name+phone+badge Destacado).
- **`LandingController`**: `distributorsView` mapea la tabla a la forma pública (`name/phone/hours/highlighted/lat/lng`), `orderByDesc('featured')`. Nuevo bloque `Contact` que pasa `branches` (Sucursal activas con lat/lng/address).
- **Público `Distributors.jsx`**: se eliminó `fallbackDistributors`; ahora lee SOLO de `props.distributors` (BD).
- **Público `Contact.jsx`**: el punto del mapa sale de `props.branches` (primera sucursal con coords); fallback a constante. La "Sede central" del sidebar usa la dirección de la sucursal.
- **Teléfono con prefijo**: migración `2026_06_27_000100_add_phone_prefix_to_distribuidores_table` (+`phone_prefix`). Admin form usa `CustomDropdown` **searchable** con `public/phone_prefixes.json` (guarda `beautyCode` ej. `+51`). Público muestra `prefix + phone`. `CustomDropdown` ahora soporta `searchable` (input de búsqueda; opción puede traer `search`) y ya NO se cierra al hacer scroll dentro de su propio menú.
- **Seeder** `LocationsSeeder` (registrado en `DatabaseSeeder`):
  - **Distribuidores**: importados del directorio de tuboplastperu.com (WP Store Locator, 146 nombres). Su API `store_search` da error fatal y el REST solo expone nombres+categoría, así que dirección/coordenadas se enriquecieron con **Google Places** (key `GMAPS_API_KEY`). **departamento/provincia/distrito + ubigeo se derivan de `ubigeo-inei.json` por las COORDENADAS** (centroide INEI más cercano, desambiguando por nombre de distrito) — no por el texto de Google que viene sucio. Solo se siembran los que tienen coords + dirección: **132** (14 descartados). 21 `featured` (categoría "Distribuidores"). Todos con dpto/prov/distrito/ubigeo. Data en `database/data/distribuidores.json`; seeder hace **delete + insert** (espejo autoritativo, re-seedear revierte).
  - **Sucursal**: sede central Ate (de /contactanos).
  - Correr en deploy: `php artisan migrate` + `php artisan db:seed --class="Database\\Seeders\\LocationsSeeder"` (o `db:seed`).
  - Para regenerar el JSON: Places Text Search + Details por nombre, filtrado a Perú (bounding box), remap a INEI por distrito (scripts ad-hoc en node, no versionados).

## Fix cache de iconos/logo (desaparecían en refresh normal, salían solo con Ctrl+Shift+R)
- Causa: la fuente Tabler (`tabler-icons.woff2`) tenía `?v3.4.0` fijo y se reemplazó sin bumpear; el navegador servía la copia vieja cacheada en refresh normal (glyphs nuevos en blanco). Además `icons.min.css`/`mdi-icons.css`/`app.min.css`/`config.js`/`app.js` se cargaban sin cache-busting.
- Fix: bumpeada la query de la fuente en `public/lte/assets/css/icons.min.css` (`?v3.4.0-tbp2`) + helper `$v()` (filemtime) en `admin.blade.php` y `public.blade.php` para versionar automáticamente CSS/JS del tema (se re-bustea solo cuando cambia el archivo).

## Próximos pasos / pendientes
- Migrar los CRUDs restantes (Users, Roles...) a `AdminTable` + diseño Tuboplast. Patrón: copiar el icono del `Menu.jsx`, columnas con `filterFields`/`filterType`, modal custom + `ConfirmModal` para borrar. Para formularios con selects, usar `CustomDropdown` (no select2/`SelectFormGroup`) como en `Items.jsx`/`Distributors.jsx`.
- (Pendiente usuario) importar `productos.json` en el server.
- Cuando el usuario diga: build + commit + push de todo.

## Notas memoria (`~/.claude/.../memory`)
- `no-npm-build-hot-reload`, `no-auto-commit-push`.
