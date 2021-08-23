const express = require('express');
const router = express.Router();
const { Plan } = require('../models'); 
const { Day } = require('../models'); 
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

router.post('/',isLoggedIn,async(req,res,next)=>{ //plan등록 req.body.dayInfo 와 req.body.plan이 온다.
    try{
        const theday = await Day.findOne({
            where : {dayinfo : req.body.dayInfo}
        });

        if(!theday){
            return res.status(403).send("등록하지 않은 날짜입니다.");
        }

        await Plan.create({ //await 안넣어주면, 비동기이기 때문에, 뒤에 res.json()이 먼저실행될수도있음.
            content : req.body.plan,
            DayId : theday.id,
        })

        res.status(200).send(req.body.plan);
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;