import { UserRequest, Professional } from "../types";

// SERVICE LAYER
// En una implementación real, aquí reemplazaríamos los console.log por:
// await fetch('https://script.google.com/macros/s/TU_SCRIPT_ID/exec', { method: 'POST', body: ... })

export const saveUserRegistration = async (user: UserRequest, biometricData: any) => {
  const timestamp = new Date().toISOString();
  
  // Estructura de datos para la Base de Datos Maestra
  const record = {
    TYPE: 'USUARIO_NUEVO',
    FECHA: timestamp,
    NOMBRE: user.name,
    EMAIL: user.email,
    TELEFONO: user.phone,
    UBICACION: user.location,
    PROBLEMA: user.problemDescription,
    VALIDACION: 'BIOMETRIA_OK',
    // En producción, aquí enviaríamos las URLs de las fotos subidas a un bucket (AWS S3 / Firebase Storage)
    // No enviamos los base64 directos a Google Sheets porque son muy pesados.
    DATA_REF: `biometria/${user.email}_${Date.now()}` 
  };

  // Simulación de envío a Servidor Seguro
  console.log(">>> ENVIANDO A BASE DE DATOS MANO YA (Google Sheets) >>>", record);
  
  // Aquí es donde la app "conecta" con tu backend.
  return true;
};

export const saveProfessionalRegistration = async (proData: any, biometricData: any) => {
  const timestamp = new Date().toISOString();

  const record = {
    TYPE: 'PROFESIONAL_SOLICITUD',
    FECHA: timestamp,
    NOMBRE: proData.name,
    EMAIL: proData.email,
    TELEFONO: proData.phone,
    RUBRO: proData.trade,
    ZONA: proData.location,
    ESTADO: 'PENDIENTE_REVISION_CEO'
  };

  console.log(">>> ENVIANDO SOLICITUD PROFESIONAL A BASE DE DATOS >>>", record);
  return true;
};