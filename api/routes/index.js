const express = require('express')
var router = express.Router()
var ctrl = require('../controller/vehicle_controller.js');

router
  .route('/vehicle/:device_id/info')
  .get(function(req, res) {
    ctrl.vehicleInfo(req, res);
  });

router
  .route('/vehicle/:device_id/setFrequency')
  .post(function(req, res) {
    ctrl.setUpdateFrequency(req, res);
  });

module.exports = router;
