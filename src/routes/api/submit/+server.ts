import fs from 'fs';
import path from 'path';

import type { RequestHandler } from './$types';
import { Database } from '$lib/server/database';

import { SECRET_UPLOAD_PATH } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();

    const name = formData.get('name');
    const photo = formData.get('photo') as File;
    const deviceId = formData.get('deviceId');

    console.log('Received data:', { name, photo });

    if (!name || !photo || !deviceId) {
        return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const uploadDir = path.join(SECRET_UPLOAD_PATH);
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

    const buffer = Buffer.from(await photo.arrayBuffer());
    const timestamp = Date.now();
    const fileExt = photo.name.split('.').pop();
    const safeName = name.toString().replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '_');
    const fileName = `${timestamp}-${safeName}.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const id = await Database.registerSubmission(name.toString(), fileName);

    return new Response(JSON.stringify({ message: 'Submission received!', url: fileName, id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
