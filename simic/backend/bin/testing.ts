import meow from "meow"
import fetch from "node-fetch"
import  assert from "assert"


export const cli = meow(
  `
  Usage
    $ testing http://localhost:3000
  `
)


if(!cli.input[0]) {
  cli.showHelp()
  process.exit(0)
}


const loginUrlEndPoint = `${cli.input[0]}/login-url`
const authorizeEndPoint = (loginId: string) => `${cli.input[0]}/${loginId}/authorize`
const verifyEndPoint = `${cli.input[0]}/verify`
const upsertProfilsEndPoint = `${cli.input[0]}/upsert-profiles`
const refreshTokenEndPoint= `${cli.input[0]}/refresh-token`

async function successStory() {
  const loginResponse = await fetch(loginUrlEndPoint, {method: "post", body: JSON.stringify({discordId: "121212121212"}), headers: { 'Content-Type': 'application/json' }})
  const { loginId }  = await loginResponse.json()
  const authorizeResponse = await fetch(authorizeEndPoint(loginId), { method: "post" })
  const authorizeResponseBody  = await authorizeResponse.json()
  console.dir(authorizeResponseBody)
  const { refreshToken, accessToken }  = authorizeResponseBody
  const verifyResponse = await fetch(verifyEndPoint, { method:  "get", headers: { Authorization: `Barer ${accessToken}` }})
  console.dir(await verifyResponse.json())
}

successStory()
