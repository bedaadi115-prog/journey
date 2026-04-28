export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 当请求这个接口时，我们在后端进行密码校验并返回密钥
    if (url.pathname === '/api/getKeys') {
      const authHeader = request.headers.get('Authorization');
      
      // 比对你在 Cloudflare 后台设置的 AUTH_PASSWORD
      if (authHeader === env.AUTH_PASSWORD) {
          return new Response(JSON.stringify({
              id: env.COS_SECRET_ID,
              key: env.COS_SECRET_KEY
          }), { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('Unauthorized', { status: 401 });
    }
    
    // 如果是普通网页请求，直接返回正常的网页文件
    return env.ASSETS.fetch(request);
  }
};
