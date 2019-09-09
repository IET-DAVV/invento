const url_string = window.location.href
const url = new URL(url_string)

const firstname = url.searchParams.get("firstname")
const lastname = url.searchParams.get("lastname")
const college = url.searchParams.get("college")
const year = url.searchParams.get("year")
const branch = url.searchParams.get("branch")
const phone = url.searchParams.get("phone")

// api_url = 'http://localhost:5000/add?'
api_url = 'https://tusharsadhwani1.pythonanywhere.com/add?'

if (firstname && lastname && college && year && branch && phone) {
    window.history.replaceState(null, null, window.location.pathname)
    document.getElementById("form").reset()

    messageBox = document.getElementById("message")
    messageBox.textContent = "Processing..."

    fetch(api_url + url_string.split('?')[1])
      .then(res => res.json())
      .then(body => {
          messageBox.style.backgroundColor = body.success ? 'rgb(31, 177, 87)' : 'red'
          messageBox.textContent = body.message
          if (body.success) {
              hintBox = document.getElementById('hint')
              hintBox.innerHTML = `
                  Your Referral has been generated!<br>
                  <br>
                  Send ask your friends to sign up to Invento events with the code <br>
                  <b>${body.code}</b> <br>
                  to gain points on the
                  <a href="leaderboard">leaderboard</a>
              `
          }
      })
}
