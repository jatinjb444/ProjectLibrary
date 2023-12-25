const express = require('express');
const { getLogs } = require('../database');
const router = express.Router();


router.get("/adminLogs",async(req,res)=>{
    try{

        const newData = await getLogs();
        const data = JSON.parse(newData);
        res.render("adminLogs",{data})
    }
    catch(err){
        console.log(err);
    }
   
})

module.exports = router;