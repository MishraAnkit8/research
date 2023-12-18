require('dotenv').config();
const pino = require('pino');

const transport = pino.transport({
    targets: [
        {
            target: 'pino/file',
            level: 'error',
            options: { destination: `${__dirname}/error.log` }
        },
        {
            target: 'pino/file',
            level: 'trace',
            options: { destination: `${__dirname}/info.log` }
        },
        // {
        //     target: 'pino/file',
        //     level: 'trace'
        // },
    ],
    dedupe: true,
})


module.exports.logger = pino({
    level: process.env[`LOG_LEVEL_${process.env.NODE_ENV}`] || 'info',
},
    transport
);