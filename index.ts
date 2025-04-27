export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');

      if (!targetUrl) {
        return new Response('Missing "url" query parameter', { status: 400 });
      }

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        }
      });

      const content = await response.text();
      return new Response(content, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
