// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PSDB } from 'planetscale-node'

const conn = new PSDB('main')

export default async (request, response) => {
  const {
    body: { email, name, password },
    method,
  } = request
  switch (method) {
    case 'POST':
      await conn.query(
        `insert into users (email, name, password) values ('${email}', '${name}', '${password}')`
      )
      response.statusCode = 201
      response.json({ email, name })
      break
    case 'GET':
      try {
        const [getRows, _] = await conn.query('select * from users')
        response.statusCode = 200
        response.json(getRows)
      } catch (e) {
        error = new Error('An error occurred while connecting to the database')
        error.status = 500
        error.info = {
          message: 'An error occurred while connecting to the database',
        }
        throw error
      }
      break
    default:
      response.setHeader('Allow', ['POST', 'GET'])
      response.status(405).end(`${method} method isn't allowed.`)
  }
}
