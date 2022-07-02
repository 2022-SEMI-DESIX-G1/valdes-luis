
const { Router } = require('express');
const { getPokemon, getLocation, getEvolution, getCache } = require('../controllers/pokemon');

const router = Router();

router.get('/pokemon/:name', getPokemon);
router.get('/locations/:name', getLocation);
router.get('/evolution/:name', getEvolution);


module.exports = router;