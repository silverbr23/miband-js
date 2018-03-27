'use strict';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function test_all(miband, log) {

  log('Fetching device info...')
  let info = {
    time:     await miband.getTime(),
    battery:  await miband.getBatteryInfo(),
    hw_ver:   await miband.getHwRevision(),
    fw_ver:   await miband.getSwRevision(),
    serial:   await miband.getSerial(),
  }
  log('Info:', JSON.stringify(info, null, 2))

  log('Notifications demo...')
  await miband.showNotification('message');
  await delay(3000);
  //await miband.showNotification('phone');
  //await delay(5000);
  //await miband.showNotification('off');

  log('Tap MiBand button, quick!')
  miband.on('button', () => log('Tap detected'))
  try {
    await miband.waitButton(10000)
  } catch (e) {
    log('OK, nevermind ;)')
  }

  log('Heart Rate Monitor (single-shot)')
  log('Result:', await miband.hrmRead())

  log('Heart Rate Monitor (continuous for 30 sec)...')
  miband.on('heart_rate', (rate) => {
    log('Heart Rate:', rate)
  })
  await miband.hrmStart();
  await delay(30000);
  await miband.hrmStop();
}

module.exports = test_all;