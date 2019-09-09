vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    iet_cards: []
  }
})

fetch('https://tusharsadhwani1.pythonanywhere.com/leaderboard')
  .then(res => res.json())
  .then(data => {
    vm.cards = data.leaderboard
    vm.iet_cards = data.iet_leaderboard
  })
