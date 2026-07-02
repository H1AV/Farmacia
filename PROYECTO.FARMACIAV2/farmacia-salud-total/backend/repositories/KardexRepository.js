import KardexControl from '../models/KardexControl.js';

export const registrarKardex = async (datosKardex, transaccion) => {
  return await KardexControl.create(datosKardex, { transaction: transaccion });
};
