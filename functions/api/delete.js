export async function onRequestDelete(context) {
    const { request, env } = context;
    const authHeader = request.headers.get('Authorization');

    if (!env.AUTH_PASSWORD || authHeader !== env.AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (!key) {
        return new Response(JSON.stringify({ error: 'Missing key parameter' }), { status: 400 });
    }

    try {
        await env.MY_BUCKET.delete(key);
        return new Response(JSON.stringify({ success: true, key }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
