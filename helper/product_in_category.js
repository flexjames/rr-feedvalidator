var prodInCatHeaderLength;
var rowCollisionError = [];
var rowMinLengthError = [];
var rowInvalidProdIdError = [];
var rowInvalidCatIdError = [];
var prodIds = [];
var catIds = [];
var prodInCatRowHeaderCheck = true;
var requiredHeader = ['category_id', 'product_id'];
var isCatIdFirst = false;
var missingRequiredHeader = [];

function rowCheck(row,idx,delim,ids){
  if (idx === 1){ 
	prodInCatHeaderLengthCheck(row, delim);
	prodInCatHeaderCheck(row);

	if(row.split(delim)[0] === "category_id"){
		isCatIdFirst = true;
	}
	
	catIds = ids[0];
	ids[1].splice(0,1);
	prodIds = ids[1];
  }else{
	rowMergeCheck(row, idx, delim);
	rowLengthCheck(row, idx, delim);

	if(isCatIdFirst === true)
	{
		validCatFirstCheck(row, idx, delim);
	}
	else{
		validProdFirstCheck(row, idx, delim);
	}
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
}

function prodInCatHeaderCheck(row){
	requiredHeader.forEach(function(header){
		if (row.indexOf(header) === -1){
			missingRequiredHeader.push(header);
		}
	});
}

function validProdFirstCheck(row, idx, delim){
	if(prodIds.indexOf(row.split(delim)[0]) === -1)
	{
		rowInvalidProdIdError.push(idx);
	}
	if(catIds.indexOf(row.split(delim)[1]) === -1)
	{
		rowInvalidCatIdError.push(idx);
	}
}

function validCatFirstCheck(row, idx, delim){
	if(prodIds.indexOf(row.split(delim)[1]) === -1)
	{
		rowInvalidProdIdError.push(idx);
	}
	if(catIds.indexOf(row.split(delim)[0]) === -1)
	{
		rowInvalidCatIdError.push(idx);
	}
}

function printLog(rowCount){
	console.log('Number of Required Header Missing: ', missingRequiredHeader.length);
	missingRequiredHeader.length === 0 ? console.log('All required headers are present!\n') : console.log('The following headers are missing: ', missingRequiredHeader.toString() + '\n');

	console.log('Number of Row Collision Error(s): ', rowCollisionError.length);
	rowCollisionError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured On These Rows: ', rowCollisionError.toString() + '\n');

	console.log('Number of Row Length Insufficient Error: ', rowMinLengthError.length);
	rowMinLengthError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured on These Rows: ', rowMinLengthError.toString() + '\n');

	console.log('Number of Invlaid Product ID Error: ', rowInvalidProdIdError.length);
	rowInvalidProdIdError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured on These Rows: ', rowInvalidProdIdError.toString() + '\n');

	console.log('Number of Invalid Category ID Error: ', rowInvalidCatIdError.length);
	rowInvalidCatIdError.length === 0 ? console.log('Error Occured on These Rows: There are no errors!\n') : console.log('Error Occured on These Rows: ', rowInvalidCatIdError.toString() + '\n');

	console.log('Number of Rows: ', rowCount);
}

module.exports = {
	rowCheck: rowCheck,
	// retrieveAllProductIds: retrieveAllProductIds,
	printLog: printLog
};