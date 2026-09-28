
export function throwError(message, errorCode = 400) {
  const error = new Error(message)
  error.statusCode = errorCode
  throw error
}

export function generateOtp() {
  return Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
}