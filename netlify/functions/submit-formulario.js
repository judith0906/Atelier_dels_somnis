/* ============================================================
   submit-formulario.js — NETLIFY FUNCTION: recepción de formularios
   Atelier dels Somnis · Reus

   Punto único de entrada de los formularios del sitio. Su motivo de
   existir es de seguridad: valida el token de reCAPTCHA contra Google
   y solo entonces reenvía los datos al webhook de Make, de forma que
   la URL de Make nunca aparece en el código del navegador.

   El campo `tipoFormulario` del payload decide a qué webhook va
   ('inscripciones' o 'alquiler').

   Variables de entorno necesarias en Netlify:
     RECAPTCHA_SECRET_KEY · MAKE_WEBHOOK_* (ver el propio código)
   ============================================================ */

// Módulo 'https' nativo de Node.js. No hace falta instalar nada en package.json.
const https = require('https');

/**
 * Función auxiliar para hacer peticiones POST a servicios externos (Google y Make).
 * @param {string} url - Dirección de destino.
 * @param {object|string} data - Datos a enviar.
 * @param {boolean} isFormUrlEncoded - true para Google (formato formulario), false para Make (JSON).
 */
function postData(url, data, isFormUrlEncoded = false) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postDataString = isFormUrlEncoded ? data : JSON.stringify(data);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': isFormUrlEncoded
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
        'Content-Length': Buffer.byteLength(postDataString)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', (e) => reject(e));
    req.write(postDataString);
    req.end();
  });
}

/**
 * Handler principal. Netlify lo ejecuta al recibir una petición
 * en /.netlify/functions/submit-formulario
 */
exports.handler = async (event) => {

  // 1. Solo aceptamos POST. Cualquier otro método se rechaza.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Método no permitido. Solo POST.' })
    };
  }

  try {
    // 2. Leemos lo que ha enviado el navegador.
    const payload = JSON.parse(event.body || '{}');

    /* El formulario de la web envía la clave "captchaToken".
       Aceptamos también "recaptchaToken" por si en el futuro cambia el nombre. */
    const { captchaToken, recaptchaToken, tipoFormulario, ...formData } = payload;
    const token = captchaToken || recaptchaToken;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Falta el token de reCAPTCHA.' })
      };
    }

    // 3. Validamos el token contra los servidores de Google (servidor a servidor).
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET_KEY no está definida en las variables de entorno de Netlify.');
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyParams =
      `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(token)}`;

    const captchaRes = await postData(verifyUrl, verifyParams, true);
    const captchaResult = JSON.parse(captchaRes.body || '{}');

    // Si Google dice que el token es falso, manipulado, reutilizado o ha caducado
    if (!captchaResult.success) {
      console.warn('reCAPTCHA rechazado por Google:', captchaResult['error-codes']);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Verificación de reCAPTCHA no válida o expirada.' })
      };
    }

    /* 4. Elegimos el webhook según el formulario de origen.
       Así esta misma función sirve para inscripciones y para alquiler. */
    let makeWebhookUrl = '';

    if (tipoFormulario === 'inscripciones') {
      makeWebhookUrl = process.env.MAKE_INSCRIPCIONES_WEBHOOK_URL;
    } else if (tipoFormulario === 'alquiler') {
      makeWebhookUrl = process.env.MAKE_ALQUILER_WEBHOOK_URL;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Tipo de formulario no válido.' })
      };
    }

    if (!makeWebhookUrl) {
      throw new Error(`El webhook para "${tipoFormulario}" no está configurado en Netlify.`);
    }

    /* 5. Reenviamos los datos a Make.
       Fíjate en que "formData" ya NO incluye el token del captcha ni el tipoFormulario:
       los hemos separado arriba porque a Make no le hacen falta. */
    const makeRes = await postData(makeWebhookUrl, formData);

    /* Comprobamos de verdad que Make aceptó la petición.
       La versión anterior respondía "éxito" aunque Make devolviese un error,
       con lo que una inscripción podía perderse sin que nadie se enterase. */
    if (makeRes.statusCode < 200 || makeRes.statusCode >= 300) {
      console.error('Make rechazó la petición. Código:', makeRes.statusCode, 'Respuesta:', makeRes.body);
      return {
        statusCode: 502,
        body: JSON.stringify({ success: false, message: 'No se pudo registrar la solicitud. Inténtalo de nuevo.' })
      };
    }

    // 6. Todo correcto.
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Formulario verificado y enviado con éxito.' })
    };

  } catch (error) {
    /* Registramos el detalle en los logs de Netlify (solo tú los ves)
       pero al navegador le devolvemos un mensaje genérico, para no revelar
       información interna del servidor a posibles atacantes. */
    console.error('Error procesando la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error interno del servidor al procesar la solicitud.' })
    };
  }
};