// Configuracion central de moment para el panel.
//
// Antes se cargaba `moment-timezone.js` como <script> global (~780KB) solo para
// hacer `moment.tz.setDefault('UTC')`. Aqui usamos la libreria SIN su base de
// datos de zonas y registramos unicamente la zona UTC (la unica que usamos), de
// modo que el comportamiento es identico pero el peso baja a ~90KB y se empaqueta
// con Vite (cacheado y parseado una sola vez), no bloquea el render.
import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone/moment-timezone'; // adjunta moment.tz a la MISMA instancia, sin data

// Zona UTC empaquetada (nombre|abrev|offset|...). Reemplaza la data completa.
if (!moment.tz.zone('UTC')) {
  moment.tz.add('UTC|UTC|0|0|');
}
moment.tz.setDefault('UTC');
moment.locale('es');

// Compatibilidad: gran parte del código usa `moment` como global (sin import),
// porque historicamente venia de un <script>. Lo exponemos para no romper nada.
if (typeof window !== 'undefined') {
  window.moment = moment;
}

export default moment;
