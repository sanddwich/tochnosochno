import { Customer } from '../entities'
import * as _ from 'lodash'

export class CustomerService {
  setBonuses = (customer: Customer) => {
    if (customer.walletBalances && customer.walletBalances.length > 0) {
      const bonusWallet = _.find(customer.walletBalances, ['type', 1])

      if (bonusWallet) customer.bonus = bonusWallet.balance
    }
    return customer
  }
}
