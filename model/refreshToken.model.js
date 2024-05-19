import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: 'string',
        required: true
    }
});

RefreshTokenSchema.index({ userId: 1 }, { unique: true });

const refreshTokenModel = mongoose.model('refreshTokens', RefreshTokenSchema, 'refreshTokens');
export default refreshTokenModel;
