const express = require('express');
const router = express.Router();

const {
  createStatutoryRule,
  getStatutoryRules,
  deleteStatutoryRule
} = require('../controllers/statutory.controller');

router.post('/', createStatutoryRule);
router.get('/', getStatutoryRules);
router.delete('/:id', deleteStatutoryRule);

module.exports = router;
