export const precacheImages = async (srcs: string[]) => {
  const promises = await srcs.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src

      img.onload = () => resolve(src)
      img.onerror = () => reject()
    })
  })
  await Promise.all(promises)
}
