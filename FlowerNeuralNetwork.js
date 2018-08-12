// --- Training Examples: |B = blue, R = red| --- [length, width, type(1=red,0=blue)] ---
const B1 = [2.0   ,1.0   ,0];
const B2 = [3.0   ,1.0   ,0];
const B3 = [2.0   ,0.5   ,0];
const B4 = [1.0   ,1.0   ,0];

const R1 = [3.0   ,1.5   ,1];
const R2 = [4.0   ,1.5   ,1];
const R3 = [3.5   ,0.5   ,1];
const R4 = [5.5   ,1.0   ,1];

// --- Training Example Array ---
const data = [B1, B2, B3, B4, R1, R2, R3, R4];

// Activation Function (sigmoid). Squashes x between 0 and 1
function sigmoid(x){
    return 1/(1+Math.exp(-x));
}

// --- Train the Network ---
function train(){
    // --- Unknown Data From Input ---
    const inputLength = document.getElementById("length").value;
    const inputWidth  = document.getElementById("width").value;
    const U = [inputLength,inputWidth ,"Unknown"];
    
    // Setting a learning rate, how much to push a value in a direction.
    const learningRate = 0.1;

    // Giving weights and biase a random value to start 
    // Creates a random number between 0.00 and 0.1. E.G 0.09435
    var W1 = Math.random()*.2-.1;
    var W2 = Math.random()*.2-.1;
    var B  = Math.random()*.2-.1;

    // Calculating the outputs
    for (let iter = 0; iter < 5000; iter++){

        // --- Pick a Random Training Example ---
        const randomIndex = Math.floor(Math.random() * data.length);
        const dataPoint   = data[randomIndex];

        // Retrieve the flower variables from that data point
        const dataTarget  = dataPoint[2];
        const dataLength  = dataPoint[0];
        const dataWidth   = dataPoint[1];

        // --- Feed Forward, 2 inputs, 2 weights, one biase, one output ---
        var deltaZ = dataLength * W1 + dataWidth * W2 + B;
        var pred   = sigmoid(deltaZ);

        // Calculate cost (squared error)
        var cost = (pred-dataTarget)**2;

        // Use calculus and the chain rule to find the derivative of 
        // each weight and biase in respect to the error, This gets the gradient
        // allowing us to increment or decrement each value accordingly.
        // Using the chain rule we work backwards through our network to find
        // the derivative of firstly the prediction in respect to the cost,
        // then the derivative of deltaZ in respect to our prediction
        // and then we find the derivative of a weight or bias in respect to 
        // deltaZ. When all of these values are multiplied together, we get the derivative
        // of a w or b in respect to the cost. This alows to alter our variables until we get
        // a minimal cost.
    
        // Use the power rule, f'((pred-dataTarget)^2) = 2*(pred-dataTarget)
        var dcost_dpred   = 2*(pred-dataTarget);

        // We must find the derivative of the sigmoid function here, as it was applied to
        // deltaZ to form pred.
        var dpred_ddeltaZ = sigmoid(deltaZ) * (1-sigmoid(deltaZ));

        // The derivative of our weights are the same as the inputs
        // because the derivative of input*weight or iw, is equal to i.
        // As an example, if we have 6*5 we get 30. if do (6*5)/5 we will get 6.
        // think of 6 like i and 5 like a weight. The derivative is always i. 
        var ddeltaZ_dw1 = dataLength;
        var ddeltaZ_dw2 = dataWidth;

        // b/b = 1.
        var ddeltaZ_db  = 1;

        // --- Final Partial Derivatives of Values WRT Cost ---
        dcost_dw1 = dcost_dpred * dpred_ddeltaZ * ddeltaZ_dw1;
        dcost_dw2 = dcost_dpred * dpred_ddeltaZ * ddeltaZ_dw2;
        dcost_db  = dcost_dpred * dpred_ddeltaZ * ddeltaZ_db;

        W1 -= learningRate * dcost_dw1;
        W2 -= learningRate * dcost_dw2;
        B  -= learningRate * dcost_db;
    }
    var output = sigmoid(U[0] * W1 + U[1] * W2 + B);
    console.log(output);
    ShowOutput(output);
}


// -- Listen for Button Click
window.onload=function(){
    var btn = document.getElementById("start");
    btn.addEventListener("click", calculate);

    function calculate(){
    const inputLength = document.getElementById("length").value;
    const inputWidth  = document.getElementById("width").value;
    if(!isNaN(inputLength) && !isNaN(inputWidth)){
          if(inputLength < 10 && inputWidth < 10 && inputLength > 0 && inputWidth > 0){
             train();
          }else{
            alert("Please enter a numeral value from 1-10");
          }
      }else{
         alert("Please enter a numeral value from 1-10");
     }
    }
}

function ShowOutput(output){
    const txtOutput =  document.getElementById("output");
   
        if (output > 0.4 && output < 0.6) {
            txtOutput.innerHTML = "= This flower could be red or blue.";
        }

        else if  (output <= 0.45){
            let bluePercentage = 100-(output*100);
            txtOutput.innerHTML = "= Blue! (" + bluePercentage + "% sure)";
        }
        
        else if  (output >= 0.55){
            const redPercentage = 100-((1-output)*100);
            txtOutput.innerHTML = "= Red! (" + redPercentage + "% sure)";
        }
}