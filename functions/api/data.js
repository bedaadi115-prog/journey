export async function onRequestGet(context) {
    const { env } = context;

    try {
        const object = await env.MY_BUCKET.get('data.json');

        if (object === null) {
            return new Response(JSON.stringify({ error: 'Not Found' }), { 
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate'
                }
            });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        // 强制不缓存，确保每次刷新获取最新数据
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        headers.set('Expires', '0');
        headers.set('Surrogate-Control', 'no-store');

        return new Response(object.body, {
            status: 200,
            headers: headers
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache'
            }
        });
    }
}
