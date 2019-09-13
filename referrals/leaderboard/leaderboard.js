vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    iet_cards: []
  },
  methods: {
    checkpoints: function () {
      ref_field = document.getElementById("check_ref")
      points_field = document.getElementById("check_points")
      ref_field.textContent = ""
      points_field.textContent = ""

      ref_id = document.getElementById("ref-id").value
      if (ref_id) {
        fetch('https://tusharsadhwani1.pythonanywhere.com/check?ref='+ref_id)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              ref_field.textContent = data.result.referral
              points_field.textContent = data.result.count
            } else {
              ref_field.textContent = ref_id
              points_field.textContent = "Not found"
            }
          })
      }
    }
  }
})

fetch('https://tusharsadhwani1.pythonanywhere.com/leaderboard')
  .then(res => res.json())
  .then(data => {
    vm.cards = data.leaderboard
    vm.iet_cards = data.iet_leaderboard
  })
