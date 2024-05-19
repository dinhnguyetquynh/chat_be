import mongoose from 'mongoose';

const { Schema } = mongoose;

const RevokedRefreshTokenSchema = new Schema({
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

RevokedRefreshTokenSchema.index({ userId: 1 }, { unique: true });

const revokedRefreshTokenModel = mongoose.model('revokedRefreshTokens', RevokedRefreshTokenSchema, 'revokedRefreshTokens');
export  default revokedRefreshTokenModel;
