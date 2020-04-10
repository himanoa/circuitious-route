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
const upsertProfilesEndPoint = `${cli.input[0]}/upsert-profiles`
const refreshTokenEndPoint= `${cli.input[0]}/refresh-token`

async function successStory() {
  const discordId =  "121212121212";
  const loginResponse = await fetch(loginUrlEndPoint, {method: "post", body: JSON.stringify({discordId}), headers: { 'Content-Type': 'application/json' }})
  const { loginId }  = await loginResponse.json()
  const authorizeResponse = await fetch(authorizeEndPoint(loginId), { method: "post" })
  const authorizeResponseBody  = await authorizeResponse.json()
  let { refreshToken, accessToken }  = authorizeResponseBody
  const verifyResponse = await fetch(verifyEndPoint, { method:  "get", headers: { Authorization: `Barer ${accessToken}` }})
  const verifyResponseBody = await verifyResponse.json()
  assert.strictEqual(verifyResponseBody.discordId, discordId)
  const refreshResponse = await fetch(refreshTokenEndPoint, {method: "post", body: JSON.stringify({refreshToken: refreshToken}), headers: { 'Content-Type': "application/json" } });

  const refreshTokenResponseBody =  await refreshResponse.json()
  accessToken = refreshTokenResponseBody.accessToken
  const upsertProfilesResponse = await fetch(upsertProfilesEndPoint, {
    method:  "put",
    headers: { "Content-Type": "application/json", Authorization: `Barer ${accessToken}` },
    body: JSON.stringify({ profiles: [{streamKey: "STREAM!!!"}] })
  })
  assert.strictEqual(upsertProfilesResponse.status, 200)
  const upsertProfilesResponseBody = await upsertProfilesResponse.json()
  console.dir(upsertProfilesResponseBody)
  const newVerifyResponse = await fetch(verifyEndPoint, { method:  "get", headers: { Authorization: `Barer ${accessToken}` }})
  const newVerifyResponseBody = await newVerifyResponse.json()
  console.dir(newVerifyResponseBody)
  assert.strictEqual(newVerifyResponse.status, 200)
}

successStory()
