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

function typetext(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.CharAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomnum = Math.random();
    const hexadecimalstring = randomnum.toString(16);

    return `id-${timestamp}{hexadecimalString}`;

}

function chatstripe(isAI, value, uniqueid) {
    return (`
        < div class="wrapper ${isAI && 'ai'}" >
        <div class="chat">
            <div className="profile">
                <img
                    src="${isAI ? bot : user}"
                    alt="${isAI ? 'bot': 'user'}" />
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
}

form.addEventListener('submit',handlesubmit);
form.addEventListener('keyup',(e) => {
    if (e.keyCode === 13){
    handlesubmit(e);}
})