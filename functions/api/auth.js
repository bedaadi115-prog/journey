export async function onRequestGet(context) {
    const { request, env } = context;
    const authHeader = request.headers.get('Authorization');

    if (authHeader !== env.AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    return new Response(JSON.stringify({ success: true }));
}
