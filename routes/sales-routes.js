const express = require('express');
const router  = express.Router();
let Sale = require('../models/Sale')
let Product = require('../models/Product');

//ROlES MIDDLEWARE
const checkRoles = require('../middlewares/checkRoles')

//Add sale
router.post('/checkout', (req,res) => {

    Sale.create({ 
        sale:req.body.sale ,
        total:req.body.total,
        salesMan:req.body.salesMan,
        store:req.body.store
    })
    .then(()=> res.json('sale added'))
    .catch(err => console.log(err))
    
    req.body.sale.forEach( async ele => {
        await Product.findByIdAndUpdate(ele._id,{stock:ele.newStock})
    })
})

//All sales
router.get('/sales', checkRoles('admin'),(req, res) => {
    Sale.find({store:req.user.store}).populate('salesMan')
    .then(sales => res.json(sales))
    .catch(err => console.log(err))
})

//Sale Detail
router.get('/sales/detail/:id',checkRoles('admin'),(req,res) => {
    Sale.findById(req.params.id).populate('salesMan')
    .then(sale => res.json(sale))
    .catch(err => console.log(err))
  });

module.exports = router;

