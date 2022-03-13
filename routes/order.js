const router = require('express').Router()
const Order = require('../model/Order')
const { verifyTokenAndAdmin, verifyTokenAndAuth } = require('./verifyToken')

//Create order (tao san pham  )
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newOrder = new Order(req.body)
  try {
    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Update
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Delete (xoa San pham)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been deleted...')
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get user Oder
router.get('/find/:userId', verifyTokenAndAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get All order

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status.json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get Monthly income

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await Order.aggregate([
      { $match: { createAt: { $gte: prevMonth } } },
      {
        $project: {
          month: { $month: '$createAt' },
          sales: '$amount'
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' }
        }
      }
    ])
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
