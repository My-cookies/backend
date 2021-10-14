const http = require("http")
const App = require("./app")

// on crée une instance de la classe App et on appelle certaines de ces fonctions
APP = new App()
try{
    APP.setup();
    APP.loadRoutes()
    APP.loadModels()
}catch (e) {
    throw typeof e === 'object' ? e : new Error(e);
}

// ici on normalise le port
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    // si c'est pas un int on le convertie
    if (port >= 0) {
        return port;
    }
    return false
}

const port = normalizePort(process.env.PORT ||  '3000');
APP.app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// on crée le server
const server = http.createServer(APP.app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);