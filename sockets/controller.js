const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
    
   socket.emit('ultimo-ticket', ticketControl.ultimo);
   socket.emit('estado-actual', ticketControl.ultimos4);

 

   // 'tickets-pendientes'
   socket.emit('tickets-pendientes', ticketControl.tickets.length);



    socket.on('siguiente-ticket', ( payload, callback ) => {
      
        
        const siguiente = ticketControl.siguiente();

        callback( siguiente );

        // TODO: Notificar que hay un nuevo ticket pendiente de asignar
        // socket.broadcast.emit('enviar-mensaje', payload );
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    });

    socket.on('atender-ticket', ({ escritorio}, callback) => {
        if( ! escritorio) {
             callback({
                ok: false,
                msg: 'Es escritorio obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );
        
        // TODO: Notificar cambio en los ultimos4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
       

        if( !ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            
          

           callback({
            ok: true,
            ticket
           })
        }
    })

}



module.exports = {
    socketController
}

