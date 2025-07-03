import arcjet, { tokenBucket } from '@arcjet/next';

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:["userId"],
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate: 10, // tokens per second
            interval:3600,
            capacity: 10, // maximum tokens

        })
    ]
});

export default aj;