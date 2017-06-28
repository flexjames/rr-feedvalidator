var productHeaderLength;
var rowCollisionError = [];
var rowMinLengthError = [];
var productRowHeaderCheck = true;
var requiredHeader = ['product_id', 'name', 'price', 'recommendable', 'image_url', 'link_url'];
var missingRequiredHeader = [];
var allProductIds = [];

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

function productHeaderLengthCheck(row){
	productHeaderLength = row.length;
}

function productHeaderCheck(row){
	requiredHeader.forEach(function(header){
		if (row.indexOf(header) === -1){
			missingRequiredHeader.push(header);
		}
	});
}

function storeProductIds(row, delim){
	allProductIds.push(row.split(delim)[0]);
}

function retrieveAllProductIds(){
	return allProductIds;
}

function rowCheck(row,idx,delim){
	if (row === 1){ 
		productHeaderLengthCheck(row);
		productHeaderCheck(row);
	}else{
		rowMergeCheck(row, idx, delim);
		rowLengthCheck(row, idx, delim);
		storeProductIds(row, delim);
	}
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

//Only necessary when returning boolean value that is changed by function
// function returnPHCheck(){
// 	return productRowHeaderCheck;
// }

module.exports = {
	rowCheck: rowCheck,
	retrieveAllProductIds: retrieveAllProductIds,
	printLog: printLog
};

