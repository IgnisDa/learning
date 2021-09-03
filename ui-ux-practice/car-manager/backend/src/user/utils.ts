import * as bcrypt from 'bcrypt';

export async function getPasswordDigest(password: string) {
  const salt = await bcrypt.genSalt(16);
  const passwordDigest = await bcrypt.hash(password, salt);
  return passwordDigest;
}

export async function checkPassword(password: string, passwordDigest: string) {
  return await bcrypt.compare(password, passwordDigest);
}
