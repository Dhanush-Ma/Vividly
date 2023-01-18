const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { validateCheck, Customer } = require('../models/customers')

async function createCustomer(customerName, customerPhone){
    const customer = await new Customer(
        {
            name: customerName,
            phone: customerPhone
        }
    )

    try {
        const result = await customer.save()
        console.log(result)
        
    } catch (error) {
        console.log("Error: ", error.message)
    }
}

// createCustomer("Dhanush", "6380778441")


// Get Method for all existing genres
router.get('/', async (req,res) => {
    const customers = await Customer 
                            .find()
                            .sort({ name: 1 })
    
    res.status(200).json(customers)
})

// Get Method for Specific genre
router.get('/:id', async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("Nil")
        
    const customer = await Customer
                            .find({_id: req.params.id})
                            .catch((err) => console.log(err))
    
    if(!customer){
        res.status(404).send("Customer Not found! Sorry!")
        return
    }else{
         res.status(200).json(customer)
    }
})

// Post Method
router.post('/', async (req,res) => {

    const { error } = validateCheck(req.body)

    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }else{
        const customer = {
            name: req.body.name,
            phone: req.body.phone

        }

        try{
           const insertedCustomer = await new Customer(customer)
           const result = insertedCustomer.save()
           res.status(200).json(insertedCustomer)
        }catch(err){
            console.log(err.message)
        }
    }
})

// Update Method
router.put('/:id', async (req,res) => {
    // handle invalid genre type - 404
    const checkCustomer = await Customer.find({
        _id: req.params.id
    })

    // handle invalid genre name - 400
    const result = validateCheck(req.body)
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }

    const updateCustomer = await Customer.updateOne({_id: req.params.id}, {$set: {
        name: req.body.name,
        phone: req.body.phone
    }}, {new: true})
    
    if(updateCustomer.modifiedCount == 0){
        res.status(404).send("Genre Not found! Sorry!")
        return;
    }
    
    res.status(200).json(updateCustomer)
    
})



//delete Method
router.delete('/:id', async (req,res) => {
    // handle invalid genre type - 404
    const deleteCustomer = await Customer.deleteOne({
        _id: req.params.id
    })

    if(!deleteCustomer){
        res.status(404).send("Customer Not found! Sorry!")
        return;
    }

    res.status(200).json(deleteCustomer)

})


module.exports = router

