let net;
var user_counter = 0;
var computer_counter = 0;
var game_counter = 0;
// const app = require('express')();






// Clipboard
var clipboard = new ClipboardJS('.clipboard');

clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});






const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

async function app1() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    const webcam = await tf.data.webcam(webcamElement);



    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = async classId => {
        // Capture an image from the web camera.
        const img = await webcam.capture();

        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = net.infer(img, true);

        // Pass the intermediate activation to the classifier.
        classifier.addExample(activation, classId);

        // Dispose the tensor to release the memory.
        img.dispose();
    };


    // When clicking a button, add an example for that class.
    document.getElementById('class-rock').addEventListener('click', () => addExample(0));
    document.getElementById('class-paper').addEventListener('click', () => addExample(1));
    document.getElementById('class-scissors').addEventListener('click', () => addExample(2));


    console.log('training');
    //  Show add classes buttons
    $(".add_buttons button").show();

    while (true) {

        if (classifier.getNumClasses() > 0) {
            const img = await webcam.capture();
            play == false;
            // Get the activation from mobilenet from the webcam.
            const activation = net.infer(img, 'conv_preds');
            // Get the most likely class and confidence from the classifier module.
            const result = await classifier.predictClass(activation);
            // console.log(result)

            const classes = ['rock', 'paper', 'scissors'];
            document.getElementById('label').innerText = `
              ${classes[result.label]}`;

            document.getElementById('confidences').innerText = `
            probability: ${result.confidences[result.label]}`;



            // Dispose the tensor to release the memory.
            img.dispose();

        }

        await tf.nextFrame();
    }


}


document.getElementById('train').addEventListener('click',
    function () {

        app1();
    }
);




// waiting for the Play click
document.getElementById('play').addEventListener('click',
    function () {
        // delete last results
        document.getElementById('player_choice').innerText = ``;
        document.getElementById('computer_choice').innerText = ``;
        document.getElementById('result').innerText = ``;

        if (document.getElementById('user_url')) {
            document.getElementById('user_url').remove();
        }
        if (document.getElementById('computer_url')) {
            document.getElementById('computer_url').remove();
        }
        if (document.getElementById('result_url')) {
            document.getElementById('result_url').remove();
        }

        // clear the progress bar
        if (game_counter == 0) {
            $(".user-bar").css("width", (0) + "%");
            $(".computer-bar").css("width", (0) + "%");
        }



        // rock : https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-016-512.png
        // paper: https://pngimage.net/wp-content/uploads/2018/06/paper-cartoon-png-3.png
        // scissors: https://www.wpclipart.com/education/supplies/scissors/round-tip_scissors_red.png

        console.log('game!');
        var userChoice = document.getElementById('label').textContent;
        console.log(userChoice);




        // Creating a visual card choices for user and computer
        var user_url;
        var computer_url;
        var result;
        var user_elem = document.createElement("img");
        user_elem.setAttribute("width", "100%");
        user_elem.setAttribute("alt", "user choice img");

        var computer_elem = document.createElement("img");
        computer_elem.setAttribute("width", "100%");
        computer_elem.setAttribute("alt", "computer choice img");

        var result_elem = document.createElement("img");
        result_elem.setAttribute("width", "100%");
        result_elem.setAttribute("alt", "result img");

        if (!userChoice) {
            // User choice was undefined
            document.getElementById('player_choice').innerText = `Player, you cheated! Refresh this screen and fight like a man.`;

        } else {
            // Display user choice
            document.getElementById('player_choice').innerText = `Player: ${userChoice}`;
            if (userChoice.trim() == 'rock') {
                user_url = "https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-016-512.png"
            }
            else if (userChoice.trim() == 'paper') {
                user_url = "https://pngimage.net/wp-content/uploads/2018/06/paper-cartoon-png-3.png"
            }
            else {
                user_url = "https://www.wpclipart.com/education/supplies/scissors/round-tip_scissors_red.png"
            }

            user_elem.setAttribute("src", user_url);
            document.getElementById("player_choice").className = "text-center";

            document.getElementById("player_choice").appendChild(user_elem);
            user_elem.id = "user_url"
            document.getElementById("user_url").className = "img-fluid";

        }


        // Computer choice
        var computerChoice = Math.random();
        if (computerChoice < 0.34) {
            computerChoice = "rock";
            computer_url = "https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-016-512.png"

        } else if (computerChoice <= 0.67) {
            computerChoice = "paper";
            computer_url = "https://pngimage.net/wp-content/uploads/2018/06/paper-cartoon-png-3.png"

        } else {
            computerChoice = "scissors";
            computer_url = "https://www.wpclipart.com/education/supplies/scissors/round-tip_scissors_red.png"

        }

        // Display computer choice
        document.getElementById('computer_choice').innerText = `Computer:  ${computerChoice}`;
        document.getElementById("computer_choice").className = "text-center";

        // console.log(computerChoice);
        computer_elem.setAttribute("src", computer_url);
        document.getElementById("computer_choice").appendChild(computer_elem);
        computer_elem.id = "computer_url"
        document.getElementById("computer_url").className = "img-fluid";





        // Run the compare function
        var a = userChoice.trim();
        var b = computerChoice.trim();
        var result = compare(a, b);





        win_url = "https://image.freepik.com/free-vector/you-win-sign-pop-art-style_175838-498.jpg";
        tie_url = "https://cdn.clipart.email/066e8356ab66bb4dfae7e02363e6c292_bow-tie-clipart-at-getdrawingscom-free-for-personal-use-bow-tie-_600-600.jpeg";
        lose_url = "https://thebenefitsourcellc.com/wp-content/uploads/2018/02/Screen-Shot-2018-02-20-at-4.17.38-PM.png"

        // Display results
        console.log(result);

        if (result.trim() == "It's a tie!") {
            result_url = tie_url;
            game_counter += 1;

        }
        else if (result.trim() == "You win!") {
            result_url = win_url;
            user_counter += 1;
            game_counter += 1;
            console.log(user_counter)
            $(".user-bar").css("width", (user_counter * 10) + "%");

        }
        else {
            result_url = lose_url;
            computer_counter += 1;
            game_counter += 1;

            console.log(computer_counter)
            $(".computer-bar").css("width", (computer_counter * 10) + "%");

        }

        // Progress bar
        $(".bars").show();
        $('#game_counter').text("Game count: " + game_counter);
        $('#user_score').text("User won " + user_counter + " times.");
        $('#computer_score').text("Computer won " + computer_counter + " times.");




        document.getElementById('result').innerText = `${result}`;
        document.getElementById("result").className = "text-center";
        result_elem.setAttribute("src", result_url);
        document.getElementById("result").appendChild(result_elem);
        result_elem.id = "result_url"
        document.getElementById("result_url").className = "img-fluid";
        console.log(user_counter, computer_counter);






        if (user_counter == 10) {

            alert("You won 10 games!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;


        } else if (computer_counter == 10) {

            alert("Computer won 10 games!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;


        }

        if ((user_counter == 10) &&
            (computer_counter == 10)) {
            console.log(user_counter, computer_counter);

            alert("Tie game!");
            user_counter = 0;
            computer_counter = 0;
            game_counter = 0;



        }




        console.log("game counter: " + game_counter)

        return;


    });
