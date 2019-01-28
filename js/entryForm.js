/**
 * 
 */
 function EntryForm(){};
 
// Resets the input cells to zero and clears the solution area 
 EntryForm.reset = function(event){
 	$('#solution').children().remove();
 	$('#entry-form').children().remove();
 	EntryForm.createForm(globalDim);
 }
 
// Displays the solution, by parsing the solution string into arrays and then
// entering the cell values into a table.  Table values have appropriate background
 // colours
 EntryForm.displaySolution = function(solution){
 	var dim = solution["dim"];
 	var dimSq = dim * dim; 	
 	var solutionArray = solution["Cells"];
 	var table = document.createElement("table");
 	$(table).addClass("table table-condensed");
 	for (var y=0; y<solutionArray.length; y++){
  		var row = document.createElement("tr");
 		var rowString = solutionArray[y].toString();
 		var rowArray = rowString.split(',');
		for (var col=0; col<rowArray.length; col++){
 			var cell = document.createElement("td");
 			$(cell).text(rowArray[col]);
 			$(cell).attr("align","center");
 			$(cell).css("color","black");
 			$(cell).css("background", "white");
 			if (((Math.floor(y / dim) + Math.floor(col / dim)) % 2) == 0){
 				$(cell).css("background","lightgray");
 			}
 			$(row).append(cell);
		}
 		$(table).append(row);
 	} 	
 	$('#solution').empty();
 	$('#solution').append(table);
 }
 
// Create the initial input form.  Values are entered by <input type="number"> cells,
// which are arranged in a table with appropriate background colours
 EntryForm.createForm = function(dim){
 	$('#entry-form').attr("dim",dim);
 	var dimSq = dim * dim;
 	var spinnerArray = new Array(dimSq);
 	var table = document.createElement("table");
 	$(table).attr("class","table table-condensed");
 	for (var row=0;row<dimSq;row++){
  		var tableRow = document.createElement("tr");
 		spinnerArray[row] = new Array(dimSq);
 		for (var col=0;col<dimSq;col++){
 			var cell = document.createElement("td");
 			spinnerArray[row][col] = document.createElement("input");
 			$(spinnerArray[row][col]).attr("type","number");
 			$(spinnerArray[row][col]).attr("min",0);
 			$(spinnerArray[row][col]).attr("max",dimSq);
 			$(spinnerArray[row][col]).attr("step",1);
 			$(spinnerArray[row][col]).attr("value",0);
 			$(spinnerArray[row][col]).attr("id","row" + row + "col" + col);
 			$(spinnerArray[row][col]).css("color","black");
 			if (((Math.floor(row / dim) + Math.floor(col / dim)) % 2) == 0){
 				$(spinnerArray[row][col]).css("background","lightgray");
 			}
 			$(cell).append(spinnerArray[row][col]);
 			$(tableRow).append(cell);
 		}
 		$(table).append(tableRow);
 	}
 	$('#entry-form').append(table);
 	return spinnerArray;
 }
 
//  Read the entries in the input form area and generate a constraints object from them
 EntryForm.generateConstraintObject = function(){
 	var dim = $('#entry-form').attr("dim");
 	var dimSq = dim * dim;
 	var constraintsObject = {};
 	constraintsObject["dim"] = parseInt(dim);
 	var constraintsArray = new Array(dimSq);
 	for (var row=0;row<dimSq;row++){
 		constraintsArray[row] = new Array(dimSq);
 		for (var col=0;col<dimSq;col++){
 			var findString = '#row' + row + 'col' + col;
 			constraintsArray[row][col] = parseInt($(findString).val());
 		}
 	}
 	constraintsObject["Cells"] = constraintsArray;
 	return constraintsObject;
 }
 
// When the user has clicked the Submit button, create the constraints object from the 
// input form and send it to the REST service using an AJAX call.  Display the solution
// in the display area when the result is returned.
 EntryForm.submit = function(event){
 	var constraintsObject = EntryForm.generateConstraintObject();
 	var constraintsString = JSON.stringify(constraintsObject);
 	var errorCode = 0;
	
 	$.support.cors = true;
  	$.ajax({
  		url: restUrl,
 		type: "post",
 		data: constraintsString,
 		dataType: "json",
 		headers: {"Accept": "application/json"},
 		contentType: "application/json",
 		success: function(response){
 			EntryForm.displaySolution(response);
 		},
 		error: function(jqxhr, status, errorThrown){
 			errorMessage = JSON.parse(jqxhr.responseText).message;
  			alert("Call Failed with HTTP Error Code: " + jqxhr.status + "\n" + errorMessage);
 		}
 	});

/*
 	$.support.cors = true;
  	$.ajax({
  		url: restUrl,
 		method: "post",
 		data: constraintsString,
 		dataType: "json",
 		headers: {"Accept": "application/json"},
 		contentType: "application/json"
  		}).done(function(data){
 			EntryForm.displaySolution(data);
 		})
 		.fail(function(jqxhr){
 			alert("Call Failed with HTTP Error Code: " + jqxhr.status + 
 			      "\n"  + jqxhr.getResponseHeader("Error Header"));
 			console.log("response headers = " + jqxhr.getAllResponseHeaders());
 			for (property in jqxhr){
 			    console.log("property " + property + " has value " + jqxhr[property]);
 			}
 		});
*/
/*
 	$.post({
  		url: restUrl,
 		data: constraintsString,
 		dataType: "json"
 		//headers: {"Accept": "application/json"},
 		//contentType: "application/json"
  		}).done(function(data){
 			EntryForm.displaySolution(data);
 		})
 		.fail(function(jqxhr){
 			alert("Call Failed with HTTP Error Code: " + jqxhr.status + 
 			      "\n"  + jqxhr.getResponseHeader("Error Header"));
 		});
*/
}
