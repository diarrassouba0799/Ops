export const MOCK_CREDENTIALS = {
  identifiant: '7858120491',
  password: '854525',
  code2fa: '547855',
  codeVirement: '630025',
  codeSecurite: '785473',
}

export function verifierCredentials(identifiant: string, password: string): boolean {
  return (
    identifiant === MOCK_CREDENTIALS.identifiant &&
    password === MOCK_CREDENTIALS.password
  )
}

export function verifier2FA(code: string): boolean {
  return code === MOCK_CREDENTIALS.code2fa
}

export function verifierCodeVirement(code: string): boolean {
  return code === MOCK_CREDENTIALS.codeVirement
}

export function verifierCodeSecurite(code: string): boolean {
  return code === MOCK_CREDENTIALS.codeSecurite
}