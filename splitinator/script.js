// splits a total into specified number of parts
// always unique values option
// Why? Because I needed to make 15 unique transactions with my bank debit card per month for benifits

//IDEAS FOR IMPROVEMENTS:

// 1) Store options locally... cookie?
// 2) Min Multiplier slider
// 3) Even Split Toggle (Why not just use a calculator)
// 4) Improve CSS


//FINISHED IMPROVEMENTS:

//TODO: Create min multiplier slider
//TODO: add double click event to slider to reset to default - DONE
// 1) At last loop, check if total is met. If it is under, loop through array adding to each the difference divided by the length of the array, so each value is increased which should equal the max. DONE
// 5) Index Toggle - DONE
// 6) Repeat last output - DONE

// ------------------- Global Functions & Variables -------------------



let uniqueToggle = true;
let indexToggle = true;
let savedOutputCurrent;
let savedOutputPast;
let output = [];
let outputString;
let sumString;
let sumStringCurrent;
let sumStringPast;
let splitCount = 0;
let minMaxString;
let minMaxStringCurrent;
let minMaxStringPast;

function resetMaxSlider() {
  document.getElementById("maxSlider").value = 175
  changeValue()
}

function changeValue() {
  let maxValue = (parseFloat(document.getElementById("maxSlider").value) / 100).toFixed(2);
  $("#maxValueText").text(`${maxValue}`);
}

// Darkmode switch JQUERY
//https://stackoverflow.com/questions/2167544/what-does-the-function-do-in-javascript
$(".darkmode-switch").on("click", function() {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".darkmode-switch").text("OFF");
  } else {
    $("body").addClass("dark");
    $(".darkmode-switch").text("ON");
  }
});

function toggleButtonUnique() {
  if ($("#unique-toggle").hasClass("toggle-on")) {
    $("#unique-toggle").removeClass("toggle-on");
    $("#unique-toggle").addClass("toggle-off");
    $("#unique-toggle").text("NO");
    uniqueToggle = false;
  } else {
    $("#unique-toggle").removeClass("toggle-off");
    $("#unique-toggle").addClass("toggle-on");
    $("#unique-toggle").text("YES");
    uniqueToggle = true;
  }
};

function toggleButtonIndex() {
  if ($("#index-toggle").hasClass("toggle-on")) {
    $("#index-toggle").removeClass("toggle-on");
    $("#index-toggle").addClass("toggle-off");
    $("#index-toggle").text("NO");
    indexToggle = false;
  } else {
    $("#index-toggle").removeClass("toggle-off");
    $("#index-toggle").addClass("toggle-on");
    $("#index-toggle").text("YES");
    indexToggle = true;
  }
};

function printOutput(output) {

  if (indexToggle == true && output.length > 1) {
    console.log('** Transactions **')
    for (let i = 0; i < output.length; ++i) {
      j = i + 1
      console.log(`${j}) ${output[i]}`)
    }
    return;
  }

  if (output.length > 1) {
    outputString = output.join(', ').toString();
    console.log(`Transactions: ${outputString}`);
  }
}




function reprintOutput() {
  console.log(minMaxString);
  printOutput(output)
  console.log(sumString)
}

function reprintPreviousOutput() {
  if (splitCount > 1) {
    console.log(minMaxStringPast);
    printOutput(savedOutputPast);
    console.log(sumStringPast)
    return;
  }
  console.log(minMaxString);
  printOutput(output)
  console.log(sumString)
}

function printMinMax(min, max) {
  console.log(`Min: ${min} | Max: ${max}`);
}


// ------------------- Split Number -------------------

