const AWS = require('aws-sdk');
require('dotenv').config();


const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey =  process.env.AWS_SECRET_ACCESS_KEY;



const uploadS3 = (file, folder, user_name, filename, contentType, contentDisposition, rand) => {

    const s3 = new AWS.S3({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region
    });
    

    if(!rand){
        rand = randomIntFromInterval(1000, 10000);
    }

    if(!contentType || !contentDisposition){
        contentType = 'image/png';
        contentDisposition = 'inline';
    }

    const uploadParams = {
        Bucket : bucketName + `/${folder}`,
        Body : file,
        Key : user_name + '_' + rand + '_' + filename ,
        ContentType : contentType,
        ContentDisposition : contentDisposition
    }

    return s3.upload(uploadParams).promise(); 
}


// Min and max included 
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


module.exports = {
    uploadS3
}