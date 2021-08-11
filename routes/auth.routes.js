const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const config =require('config')
const router = new Router()

router.post('/registration', [
  check('email', 'Incorrect Email').isEmail(),
  check('password', 'Password should be longer then 3 and shorter then 12').isLength({min: 3, max: 12})
], async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: 'Incorrect request', errors})
    }

    const {email, password} = req.body;

    const candidate = await User.findOne({email})

    if (candidate) {
      return res.status(400).json({message: `User with email ${email}  already exist `})
    }

    const hashPassword = await bcrypt.hash(password, 8)
    const user = new User({
      email,
      password: hashPassword,
      score:0
    });
    await user.save()

    return res.json({message: 'User was created'})

  } catch (e) {
    console.log(E)
    res.send({message: 'Server error'})
  }
})

router.post('/login', async (req, res) => {
  try {

    const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user) {
     return  res.status(400).json({message:"User not found"})
    }

    const isPassValid = bcrypt.compareSync(password,user.password)

    if(!isPassValid) {
      return  res.status(400).json({message : 'Invalid Pass'})
    }

    const token = jwt.sign({ id: user.id }, config.get('secretKey'),{expiresIn: '1h'});

    return  res.json({
      token,
      user:{
        id:user.id,
        email:user.email,
        score: user.score
      }
    })

  } catch (e) {
    console.log(e)
    res.send({message: 'Server error'})
  }
})

module.exports = router
