const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const config = require('config')
const router = new Router()

router.post('/set/result',async (req, res) => {
  try {
    const {user, score} = req.body
    console.log('req',user, score);

    const candidate = await User.findOne({email: user.email})
      if( score > candidate.score ) {
        candidate.score = score;
      }
    await candidate.save()

    return res.json({
      'All': 'good'
    })

  } catch (e) {
    console.log(e)
    res.send({message: 'Error with saving score '})
  }
})
router.post('/score',async (req, res) => {
  try {
    const {user} = req.body
    const candidate = await User.findOne({email:user.email})

    return res.json({
      bestScore: candidate.score
    })

  } catch (e) {
    console.log(e)
    res.send({message: 'Error with getting best score '})
  }
})

module.exports = router
