const express = require('express');
const router = express.Router();
const {isValidStudentLogin} = require("../database")

router.get("/", (req, res) => {
    res.render("studentLogin", { messages: req.flash() });
  });
  

  router.post("/studentLogin", async (req, res) => {
    const studentEid = req.body.studentEmail;
    const studentPass = req.body.studentPassword;
    const ress = await isValidStudentLogin(studentEid, studentPass);
  
    if (ress == -2) {
      req.flash("error", "wrong Password");
      return res.redirect("/");
  
    } 
    else if (ress == 0) {
      req.flash("success", "Form submitted successfully");
      res.render("studentDashboard");
    }
     else if (ress == -1) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }
  
  });
  
module.exports = router;  