import { v4 as uuid4 } from 'uuid'

function getRandomString() {
  return uuid4()
}

export { getRandomString }
