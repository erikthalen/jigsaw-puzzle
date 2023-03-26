import { createServer } from 'http'
import { createReadStream } from 'fs'
import { normalize, join, resolve, extname } from 'path'
import { parse } from 'url'

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const staticPaths = ['', 'demo', 'dist']

export const routes = {
  get: {
    '/': { response: 'index.html' },
  },
}

function merge(current, updates) {
  for (let key of Object.keys(updates)) {
    if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object')
      current[key] = updates[key]
    else merge(current[key], updates[key])
  }
  return current
}

const getRoute = (method, route) => {
  const matches = {}
  try {
    const r = (route || method)
      .replace('/', '')
      .split('/')
      .reduce((acc, cur, idx, arr) => {
        const fuzzy = Object.entries(acc).find(([k]) => k.includes(':'))
        if (fuzzy) merge(matches, { [fuzzy[0].replace(':', '')]: cur || '/' })
        return (acc[cur || '/'] || fuzzy[1])[
          idx === arr.length - 1 ? 'response' : 'subpages'
        ]
      }, routes[typeof route === 'string' ? method.toLowerCase() : 'get'])

    return { route: r, matches }
  } catch (error) {
    throw '404 - No route found'
  }
}

const getFile = name => path => {
  return new Promise((res, rej) => {
    try {
      const stream = createReadStream(join(resolve(path), normalize(name)))
      stream.on('error', rej)
      stream.on('open', () => res(stream))
    } catch (error) {
      rej(error)
    }
  })
}

async function sendFile(res, { file, name, status = 200 }) {
  try {
    if (file) {
      res.writeHead(200, { 'Content-Type': CONTENT_TYPES['.html'] }).end(file)
    } else {
      const stream = await Promise.any(staticPaths.map(getFile(name)))
      stream.pipe(
        res.writeHead(status, {
          'Content-Type': CONTENT_TYPES[extname(name)],
        })
      )
    }
  } catch (error) {
    throw '404 - No file found: ' + (file || name)
  }
}

async function handleRoute(req, res, { r, status = 200, query }) {
  if (typeof r.route === 'string')
    return await sendFile(res, { name: r.route, status })

  if (typeof r.route === 'function') {
    return r.route(
      {
        ...r.matches,
        query,
        send: async name => {
          const content = await Promise.resolve(name)
          return sendFile(
            res,
            extname(content) ? { name: content } : { file: content }
          )
        },
      },
      req,
      res
    )
  }

  throw '404 - No route found'
}

async function handleError(req, res, originalError) {
  try {
    await handleRoute(req, res, {
      r: getRoute('*') || getRoute('error'),
      status: 404,
    })
  } catch (error) {
    res.writeHead(404).end(originalError)
  }
}

export const server = () => {
  return createServer(async (req, res) => {
    const { method, url } = req
    const { query, pathname } = parse(url)
    try {
      return extname(normalize(pathname))
        ? await sendFile(res, { name: url })
        : await handleRoute(req, res, {
            r: getRoute(method, pathname),
            query: Object.fromEntries(new URLSearchParams(query)),
          })
    } catch (error) {
      await handleError(req, res, `${error}: ${url}`)
    }
  })
}

server().listen(3015, () => console.log('http://localhost:3015'))