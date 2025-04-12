import fs from 'fs';
import path from 'path';
import mime from 'mime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;

	const filePath = path.resolve('uploads', filename);

	if (!filePath.startsWith(path.resolve('uploads'))) {
		return new Response('Forbidden', { status: 403 });
	}

	if (!fs.existsSync(filePath)) {
		return new Response('Not found', { status: 404 });
	}

	const fileBuffer = fs.readFileSync(filePath);
	const contentType = mime.getType(filePath) || 'application/octet-stream';

	return new Response(fileBuffer, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000'
		}
	});
};
