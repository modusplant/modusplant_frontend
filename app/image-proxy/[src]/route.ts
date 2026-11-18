export async function GET(
  _request: Request,
  { params }: RouteContext<'/image-proxy/[src]'>
) {
  const { src } = await params;
  const hostname = process.env.IMAGE_HOSTNAME;
  const port = process.env.IMAGE_PORT;
  const prefix = (process.env.IMAGE_PATH || '');
  if (!hostname) {
    return new Response('Image host is not configured', { status: 503 });
  }

  const protocol =
    port && process.env.NODE_ENV !== 'production' ? 'http' : 'https';
  const host = port ? `${hostname}:${port}` : hostname;
  const basePath = prefix ? `/${prefix}/` : '/';
  const target = new URL(
    `${protocol}://${host}${basePath}${src}`
  );
  if (!target.pathname.startsWith(basePath)) {
    return new Response('Invalid image path', { status: 400 });
  }

  const response = await fetch(target, { redirect: 'error' });
  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
