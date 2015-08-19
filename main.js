var app = require('app');
var Menu = require('menu')
var Tray = require('tray');
var powerSaveBlocker = require('power-save-blocker');

app.on('ready', function() {
  var activePath = __dirname + '/active.png';
  var inactivePath = __dirname + '/inactive.png';
  var isActive = false;
  var psid = null; // power saver id
  var tray = new Tray(inactivePath);

  // adding a context menu skips the click event
  // https://github.com/atom/electron/issues/1499
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: function() { app.quit(); } }
  ]);

  var clickHandler = function(e, bounds) {
    if (isActive) {
      tray.setImage(inactivePath);
      if (powerSaveBlocker.isStarted(psid)) {
        powerSaveBlocker.stop(psid);
      }
      console.log("enabling sleep");
    } else {
      tray.setImage(activePath);
      psid = powerSaveBlocker.start('prevent-display-sleep');
      console.log("disabling sleep");
    }
    isActive = !isActive;
  };

  tray.on('clicked', clickHandler);
  tray.on('double-clicked', clickHandler);  // undo fast clicks
});
