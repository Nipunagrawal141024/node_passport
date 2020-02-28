const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user Model
const User = require('../models/User');

module.exports = function(passport){
  passport.use(
    new localStrategy ({ usernameField: 'email'}, (email , password ,done) => {
    //Match User
    User.findOne({email:email})
    .then(user=>{
      if(!user)
      {
        return done(null , false , { message:'That email is not Registered'});
      }

      //Match Password
      bcrypt.compare(password , user.password , (err, isMatch)=>{    //password is the paramter which is pass above and 
      if (err) throw err                                         // user.password is the hased password becoz user is coming from database         

      if(isMatch) {
        return done(null , user)
      }else 
      {
        return done(null ,false , { message : 'Password Is Incorrect'})
      }
      })   
    })                                           
    .catch(err => console.log(err));
    })
  )
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}