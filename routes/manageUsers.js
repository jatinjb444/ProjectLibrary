const express = require('express');
const { getUsers ,deleteUser , addUser, editUser} = require('../database');
const router = express.Router();

router.get("/manageUsers", async(req, res) => {
    const data = await getUsers();
    // const data = JSON.parse(users);
    console.log(data);
    res.render("manageUsers" ,{data});
  });

router.post("/manageUsers/deleteUserPost",async(req,res)=>{
  try{
  const usn =  req.body.usn;
  const data = await deleteUser(usn);
  console.log(data);
  }
  catch(err){
    console.log("The error is ",err);
  }
  res.redirect("/manageUsers");
})


router.post("/manageUsers/addUser", async(req,res)=>{
  try{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const usn = req.body.usn;
    const email = req.body.email;
    const pnumber = req.body.pnumber;
    const address = req.body.address;
    const pass = req.body.pass;

    const result = await addUser(usn,fname,lname,email,pnumber,address,pass)
    console.log(result);
  }
  catch(err){
    console.log(err);
  }
  finally{
    res.redirect("/manageUsers")
  }
})

router.post("/manageUsers/editUserPost",async(req,res)=>{
  try{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const usn = req.body.usn;
    const email = req.body.email;
    const pnumber = req.body.pnumber;
    const address = req.body.address;
    const pass = req.body.pass;
    const res = await editUser(fname,lname,email,pnumber,address,usn,pass);
    console.log(res);
  }
  catch(err){
    console.log(err);
  }
  finally{
    res.redirect("/manageUsers");
  }
})

module.exports = router;