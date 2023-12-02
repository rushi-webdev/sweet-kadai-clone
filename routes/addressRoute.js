const express = require('express');
const router = express.Router();
const Address = require('../models/addressModel'); // Import your Mongoose Address model
const User = require('../models/userModel'); // Import your Mongoose User model (if you have one)

// Route to create a new address for a user
router.post('/address', async (req, res) => {
    try {
        const { user, landmark, village, district, state, pincode, houseNo } = req.body;

        // Check if the user exists (you may want to add more validation)
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        const newAddress = new Address({
            user,
            landmark,
            village,
            district,
            state,
            pincode,
            houseNo,
        });

        const savedAddress = await newAddress.save();

        res.status(201).json(savedAddress);
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/address/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Query the database to find all addresses associated with the user's ID
        const userAddresses = await Address.find({ user: userId });

        res.status(200).json(userAddresses);
    } catch (error) { 
        console.error('Error fetching user addresses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/address/addressId', async (req, res) => {
    try {
        const {addressId} = req.body;
        const deliveryAddress = await Address.findById(addressId);;
        res.status(200).json(deliveryAddress);
    } catch (error) { 
        console.error('Error fetching user addresses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});

// Route to delete an address
// Assuming your existing code...

router.delete('/address', async (req, res) => {
    try {
        const { addressId } = req.body;
        // Check if the addressId is provided in the request body
        if (!addressId) {
            return res.status(400).json({ error: 'Address ID is required' });
        }

        // Perform the deletion based on the provided addressId
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        // Check if the address was found and deleted
        if (!deletedAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }
    
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Assuming your existing code...


module.exports = router;
