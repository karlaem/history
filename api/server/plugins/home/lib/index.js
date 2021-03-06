const gallery = require('../../gallery/lib/gallery');

async function handler(request, reply) {
  const isRaw = request.query.raw;
  const viewPath = 'plugins/home/components/page.jsx';
  const galleries = await gallery.getGalleries();
  const out = { galleries };

  if (isRaw) {
    return out;
  }

  return reply.view(viewPath, out);
}

const register = (server) => {
  server.route({
    method: 'GET',
    path: '/',
    options: {
      description: 'Home landing page',
      handler,
      tags: ['react'],
    },
  });
};

const plugin = {
  register,
  name: 'home',
  version: '0.2.0',
};

module.exports = { plugin };
