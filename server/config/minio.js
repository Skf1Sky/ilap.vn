const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '192.168.1.40', 
    port: 9000,
    useSSL: false, // Trong mạng LAN dùng false
    accessKey: 'Lv58H5x4PiM9dnQcuYgt', 
    secretKey: 'CKKYXEZ3HuVAINXIQynBb3eIdGoyX0LPa8B1Vjj6', 
    pathStyle: true 
});

const BUCKET_NAME = 'ilap-images';

async function initMinioBucket() {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            const policy = {
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow", Principal: "*", Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                }]
            };
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
            console.log(`🔓 MinIO: Đã tạo & mở khóa bucket "${BUCKET_NAME}"`);
        } else {
            console.log(`✅ MinIO: Bucket "${BUCKET_NAME}" đã sẵn sàng.`);
        }
    } catch (err) { console.error("❌ MinIO init error:", err.message); }
}

module.exports = {
    minioClient,
    BUCKET_NAME,
    initMinioBucket
};
