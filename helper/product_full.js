var productHeaderLength;
var rowCollisionError = [];
var rowMinLengthError = [];
var productRowHeaderCheck = true;

function rowMergeCheck(row, idx, delim){
	if((row.split(delim).length) > productHeaderLength){
		rowCollisionError.push(idx);
	}
}

function rowLengthCheck(row, idx, delim){
	if((row.split(delim).length) < productHeaderLength){
		rowMinLengthError.push(idx);
	}
}

function productHeaderCheck(row){
	// for(i = 0; i < deltaProductHeader.length; i++){
	// 	if (row[i] !== deltaProductHeader[i]){
	// 		productRowHeaderCheck = false;
	// 	}
	// }
	productHeaderLength = row.length;
}

function printLog(rowCount){
	//productRowHeaderCheck === true ? console.log('The Header Attributes Are Correct.\n') : console.log('There Is One Or More Header Attributes Missing.\n');
		
	console.log('Number of Row Collision Error(s): ', rowCollisionError.length);
	rowCollisionError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured On These Rows: ', rowCollisionError.toString() + '\n');

	console.log('Number of Row Length Insufficient Error: ', rowMinLengthError.length);
	rowMinLengthError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured on These Rows: ', rowMinLengthError.toString() + '\n');

	console.log('Number of Rows: ', rowCount);
}

//Only necessary when returning boolean value that is changed by function
// function returnPHCheck(){
// 	return productRowHeaderCheck;
// }

module.exports = {
	rowMergeCheck : rowMergeCheck,
	rowLengthCheck: rowLengthCheck,
	productHeaderCheck: productHeaderCheck,
	printLog: printLog
};

