export const cartAnimation = () => {
  const cart = document.getElementById('cartRoundButton')
  if (cart) {
    cart.classList.add('shake')
    setTimeout(function () {
      cart.classList.remove('shake')
    }, 500)
  }
}
