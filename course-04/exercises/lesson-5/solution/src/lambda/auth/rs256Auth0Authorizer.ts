
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJHPyNdaJNPNwXMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi10aGVyMXQtci5hdXRoMC5jb20wHhcNMTkxMTA3MDUyNjE2WhcNMzMw
NzE2MDUyNjE2WjAhMR8wHQYDVQQDExZkZXYtdGhlcjF0LXIuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs0NkUjFXwSgaKOKjABLk4GH5
daDASEiIvi28u3upQbHhLTTVQw+f2sGD6DqapQFf2PBYYimS6zJ7zWmdfPdksZsA
lCJehr5B/0TkTxOUC8/22Oybd2X1WxrMEypVi/3rj4RnDuTD/pCZ5UhJG4A16ctM
lYhM2FO4F9oRPsDfDezpqvA2onjJl2SX7cnEhxWQuWWAh+AUdeIrydJwBYLuO1x4
PC2qriLjB2p3S9v1yA3GY9VeDfN1Gx/IVbBFuMc8I8y3rj2nbm0/OP3bl5uR8UJn
H5o+bHmkeQUXHxI+EJb9olJYTcD3OmNn9WkWNYwLXPbRcVF45U6v+AwLpNtrqwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSjLe81n+0JVSbr7gOa
wbYEXzVF1DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBADnYmNkZ
aLSfCouAAAaGpFjSfcNG+dttp1tbH7CyPcVBqOsB0ifDxOr7Z4xsSe8l6jNoqbFA
Jk+WY2iEHLVHt+X8L7O1mXrjKIKkDQM/k7CLmXh7IpU9sS4H5CSlMJzxzx0dzt0s
nmNtUE2FsfWyP8PJb07p5Uz7ZH+237d1Erj/THQjxpqxY21mJQ4fZZ4k7qVZKDJR
edpi8LC8dzJs/vem1ptYzKEzNFyaBc/UvdDP3TFw0q6FIJk2Aq2smcJa+w9Qwn/D
mZOSowtTdr1zv4TtQZAN2SE8wVNKQ/9H2X/VJdxX39ZkAhv68xwsUWBJgyrYncWX
0rfnufx3F7gCxjc=
-----END CERTIFICATE-----
`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
