var Service = require('node-windows').Service;

var svc = new Service({
    name: 'PreSales ScopeManager',
    description: 'The PreSales ScopeManager WebService.',
    script: require('path').join(__dirname, 'server.js')
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.uninstall();