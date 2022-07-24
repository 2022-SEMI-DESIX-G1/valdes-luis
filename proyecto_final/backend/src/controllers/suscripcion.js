const { response } = require('express');
const Suscripcion = require('../models/suscripcion');
const buscarSuscripcion = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [suscripcion, totalSuscripcion] = await Promise.all([
        Suscripcion.find().skip(desde),
        Suscripcion.count()
    ])
    res.json({
        ok: true,
        suscripcion,
        totalSuscripcion
    });
}
const crearSuscripcion = async (req, res = response) => {
    const { email } = req.body;
    const emailExiste = await Suscripcion.findOne({ email });
    if (emailExiste) {
        return res.status(200).json({
            ok: false,
            msg: 'El correo ya existe'
        });
    }else{
    try {
        const suscripcion = new Suscripcion(req.body)
        suscripcion.email = email;
        const suscripcionnueva = await suscripcion.save();
        res.json({
            ok: true,
            suscripcionnueva
        })
    } catch (error) {
        res.status(200).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
}
module.exports = {
    crearSuscripcion,
    buscarSuscripcion
}