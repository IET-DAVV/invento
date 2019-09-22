vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    iet_cards: []
  },
  methods: {
    checkpoints: function () {
      ref_field = document.getElementById("ref")
      points_field = document.getElementById("count")
      ref_name = document.getElementById("ref_name")
      college = document.getElementById("college")
      branch = document.getElementById("branch")
      year = document.getElementById("year")

      ref_field.textContent = ""
      points_field.textContent = ""
      ref_name.textContent = ""
      branch.textContent = ""
      year.textContent = ""
      college.textContent = ""


      ref_id = document.getElementById("ref-id").value
      if (ref_id) {
        fetch('https://tusharsadhwani1.pythonanywhere.com/check?ref=' + ref_id)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              ref_field.textContent = data.result.referral
              points_field.textContent = data.result.count
              ref_name.textContent = data.result.name
              branch.textContent = data.result.branch
              year.textContent = data.result.year
              college.textContent = data.result.college
              console.log(data);
              console.log(data.result.name)
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
    vm.cards = data.leaderboard.slice(0, 7)
    vm.iet_cards = data.iet_leaderboard
  })
  .then(_ => {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < 10; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  })

