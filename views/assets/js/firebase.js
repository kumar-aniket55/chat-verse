let TITLE1 = document.querySelector('.title').innerHTML;
let TITLE = TITLE1.toUpperCase();
            
document.querySelector('#topBar h2').innerHTML= TITLE;

const Path = 'app/'+TITLE;


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithCustomToken,signInAnonymously  } from 'https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js';

// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Picker } from 'https://cdn.jsdelivr.net/npm/emoji-picker-element@1.0.3/index.min.js';

          
            const picker = new Picker({
                    locale: 'en',
                    
                    });

                    
             
                    let emojiOn = false;
                    document.querySelector('#emoji').addEventListener('click',()=>{
                        if(emojiOn){
                            
                            picker.style.display='none';
                            emojiOn=false;
                             
                        }else{
                            
                            picker.style.display='flex';
                        emojiOn=true;
                    }
                        
                    })
                    document.querySelector('#chatContainer').appendChild(picker);
                    picker.addEventListener('emoji-click', event => {
                    const vvl = document.querySelector('#textInput');
                     vvl.value = vvl.value+event.detail.unicode;
                    });
let username="";
const firebaseConfig={
// (insert your Firebase configuration here)
apiKey: "AIzaSyB_5V33i1LF3KMfYfUYc33wBD5K0BmXSrk",
authDomain: "basicexample-1dec4.firebaseapp.com",
databaseURL: "https://basicexample-1dec4-default-rtdb.firebaseio.com",
projectId: "basicexample-1dec4",
storageBucket: "basicexample-1dec4.appspot.com",
messagingSenderId: "64592502724",
appId: "1:64592502724:web:e76cc90b36631dcbe74e91",
measurementId: "G-F86RJZ7HHN"
};



const app =  initializeApp(firebaseConfig);


import { getDatabase, ref, set, child, get, onValue, onChildAdded, push} from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

const db = getDatabase();
const auth = getAuth();




document.querySelector(".modal").classList.add("open");




//when 'enter' is pressed when we are on input tag

const input = document.querySelector("#textInput");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("#enterButton").click();
    }
});



//Send the message
document.querySelector("#enterButton").addEventListener('click',()=>{

    if(input.value!=""){
        
    
    const text = input.value;
    
    const debref = ref(db,Path);
    const dbExact = push(debref)
    set(dbExact, {
        username: username,
        message: text
    });
    input.value="";

}
})


let currName = "";
//Read Message asynchonous method
//READING for the first time and when the childs(messages) are added
function addChilds(){
    const starCountRef = ref(db, Path);
    onChildAdded(starCountRef, (data) => {
    console.log(data.val());
    // const list = document.createElement('li');
    // list.innerHTML=data.val().name + ": " + data.val().message;
    // document.querySelector('ul').appendChild(list);

    
   
    if(username==""){
       
     }else{ 
         
        if(data.val().username==username){
        //outgoing message
        if(currName==username){
            //continuos message
            const chatBubble = Object.assign(
                document.createElement(`div`), 
                { 
                    innerHTML: `       
                    <div class="incomingName" style="text-align:right"></div>
        <p>${urlify(data.val().message)}
        
      
        </p>
                          `,
                  classList: [`outgoingChat`], } );
    
                  document.querySelector('#chatBox').appendChild(chatBubble);
        }else{
            //discontinuos message
            const chatBubble = Object.assign(
                document.createElement(`div`), 
                { 
                    innerHTML: `       
                    <div class="incomingName" style="text-align:right">You</div>
        <p>${urlify(data.val().message)}
        
        </p>
                          `,
                  classList: [`outgoingChat`], } );
    
                  document.querySelector('#chatBox').appendChild(chatBubble);
        }

       



              currName = data.val().username;
    }else{
        //incoming message
         
        if(data.val().username==currName){
            //continuous message it is
            const chatBubble = Object.assign(
                document.createElement(`div`), 
                { 
                    innerHTML: `       
                    <div class="incomingName"></div>
        <p>${urlify(data.val().message)}
        
        
        </p>
                          `,
                  classList: [`incomingChat`], } );
                  document.querySelector('#chatBox').appendChild(chatBubble);
        }else{
            //dicontinous it is
            const chatBubble = Object.assign(
                document.createElement(`div`), 
                { 
                    innerHTML: `       
                    <div class="incomingName">${data.val().username}</div>
        <p>
        ${urlify(data.val().message)} 
                   
        
        </p>
                          `,
                  classList: [`incomingChat`], } );
                  document.querySelector('#chatBox').appendChild(chatBubble);
        }
        currName = data.val().username;

              
    }
    document.querySelector('#chatBox').scrollTop = document.querySelector('#chatBox').scrollHeight

    }
    
    });
}
    











//LOGIN / SIGNUP METHOD
document.querySelector('#moduleButton').addEventListener('click',()=>{


    document.querySelector('#moduleButton').disabled=true;
username =  document.querySelector("#usernameInput").value.toLowerCase().trim();
const pass = document.querySelector("#passwordInput").value.trim();
// pass = pass.trim();
// username=username.trim();
if(username==""){
    alert("username cannot be empty");
    document.querySelector('#moduleButton').disabled=false;
    return;
}
//reading user if exist
console.log(username);


const dbRef = ref(getDatabase());
get(child(dbRef, `users/${username}`)).then((snapshot) => {
if (snapshot.exists()) {
    //exist already, just login anmonymously..
    if(snapshot.val().password==pass){
        document.querySelector('#alertsOnly').innerHTML="";
        const flash = Object.assign(
            document.createElement(`div`), 
            { 
                innerHTML: `       
               
                <div class="alert alert-success" role="alert">
Logging In!
</div>
                      `,
              classList: [``], } );

              document.querySelector('#alertsOnly').appendChild(flash);

        signInAnonymously(auth)
            .then(() => {
                // Signed in..
                document.querySelector(".modal").classList.remove("open");
                console.log('Logging In');

                ////del
                addChilds();
                ////del

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });

    }else{
        console.log("Wrong Password");

        const flash = Object.assign(
            document.createElement(`div`), 
            { 
                innerHTML: `       
               
                <div class="alert alert-danger" role="alert">
Wrong Password!
</div>
                      `,
              classList: [``], } );

              document.querySelector('#alertsOnly').appendChild(flash);
    }
 

    document.querySelector('#moduleButton').disabled=false;
} else {
    
    //Writing new username and logging in...
        set(ref(db, 'users/'+username), {
            password: pass
        });

        console.log("Writting new user");

        
        signInAnonymously(auth)
            .then(() => {
                // Signed in..
                document.querySelector(".modal").classList.remove("open");
                console.log('Logging In');
                const flash = Object.assign(
            document.createElement(`div`), 
            { 
                innerHTML: `       
               
                <div class="alert alert-success" role="alert">
Logging In!
</div>
                      `,
              classList: [``], } );
              document.querySelector('#alertsOnly').appendChild(flash); 
              addChilds();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });


          

}
}).catch((error) => {
console.error(error);
});

});


//ulify Text

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  }