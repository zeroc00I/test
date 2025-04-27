interface Env {}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const targetUrl: string | null = url.searchParams.get('url');

      if (!targetUrl) {
        return new Response('Missing "url" query parameter', { status: 400 });
      }

      const response: Response = await fetch(targetUrl, {
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        },
      });

      const content: string = await response.text();
      return new Response(content, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return new Response(`Error: ${message}`, { status: 500 });
    }
  },
};
