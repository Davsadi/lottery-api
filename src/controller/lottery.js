import mongoose from 'mongoose';
import { Router } from 'express';
import Lottery from '../model/lottery';
import MyNumbers from '../model/mynumbers';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
    let api = Router();

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
            res.json({ message: "Lottery saved successfully" });
        });
    });

    // '/v1/lottery/' - Read
    //Get all lotteries
    api.get('/', (req, res) => {
        Lottery.find({}, (err, lotterys) => {
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
            newMyNumbers.save((err, mynumbers) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "My Numbers saved successfully" });
            });
        });



    // Update mynumbers to tie to specific lottery (once winning numbers are scraped)
    // '/v1/lottery/mynumbers/:id'
    api.put('/mynumbers/:id', authenticate, (req, res) => {
        MyNumbers.findById(req.params.id, (err, mynumbers) => {
            if (err) {
                res.send(err);
            };
            MyNumbers.gameType = req.body.gameType;
            MyNumbers.drawDate = req.body.drawDate;
            MyNumbers.standardNumbers = req.body.standardNumbers;
            MyNumbers.bonusNumber = req.body.bonusNumber;
            MyNumbers.lottery = lottery._id;
            MyNumbers.save((err, mynumbers) => {
                if (err) {
                    res.send(err);
                }
                lottery.mynumbers.push(newMyNumbers);
                lottery.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: "My Numbers saved!"});
                });
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
