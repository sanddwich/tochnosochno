export const cartAnimation = () => {
  const cart = document.getElementById('cartRoundButton')
  if (cart) {
    cart.classList.add('shake')
    setTimeout(function () {
      cart.classList.remove('shake')
    }, 500)
  }
}

export const productAnimation = (productId: string) => {
  const productImage = document.getElementById(productId)
  console.log(productImage)
  if (productImage) {
    productImage.classList.add('flyToCart')
    setTimeout(function () {
      productImage.classList.remove('flyToCart')
    }, 500)
  }
}
