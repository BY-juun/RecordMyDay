const express = require('express');
const router = express.Router();
const { Day } = require('../models'); 
const { Plan } = require('../models'); 
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; 

router.post('/past',isLoggedIn,async(req,res,next)=>{
    try{
        console.log(req.body.FromdayInfo);
        console.log(req.body.TodayInfo);
        const PastPlan = await Day.findAll({
            where : {
                dayinfo : {[Op.gt] : req.body.FromdayInfo, [Op.lt] : req.body.TodayInfo},
                UserId : req.user.id,
            },
            order : [
                ['dayinfo','ASC']
            ],
            include : [{
                model : Plan,
                attributes : {
                    exclude : ['createdAt','updatedAt']
                },
            }],

        })
        if(!PastPlan){
            return res.status(403).send("그 기간의 계획이 없습니다.");
        }

        res.status(201).json(PastPlan);
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/',isLoggedIn,async(req,res,next)=>{
    try{
        const theday = await Day.findOne({
            where : {dayinfo : req.body.dayinfo}
        });
        if(theday){
            return res.status(403).send("이미 계획을 작성한 날짜입니다.");
        }

        await Day.create({ //await 안넣어주면, 비동기이기 때문에, 뒤에 res.json()이 먼저실행될수도있음.
            dayinfo : req.body.dayinfo,
            UserId : req.user.id,
        })
        res.status(200).send('ok')
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/today',isLoggedIn,async(req,res,next)=>{
    try{
        const curr = new Date();
        const utc = curr.getTime() +
            (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr =
            new Date(utc + (KR_TIME_DIFF));
        let today;
        if (kr_curr.getMonth() + 1 < 10) {
            if(kr_curr.getDate()<10){
                today = (String(kr_curr.getFullYear()) + "0" + String(kr_curr.getMonth() + 1) + "0" +String(kr_curr.getDate()))
            }else{
                today = (String(kr_curr.getFullYear()) + "0" + String(kr_curr.getMonth() + 1) + String(kr_curr.getDate()))
            }
           
        } else {
            if(kr_curr.getDate()<10){
                today = (String(kr_curr.getFullYear()) + String(kr_curr.getMonth() + 1) + "0" +String(kr_curr.getDate()))
            }else{
                today = (String(kr_curr.getFullYear()) + String(kr_curr.getMonth() + 1) + String(kr_curr.getDate()))
            }
        }
        today = Number(today);
        const todayPlan = await Day.findOne({
            where : {
                dayinfo : today,
                UserId : req.user.id,
            }
        })
        if(!todayPlan){
            return res.status(403).send("아직 오늘 계획이 없습니다");
        }

        const fulltodayPlan = await Day.findOne({
            where : {dayinfo : today},
            include : [{
                model : Plan,
                attributes : {
                    exclude : ['createdAt','updatedAt']
                },
            }]
        })
        res.status(201).json(fulltodayPlan);
    }catch(error){
        console.error(error);
        next(error);
    }
});





module.exports = router;