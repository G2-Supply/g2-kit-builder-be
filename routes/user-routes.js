// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 

// middlware imports
const mw = require('../middleware/users-middleware');

// model imports 
const Users = require('../models/users-model');

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
router.get('/:_id',(req, res) => {
    const { _id } = req.params; 

    Users.findById(_id)
        .then(docs => {
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// reset password
router.get('/reset', (req, res) => {
    
    Users.findOne({
        resetPasswordToken: req.query.resetPasswordToken,
        // resetPasswordExpires: Date.now() + 360000
    })
    .then(user => {
        if(!user) {
            console.log('password reset link is invalid or has expired'); 
            res.json('password reset link is invalid or has expired')
        } else {
            res.status(200).json({
                username: user.username,
                message: 'password reset link a-ok'
            })
        }
    })
})
// ======================== POST Requests ==========================

// add a user
router.post('/', (req, res) => {
    console.log(req.body); 
    const user = new Users({
        email: req.body.email,
        password: req.body.password,
        first_name:  req.body.first_name,
        last_name:  req.body.last_name,
        company:  req.body.company,
    });
  
    // saving the user to the users collection
    user.save()
    .then(user => {
        const token = generateToken(user); 
        res.status(201).json({ data: user, token })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// signing in
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    Users.findOne({ email: email })
        .then(user => {
            // Create a token
            const token = generateToken(user)
    
            res.status(201).json({ message: 'Welcome back!', token });
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error.', error: `${err}` }); 
        })
  })

// account recovery endpoint
router.post('/forgot-password', (req, res) => {
    const { email } = req.body; 

    Users.findOne({ email: email })
        .then(user => {
            if(!user) {
                console.log('email not in database'); 
                res.status(404).json('This email is not associated with an account.'); 
            } else {
                const token = crypto.randomBytes(20).toString('hex'); 
                console.log(token); 
                Users.findByIdAndUpdate(user._id, { accountRecoveryToken: token, resetPasswordExpires: Date.now() + 360000 })
                    .then(response => console.log(response))
                    .catch(err => console.log(err)); 

                const transporter = nodemailer.createTransport({
                    service: 'Godaddy',
                    auth: {
                        user: `${process.env.EMAIL_ADDRESS}`,
                        pass: `${process.env.EMAIL_PASSWORD}`
                    }
                }); 

                const mailOptions = {
                    from: `${process.env.EMAIL_ADDRESS}`,
                    to: `${user.email}`,
                    subject: 'G2 Kit Builder - Password Reset Link',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your G2 Kit Builder account.  
                    
                    Please click the following link, or paste it into your browser to complete the process.  This link will expire in 1 hour.
                    
                    http://localhost:3001/reset/${token}

                    If you did not request this, please ignore this email and your password will remain unchanged.
                    `
                }

                transporter.sendMail(mailOptions, function(err, response) {
                    if (err) {
                        console.error('There was an issue: ', err); 
                    } else {
                        console.log('Response: ', response); 
                    }
                }); 
            }
        }); 
}); 
  
// ======================== PUT Requests ===========================

// update specific user information 
router.put('/:_id', mw.validateUserId, mw.validateUniqueEmail, (req, res) => {
    const { _id } = req.params;

    Users.findByIdAndUpdate(_id, req.body)
        .then(updatedUser => {
            res.status(204).json({ data: updatedUser }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// updating password 
// router.put('/updatePasswordViaEmail', (req, res) => {
//     Users.findOne({ username: req.body.username })
//         .then(user => {
//             if(user) {
//                 console.log('user exists'); 
//                 bcrypt  
//                     .hash(req.body.password, 12)
//                     .then(hashedPassword => {
//                         user
//                     })
//             }
//         })
// })

// ======================== DELETE Requests ========================

// delete user by id
router.delete('/:_id', (req, res) => {
    const { _id } = req.params;

    Users.findByIdAndRemove(_id)
        .then(deletedUser => {
            res.status(204).json({ data: { message: `User deleted successfully.`, deletedUser }}); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// jwt function
const generateToken = user => {
    // Create the payload and options
    const payload = {
        subject: user.id,
        email: user.email,
    };
    const options = {
        expiresIn: '8h',
    };

    return jwt.sign(payload, process.env.SECRET, options)
}

module.exports = router; 