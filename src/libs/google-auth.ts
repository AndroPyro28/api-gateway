import { OAuth2Client} from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyIdToken = async (token: string)  => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return payload
}