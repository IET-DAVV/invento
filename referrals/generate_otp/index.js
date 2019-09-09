const url_string = window.location.href
const url = new URL(url_string)

const phone = url.searchParams.get("phone")
const name = url.searchParams.get("name")
const password = url.searchParams.get("password")

// api_url = 'http://localhost:5000/add?'
api_url = 'https://tusharsadhwani1.pythonanywhere.com/otp?'

if (phone && name && password) {
    if (password != 'invento') {
        alert("Incorrect Password")
        window.history.replaceState(null, null, window.location.pathname);
    } else {
        document.getElementById("form").reset()
        window.history.replaceState(null, null, window.location.pathname);

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
                    <a href='/invento-referrals/'>
                        Click Here
                    </a>
                    to continue creating your referral
                `
            }
        })
    }
}