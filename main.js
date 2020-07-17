
// Notice there is no 'import' statement. 'mobilenet' and 'tf' is
// available on the index-page because of the script tag above.

const img = document.getElementById('img');
const button = document.getElementById('submit_button');
const input = document.getElementById('image_url');
const result = document.getElementById('prediction');



let model;

button.onclick = () => {
    const url = input.value;
    img.src = url;
    result.innerText = "Loading..."
}

img.onload = () => {
    doPrefiction();
}



function doPrefiction() {
    if (model) {

        // Classify the image.
        model.classify(img).then(predictions => {
            console.log('Predictions: ');
            console.log(predictions);
            showPrediction(predictions);
        });

    } else {
        // Load the model.
        mobilenet.load().then(_model => {
            model = _model;
            model.classify(img).then(predictions => {
                console.log('Predictions: ');
                console.log(predictions["Properties"]);
                showPrediction(predictions);

            });
        });
    }
}

function showPrediction(predictions) {
    result.innerText = "This might be a " + predictions[0].className;

}

