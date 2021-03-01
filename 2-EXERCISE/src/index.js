function User(score, hasBoost = true) {
  var history = []
  var debts = 0

  this.setScore = (score) => {
    score = score
  }

  // Estava setando a mesma variavel, então sempre o valor seria diferente do passado no teste
  this.setDebts = (debt) => {
    debts = debt
  }

  this.acceptOffer = () => {
    // Pagou sua negociação
    debts -= 1
    history.push({
      status: 'accept'
    })

  }

  this.brokenOffer = () => {
    // Quebrou algum acordo por nao ter pago a dívida ou apareceu mais uma negativaçāo no seu CPF
    debts += 1
    history.push({
      status: 'broken'
    })
  }

  this.getScore = () => {
    var boost = this.statusBoost()

    var boostMessage = ''
    // Math.round() sempre vai retonar um Number, então deve-se fazer uma verificação
    // caso o boost[1] for igual a null, o valor será null, se não irá setar o resultado do Math.round
    var boostValue = boost[1] == null ? null : Math.round(boost[1]);

    switch (boost[0]) {
      case 5:
        boostMessage = 'Você não possui turbo disponível'
        break;
      case 1:
        boostMessage = 'Você pode aumentar seu Score em até'
        break;
      case 2:
        boostMessage = 'Você perdeu o turbo do seu Score'
        break
      case 3:
        boostMessage = 'Você pode aumentar seu Score'
        break
      case 4:
        boostMessage = 'Você ativou o turbo do seu Score'
        break

      default:
        break;
    }

    return {
      score,
      boost: {
        status: boost[0],
        value: boostValue,
        message: boostMessage,
      },
    }
  }

  this.checkBoost = () => {
    if (!hasBoost) {
      // Verifica se ele possui o Turbo
      return undefined
    }

    var maxBoost = score < 200 ? score * 0.2 : score < 500 ? score * 0.2 : score < 800 ? score * 0.05 : score * 0.03
    var available = maxBoost
    var lost = 0
    var pending = 0
    var complete = 0

    if (history.find(h => h.status === 'broken')) {
      // Caso o consumidor tenha alguma quebra de acordo / alguma divida ele perde o Turbo do Score
      available = null
      lost = maxBoost
    } else if (history.find(h => h.status === 'accept')) {
      const debtsPaid = history.filter(h => h.status === 'accept').length
      if (0 == debts) {
        // Caso o consumidor tenha pago todas suas dividas, ele tem um boost completo e ativo!
        available = 0
        complete = maxBoost
      } else {
        // O consumidor não terminou de pagar suas contas é não quebrou nenhum acordo
        available = maxBoost / (debts + debtsPaid)
        pending = maxBoost - available
      }
    }

    return {
      available,
      lost,
      pending,
      complete,
    }
  }

  this.statusBoost = () => {
    var boost = this.checkBoost()
    /*
    1 = Disponivel
    2 = Perdido
    3 = Pendente
    4 = Completo
    5 = Indisponível
    */
    if (boost == null) {
      return [5, null]
    } else if (boost.lost) {
      return [2, boost.lost]
    } else if (boost.pending) {
      return [3, boost.pending]
    } else if (boost.available) {
      return [1, boost.available]
    } else if (!boost.available && !boost.pending) {
      return [4, boost.complete]
    } else {
      return null
    }
  }
}


module.exports = User
