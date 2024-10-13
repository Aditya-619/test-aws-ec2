const { GetObjectCommand, PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    }
});

const generateUploadUrl = async (fileName, contentType) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: `users/profiles/${fileName}`,
            ContentType: contentType,
        });
        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.log('Error in generateUploadUrl', error);
    }
};


const getProfileImageUrl = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `users/profiles/${fileName}`,
    });
    console.log('key: ', `users/profiles/${fileName}`);
    const signedUrl = await getSignedUrl(client, command, {expiresIn: 3600});
    return signedUrl;
};


module.exports = { generateUploadUrl, getProfileImageUrl };