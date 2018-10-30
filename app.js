'use strict';

const Hapi = require('hapi');
const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);

let users = []

let texto = {title:'La Abeja y La Paloma', text:`Cierto día muy caluroso, una paloma se detuvo a descansar sobre la rama de un árbol, al lado del cual discurría un límpido arroyuelo.
De repente, una abejita se acercó a beber, pero la pobrecita estuvo a punto de perecer arrastrada por la corriente. Al verla en tal aprieto la paloma, voló hacia ella y la sacó con el pico.
Más tarde, un cazador divisó a la paloma y se dispuso a darle muerte. En aquel mismo instante acudió presurosa la abeja y, para salvar a su bienhechora, clavó su aguijón en la mano del hombre.
El dolor hizo que el cazador sacudiese el brazo y fallara el tiro, con lo que se salvó la linda y blanca palomita.`}

io.on('connection', function(socket){
    socket.emit('login', true)

    socket.on('login', (user) => {
        if(users.indexOf(user) == -1){
            users.push(user)

            socket.emit('successLogin', {ok: 'Sesión iniciada', user: user})
        } else {
            socket.emit('errLogin', {err: 'El usuario ya existe', user: user})
        }
    })

    socket.on('initGame', (user) => {

        socket.emit('gameArr', texto)
    })
});

socketServer.listen(3455);

const server = Hapi.server({
    port: 3456,
    host: '0.0.0.0'
});

const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return h.file('./index.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();