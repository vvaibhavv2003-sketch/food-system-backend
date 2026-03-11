const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, {
    timestamps: true
});

// Auto-delete document when expired (TTL index)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpData = mongoose.model('OtpData', otpSchema);

module.exports = OtpData;
