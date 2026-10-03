import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    try {
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT;

        const { token, expire, signature } = getUploadAuthParams({
            publicKey,
            privateKey,
        });

        return Response.json({
            token,
            expire,
            signature,
            publicKey,
            urlEndpoint,
        });
    } catch (error) {
        console.error("ImageKit Auth Error:", error);

        return Response.json(
            {
                message: "Failed to generate ImageKit authentication",
            },
            {
                status: 500,
            }
        );
    }
}