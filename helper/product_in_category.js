var prodInCatHeaderLength;
var rowCollisionError = [];
var rowMinLengthError = [];
var prodInCatRowHeaderCheck = true;
var requiredHeader = ['category_id', 'product_id'];
var missingRequiredHeader = [];

function rowCheck(row,idx,delim,productIds){
  if (idx === 1){ 
	prodInCatHeaderLengthCheck(row, delim);
	prodInCatHeaderCheck(row);
	console.log("This is PIC row: " + row);
	console.log("These are the productIds from Product Full: " + productIds);
  }else{
	rowMergeCheck(row, idx, delim);
	rowLengthCheck(row, idx, delim);
  }
}

function rowMergeCheck(row, idx, delim){
	if((row.split(delim).length) > prodInCatHeaderLength){
		rowCollisionError.push(idx);
	}
}

function rowLengthCheck(row, idx, delim){
	if((row.split(delim).length) < prodInCatHeaderLength){
		rowMinLengthError.push(idx);
	}
}

function prodInCatHeaderLengthCheck(row, delim){
	prodInCatHeaderLength = row.split(delim).length;
	console.log("This is the PIC length: " + prodInCatHeaderLength);
}

function prodInCatHeaderCheck(row){
	requiredHeader.forEach(function(header){
		if (row.indexOf(header) === -1){
			missingRequiredHeader.push(header);
		}
	});
}

function printLog(rowCount){
	console.log('Number of Required Header Missing: ', missingRequiredHeader.length);
	missingRequiredHeader.length === 0 ? console.log('All required headers are present!\n') : console.log('The following headers are missing: ', missingRequiredHeader.toString() + '\n');

	console.log('Number of Row Collision Error(s): ', rowCollisionError.length);
	rowCollisionError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured On These Rows: ', rowCollisionError.toString() + '\n');

	console.log('Number of Row Length Insufficient Error: ', rowMinLengthError.length);
	rowMinLengthError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured on These Rows: ', rowMinLengthError.toString() + '\n');

	console.log('Number of Rows: ', rowCount);
}

module.exports = {
	rowCheck: rowCheck,
	// retrieveAllProductIds: retrieveAllProductIds,
	printLog: printLog
};