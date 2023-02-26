import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadinterval;

function loader(element) {
    element.textContent = "";
    loadinterval = setInterval(() => {
        element.textContent += ".";
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, text) {
    let index = 0
  
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomnum = Math. random();
    const hexadecimalstring = randomnum.toString(16);

    return `id-${timestamp}-${hexadecimalstring}`;

}

function chatstripe(isAI, value, uniqueid) {
    return (`
        <div class="wrapper ${isAI && 'ai'}" >
        <div class="chat">
            <div class="profile">
                <img
                    src="${isAI ? bot : user}"
                    alt="${isAI ? 'bot': 'user'}"/>
            </div>
            <div class="message" id=${uniqueid}>${value}</div>
        </div>
        </div>
        `
    )
}

const handlesubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    //user chatstripe
    chatContainer.innerHTML += chatstripe(false,data.get('prompt'));

    form.reset();

    //bot chatstripe
    const uniqueid = generateUniqueId();
    chatContainer.innerHTML += chatstripe(true," ",uniqueid);

   const msgdiv = document.getElementById(uniqueid);
   
   loader(msgdiv);

   //fetch data from server - > bot ka response
   const response = await fetch('http://localhost:8080',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body : JSON.stringify({
    prompt: data.get('prompt')
})
})

clearInterval(loadinterval);
msgdiv.innerHTML = "";

if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim() 

    typeText(msgdiv, parsedData)
} else {
    const err = await response.text()

    msgdiv.innerHTML = "Something went wrong"
    alert(err)
}
}

form.addEventListener('submit',handlesubmit);
form.addEventListener('keyup',(e) => {
    if (e.keyCode === 13)
    {
    handlesubmit(e);
}
})