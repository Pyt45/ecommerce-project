// const { resolve } = require("path/posix");

// const sleep = (ms) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     })
// }

// (async () => {
//     for (let i = 0; i < 5; i++) {
//         const date = new Date().toLocaleString().split(', ')[1];
//         const id = date.split(' ')[0].replace(':', '').replace(':', '')
//         console.log(id);
//         await sleep(1000);
//     }
// })();

const { v4: uuidv4 } = require('./server/node_modules/uuid');

// let arr = []

// const generateId = () => {
//     for (let i = 0; i < 20; i++)
//     {
//         const id = uuidv4().replace(/\-/g, '')
//         arr[i] = id;
//         if (arr[i])
//     }
// }

generateId(100);