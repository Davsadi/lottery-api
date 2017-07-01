import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import lottery from '../controller/lottery';
import account from '../controller/account';

let router = express();

//Allow all requests from all domains & localhost
/*router.all('/*', function(req, res, next) {
  router.header("Access-Control-Allow-Origin", "*");
  router.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  router.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});*/

// connect to db
initializeDb(db => {

    // internal middleware
    router.use(middleware({ config, db }));

    // api routes v1 (/v1)
    router.use('/lottery', lottery({ config, db }));
    router.use('/account', account({ config, db }));


})

export default router;
