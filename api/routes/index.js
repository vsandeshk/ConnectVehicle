const express = require('express')
var router = express.Router()
var ctrl = require('../controller/vehicle_controller.js');

router
  .route('/vehicle/:device_id/info')
  .get(function(req, res) {
    console.log("check");
    ctrl.vehicleInfo(req, res);
  });

router
  .route('/vehicle/:device_id/setFrequency')
  .post(function(req, res) {
    ctrl.setUpdateFrequency(req, res);
  });

router
  .route('/vehicle/:device_id/:command')
  .post(function(req, res) {
    ctrl.sendCommand(req, res);
  });

module.exports = router;
