import multiparty from 'multiparty';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

export default async function handle(req,res){

    const bucketName = 'dany-aws-ecommerce';
    const form = multiparty.Form();
    const {fields,files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err) reject(err);
            resolve({fields, files});
        });
    });

    console.log('Length of files', files.file.length);
    
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    // client.send(new PutObjectCommand({
    //     Bucket: 'dany-aws-ecommerce',
    //     Key: files.file[0].originalFilename,
    //     Body: files.file[0].path,
    //     ACL: 'public-read',
    //     ContentType: files.file[0].headers['content-type']
    // }), (err, data) => {
    //     if(err) console.log(err);
    //     console.log(data);
    // });
    const links = [];
    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFileName = `${Date.now()}.${ext}`;  
        console.log(ext);
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFileName,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));
        const url = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
        links.push(url);
    }
     
    return res.json({links});

}

export const config = {
    api: {
        bodyParser: false
    },
}
/*
    - Add multiparty middleware to handle multipart/form-data
    - Install @aws-sdk/client-s3
    - Install npm install mime-types
*/