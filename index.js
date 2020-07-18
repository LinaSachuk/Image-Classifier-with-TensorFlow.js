let net;



const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();

async function app() {
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
    document.getElementById('train').addEventListener('click', () => train == true);





    // console.log('training');
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
              ${classes[result.label]}
            `;



            document.getElementById('confidences').innerText = `
              probability: ${result.confidences[result.label]}
            `;

            document.getElementById('play').addEventListener('click',
                function () {

                    console.log('game!');
                    var userChoice = document.getElementById('label').textContent;
                    console.log(userChoice);

                    if (!userChoice) {
                        // User choice was undefined
                        document.getElementById('player_choice').innerText = `Player 1, you cheated! Refresh this screen and fight like a man.`;

                    } else {
                        // Display user choice
                        document.getElementById('player_choice').innerText = `Player 1: ${userChoice}`;

                    }

                    // Computer choice
                    var computerChoice = Math.random();
                    if (computerChoice < 0.34) {
                        computerChoice = "rock";
                    } else if (computerChoice <= 0.67) {
                        computerChoice = "paper";
                    } else {
                        computerChoice = "scissors";
                    }

                    // Display computer choice
                    document.getElementById('computer_choice').innerText = `
                    Computer:  ${computerChoice}
                     `;

                    // var computerChoice = document.getElementById('computer_choice').textContent;
                    console.log(computerChoice);


                    function compare(choice1, choice2) {
                        console.log('inside!');
                        console.log('==================');
                        console.log(choice1, choice2);
                        console.log(choice1 == choice2);

                        console.log(typeof 'choice1');
                        console.log(typeof 'choice2');
                        var n = true;
                        console.log('==================');

                        return n;
                    };


                    // Run the compare function
                    var a = userChoice.trim();
                    var b = computerChoice.trim();
                    var result = compare(a, b);






                    // Display results
                    console.log(result)
                    // document.write("<p>Result:" + result + "</p>");

                });

            // Dispose the tensor to release the memory.
            img.dispose();
        }

        await tf.nextFrame();







    }
}





app();