function splitinate() {


  // ------------------- variables -------------------

  const transCount = parseInt(document.getElementById("transCount").value);
  let total = document.getElementById("total").value;
  // closer to 1 means numbers will be closer together
  let maxMulti = num((parseFloat(document.getElementById("maxSlider").value) / 100).toFixed(2));
  let minMulti = 0.1 // closer to 1 means numbers will be closer together
  let transMax = total / transCount * maxMulti;
  let transMin = transMax * minMulti;
  let sum = 0;
  let sumCheck = 0;
  let newSum = 0;
  let z = 0; // random number
  let x = 0; // transaction counter
  let dupeCount = 0;
  let fixedCount = 2;
  let newOutput = [];
  output = [];
  outputString = "";


  // ------------------- functions -------------------

  function getRandNum(min, max) {
    return Number.parseFloat((Math.random() * (max - min) + min).toFixed(fixedCount));
  };

  function numToFixed(value) {
    return Number.parseFloat((value).toFixed(fixedCount))
  };

  function numToFixed0(value) {
    return Number.parseFloat((value).toFixed(0))
  };

  function num(value) {
    return Number.parseFloat(value)
  };

  function countDecimals(value) {
    let text = value.toString()
    // verify if number 0.000005 is represented as "5e-6"
    if (text.indexOf('e-') > -1) {
      let [base, trail] = text.split('e-');
      let deg = parseInt(trail, 10);
      return deg;
    }
    // count decimals for number in representation like "0.123456"
    if (Math.floor(value) !== value) {
      return value.toString().split(".")[1].length || 0;
    }
    return 0;
  };

  // ------------------- Prechecks -------------------

  if (total.includes(',')) {
    let text = [...total]
    text.splice(total.indexOf(','), 1, '.')
    text = text.join('')
    total = num(text)
    console.log(`Comma has become '.' ... Total: ${total}`)
  };

  if (parseFloat(transCount, 10) !== parseFloat(transCount, 10)) {
    console.log('Please enter a transaction count.')
    $("#transCount").addClass("error-textbox");
    return;
  }

  if (parseFloat(total, 10) !== parseFloat(total, 10)) {
    console.log('Please enter a total number.')
    $("#total").addClass("error-textbox");
    return;
  }

  if (total <= 0 || transCount <= 0) {
    //console.log('Value greater than 0 required!')
    console.log("Trying to divide by 0... black hole generated...")
    return;
  };

  if (transCount === 1) {
    console.log("Transactions: ", total);
    console.log("I can't split something into 1 peices :(")
    return;
  };


  if (countDecimals(num(total)) > 2) {
    fixedCount = countDecimals(num(total))
  };

  if (transCount > total * 12) {
    fixedCount = numToFixed0(transCount / 25)
    if (fixedCount > 100) {
      fixedCount = 100
    }
    //console.log (`Decimal Places: ${fixedCount}`);
  };


  // ------------------- Main Loop -------------------
  Loop1:
  while (x < transCount ) {
    //get random number
    z = getRandNum(transMin, transMax);

    //check if user has enabled unique values & output already has that number
    if (uniqueToggle === true && output.includes(z)) {
      ++dupeCount;

      if (dupeCount > 200) {
        console.log('Sorry! Those numbers are too hard to split!')
        return;
      }

      if (dupeCount > 20) {
        //sets max to remaining amount needed, divided by the amount of transactions needed.
        transMax = ((total - sum) / (transCount - x)) * (maxMulti);
        transMin = transMax * minMulti;
        //increase decimal places by 1
        if (fixedCount < 100) {
          ++fixedCount
        }
        
        //console.log(sum, transMax, transMin, transCount, x)
      }

    } else {

      // Add to dupe count if output already includes the random number & unique values are ok
      if (uniqueToggle === false && output.includes(z)) {
        ++dupeCount;
      }

      // Check if the sum + new number would be greater than requested total
      if (sum + z > total) {
        // Max becomes the remaining / how many transactions are still needed
        transMax = ((total - sum) / (transCount - x)) * (1.95)
        transMin = transMax * 0.1;

      } 
      else {
        //push the random number to output, add to sum, and increment x
        sum += z;
        output.push(z)
        ++x;
        // on the last loop, check for the remaining amount and add it to = total.
        // if (x === transCount - 1) {
        if (x === transCount) {

          while (numToFixed(sum) !== parseInt(total)) {
            debugger;
            var diff = total - sum;
            var diffDivided = diff / transCount

            if (diff < 1) {
              output[0] += numToFixed(diff)
              sum += numToFixed(diff)
              break;
            }
            
            for (num of output) {
              num += numToFixed(diffDivided)
              sum += numToFixed(diffDivided)
              newOutput.push(numToFixed(num))   
            }

            output = newOutput  
   
          }



          
          break Loop1;
        }

      }

    }

  } //loop end


  // ------------------- Log outputs -------------------

  // -- double check the SUM to a new variable newSum --
  while (sumCheck < output.length) {
    // console.log(`${output[sumCheck]}`)
    newSum += output[sumCheck]
    ++sumCheck;
  };




  minMaxString = `Min: ${transMin.toFixed(fixedCount)} | Max: ${transMax.toFixed(fixedCount)}`

  console.log(minMaxString);


  fixedCount > 2 ?
    console.log(`Decimal Places: ${fixedCount}`) : '';

  // log dupe count
  if (dupeCount > 0) {
    uniqueToggle ?
      console.log(`Duplicate number count (not included in transactions): ${dupeCount}`) :
      console.log(`Duplicate number count: ${dupeCount}`);
  }

  // log if transactions doesn't match requested transaction count
  if (x != transCount) {
    console.log(`Number of Transactions: ${x}`);
  }

  //Print Output
  splitCount++;
  printOutput(output);



  // -- log out the newSum --
  sumString = `SUM TOTAL: ${newSum.toFixed(fixedCount)}`
  console.log(sumString)


  // -- log out the difference if significant
  if (sum != newSum) {
    diff = (sum - newSum)
    if (diff > 0.001) {
      console.log(`difference: ${diff.toFixed(fixedCount)}`);
    }
  }

  // Save past outputs to memory
  if (splitCount > 0) {
    savedOutputPast = savedOutputCurrent
    minMaxStringPast = minMaxStringCurrent
    sumStringPast = sumStringCurrent

  }
  savedOutputCurrent = output
  minMaxStringCurrent = minMaxString
  sumStringCurrent = sumString


  // console.log(`Transactions: ${JSON.stringify(output)}`);

  //splitinate End
}
