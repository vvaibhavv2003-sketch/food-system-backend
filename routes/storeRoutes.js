const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');

// @desc    Get store settings
// @route   GET /api/store
router.get('/', async (req, res) => {
    try {
        let settings = await StoreSettings.findOne();
        if (!settings) {
            // Create default if not exists
            settings = await StoreSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update store settings
// @route   PUT /api/store
router.put('/', async (req, res) => {
    try {
        const {
            storeName, heroTitle, heroSubtitle, heroImage, heroImages,
            contactEmail, contactPhone, upiId, printerType,
            address, gstNo, fssaiNo, taxPercent
        } = req.body;

        let settings = await StoreSettings.findOne();
        if (settings) {
            settings.storeName = storeName !== undefined ? storeName : settings.storeName;
            settings.heroTitle = heroTitle !== undefined ? heroTitle : settings.heroTitle;
            settings.heroSubtitle = heroSubtitle !== undefined ? heroSubtitle : settings.heroSubtitle;
            settings.heroImage = heroImage !== undefined ? heroImage : settings.heroImage;
            settings.heroImages = heroImages !== undefined ? heroImages : settings.heroImages;
            settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
            settings.contactPhone = contactPhone !== undefined ? contactPhone : settings.contactPhone;
            settings.upiId = upiId !== undefined ? upiId : settings.upiId;
            settings.printerType = printerType !== undefined ? printerType : settings.printerType;
            settings.address = address !== undefined ? address : settings.address;
            settings.gstNo = gstNo !== undefined ? gstNo : settings.gstNo;
            settings.fssaiNo = fssaiNo !== undefined ? fssaiNo : settings.fssaiNo;
            settings.taxPercent = taxPercent !== undefined ? taxPercent : settings.taxPercent;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            const newSettings = await StoreSettings.create({
                storeName, heroTitle, heroSubtitle, heroImage, heroImages,
                contactEmail, contactPhone, upiId, printerType,
                address, gstNo, fssaiNo, taxPercent
            });
            res.json(newSettings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
