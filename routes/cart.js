const router = require('express').Router()
const Cart = require('../model/Cart')
const { verifyTokenAndAdmin, verifyTokenAndAuth } = require('./verifyToken')

//Create Cart (tao san pham trong gio hang)

router.post('/', verifyTokenAndAuth, async (req, res) => {
  const newCart = new Cart(req.body)
  try {
    const savedCart = await newCart.save()
    res.status(200).json(savedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Update (Cap nhat gio hang)
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedCart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Delete (xoa San pham)
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('Cart has been deleted...')
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get user Cart
router.get('/find/:userId', verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId })
    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get All Cart

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status.json(carts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
