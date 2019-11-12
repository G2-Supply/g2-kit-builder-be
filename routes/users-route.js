// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 

// middlware imports

// model imports 
const Users = require('../models/users-model');

// routes 

// ======================== GET Requests ===========================

// get list of all users (admin only)
router.get('/', (req, res) => {

    Users.find()
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// get user by id
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Users.findById(_id)
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== POST Requests ==========================

// add a user
router.post('/', mw.checkUserObj, mw.validateUniqueEmail, (req, res) => {
    const user = new Users({
      //body structure for created user
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number || null
    });
  
    // saving the user to the users collection
    user.save()
    .then(user => {
        res.status(201).json({ data: user })
    })
    .catch(err => {
        res.status(500).json({ error: err })
    });
});
  
// ======================== PUT Requests ===========================

// update specific user information 
router.put('/:_id', (req, res) => {
    const { _id } = req.params;

    Users.findByIdAndUpdate(_id, req.body)
        .then(updatedUser => {
            res.status(204).json({ data: updatedUser }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== DELETE Requests ========================

// delete user by id
router.delete('/:_id', (req, res) => {
    const { _id } = req.params;

    Users.findByIdAndDelete(_id)
        .then(deletedUser => {
            res.status(204).json({ data: { message: `User deleted successfully.`, deletedUser }}); 
        });
}); 