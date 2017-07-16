import mongoose from 'mongoose';
import { Router } from 'express';
import Lottery from '../model/lottery';
import MyNumbers from '../model/mynumbers';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
    let api = Router();


    api.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Expose-Headers', 'Content-Length');
      res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
      return next();
  });



    // CRUD - Create Read Update Delete





    // '/v1/lottery/add' - Create
    api.post('/add', authenticate, (req, res) => {
        let newLottery = new Lottery();
        newLottery.gameType = req.body.gameType;
        newLottery.drawDate = req.body.drawDate;
        newLottery.standardNumbers = req.body.standardNumbers;
        newLottery.bonusNumber = req.body.bonusNumber;
        newLottery.save(err => {
            if (err) {
                res.send(err);
            }
            //res.json({ message: "Lottery saved successfully" });
            res.json(newLottery.id);
        });
    });

    // '/v1/lottery/' - Read
    //Get all lotteries, orded by drawDate descending
    api.get('/', (req, res) => {
        Lottery.find({}, null, {sort: {drawDate: -1}}, (err, lotterys) => {
            if (err) {
                res.send(err);
            }
            res.json(lotterys);
        });
    });

    // '/v1/lottery/latest' - Read
    //Get latest lottery numbers
    api.get('/latest', (req, res) => {
        Lottery.find({}, null, {sort: {drawDate: -1}, limit: 1}, (err, lotterys) => {
            if (err) {
                res.send(err);
            }
            res.json(lotterys);
        });
    });

    // '/v1/lottery/mynumbers' - Read
    //Get all my numbers
    api.get('/mynumbers/', (req, res) => {
        MyNumbers.find({}, (err, mynumbers) => {
            if (err) {
                res.send(err);
            }
            res.json(mynumbers);
        });
    });

    // '/v1/lottery/mynumbers' - Read
    //Get all my numbers for a given lottery ID
    api.get('/mynumbers/:id', (req, res) => {
        MyNumbers.find({lottery: req.params.id}, (err, mynumbers) => {
            if (err) {
                res.send(err);
            }
            res.json(mynumbers);
        });
    });

    // '/v1/lottery/:id' - Read
    //Get one lottery
    api.get('/:id', (req, res) => {
        Lottery.findById(req.params.id, (err, lottery) => {
            if (err) {
                res.send(err);
            }
            res.json(lottery);
        });
    });

    // '/v1/lottery/:id' - Update
    api.put('/:id', authenticate, (req, res) => {
        Lottery.findById(req.params.id, (err, lottery) => {
            if (err) {
                res.send(err);
            }
            lottery.gameType = req.body.gameType;
            lottery.drawDate = req.body.drawDate;
            lottery.standardNumbers = req.body.standardNumbers;
            lottery.bonusNumber = req.body.bonusNumber;
            lottery.myNumbers.push(req.body.myNumbers);
            lottery.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Lottery updated successfully" });
            });
        });
    });

    // '/v1/lottery/:id' - Delete
    api.delete('/:id', authenticate, (req, res) => {
        Lottery.findById(req.params.id, (err, lottery) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (lottery === null) {
                res.status(404).send("Lottery not found");
                return;
            }
            Lottery.remove({
                _id: req.params.id
            }, (err, lottery) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                MyNumbers.remove({
                    lottery: req.params.id
                }, (err, mynumbers) => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: "Lottery successfully removed!"});
                    });
                });
            });
        });

        // '/v1/lottery/mynumbers/add' - Create
        api.post('/mynumbers/add', authenticate, (req, res) => {
            let newMyNumbers = new MyNumbers();

            newMyNumbers.gameType = req.body.gameType;
            newMyNumbers.drawDate = req.body.drawDate;
            newMyNumbers.standardNumbers = req.body.standardNumbers;
            newMyNumbers.bonusNumber = req.body.bonusNumber;

            //console.log(req.body);

            newMyNumbers.save((err, mynumbers) => {
                if (err) {
                    res.send(err);
                    console.log(err);
                }
                //console.log(res.sendStatus());
                res.json({ message: "My Numbers saved successfully" });
            });
        });



    // Update mynumbers to tie to specific lottery (once winning numbers are scraped)
    // '/v1/lottery/mynumbers/:id'
    api.put('/mynumbers/:id', authenticate, (req, res) => {
        MyNumbers.findById(req.params.id, (err, mynumbers) => {
            if (err) {
                res.send(err);
            }
            mynumbers.gameType = req.body.gameType;
            mynumbers.drawDate = req.body.drawDate;
            mynumbers.standardNumbers = req.body.standardNumbers;
            mynumbers.bonusNumber = req.body.bonusNumber;
            if (req.body.matchedNumbers !== null){
                mynumbers.matchedNumbers.push(req.body.matchedNumbers);
            }
            mynumbers.matchedBonus = req.body.matchedBonus;
            mynumbers.checkedYet = req.body.checkedYet;
            mynumbers.lottery = req.body.lottery;

            mynumbers.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "My Numbers updated successfully" });
            });
        });
    });



    // Get all mynumbers for a specific lottery ID
    // '/v1/lottery/mynumbers/:id'
    api.get('/mynumbers/:id', (req, res) => {
        MyNumbers.find({lottery: req.params.id}, (err, mynumbers) => {
            if (err) {
                res.send(err);
            }
            res.json(mynumbers);
        });
    });

    return api;
}
