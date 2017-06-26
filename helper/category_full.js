/**
 * Checks:
 
 * 1) Count number of rows in the header
 * 2) For every individual row, make sure there are as      many rows as in the header.
 * 3) Make sure the header contains at least    "category_id", "parent_id" and "name".
 * 4) for every "parent_id", make sure it exists in a "category_id".
 * 5) throw a warning case there are duplicates
 
 * WorkFlow:
 * 1) Run checkCategoryHeader to make sure the right headers are there, and they're not duplicated. Might need to add more logic   
 *    for the optional headers...
 * 1) Run ExtractCategoryIds - extract all id's, counts how many times each one appears[1 run through the file]
 * 2) Run through file again, and 'runChecks' for each rows
**/


var categoryLength; /* Length of the header */

var rowCollisionError = []; /* Comes from James. Used to store errors */
var rowMinLengthError = []; /* Comes from James. Used to store errors */
var parentIdError = []; /* Keep track of missing parent id errors */

var categoryLog = [];

var allCategoryIds = []; /* Array with all the category id's in the file */
var duplicateCategories; /* Used to determine if there are indeed duplicate categories */
var categoryIdCounter = []; /* For each category in the file, count how many times it appears. Used to control dupes */
var productRowHeaderCheck = true; /* ??? */
var catIdPos; /* Which column corresponds to the category id*/

/* Return a list 
    of all categories 
    that are present more than once */
function returnDuplicateCategories(){
    /** Hmmmm **/
    
    var duplicateCategories = [];
    var i = 0;
    
    for ( var key in categoryIdCounter ){
        if( categoryIdCounter[ key ] !== 1 ){
            duplicateCategories[ i ] = key;
            i++;
        }
    }
    
    if( duplicateCategories.length !== 0 ) duplicateCategories = true;
}

/*
* Function that should be called once for every 
* row in the file. Basically, it will take the category 
* id for the row, and add it to a special allCategoryIds array.
* It will also keep track of how many times each category id 
* appears in the file
*/
function extractCategoryIds(idx, row, delim){
    var currentCatId = row.split( delim )[ catIdPos ];
    allCategoryIds[ idx ] = currentCatId; //Create a file of every possible category id (including duplicates, unfortunately)
    categoryIdCounter[ currentCatId ] += 1; //Add for each category id a counter of how many times it appears in the file
}

function rowMergeCheck(row, idx, delim){
	if((row.split(delim).length) > categoryLength){
		rowCollisionError.push(idx);
	}
}

function rowLengthCheck(row, idx, delim){
	if((row.split(delim).length) < categoryLength){
		rowMinLengthError.push(idx);
	}
}


function runChecks(row, idx, delim){
    rowMergeCheck(row, idx, delim);
    rowLengthCheck(row, idx, delim);
    
    var parentId = row.split(delim)[ parentIdPos ];
    if( typeof allCategoryIds [ parentId ] == "undefined" ){
        parentIdError.push("Parent Id: " + parentId + " does not exist as an indvidual id");
    } 
    
    
}

/**
* Not sure what this function does
**/
function categoryCheck(row){
	// for(i = 0; i < deltacategory.length; i++){
	// 	if (row[i] !== deltacategory[i]){
	// 		productRowHeaderCheck = false;
	// 	}
	// }
	categoryLength = row.length;
}

/**
* How to check if a header name is present more than once?
**/
function checkCategoryHeader(erroMsg, row, delim){
    var headerNames = row.split( delim );
    var x, y, z, j = 0;
    
    for(var i = 0; i < headerNames.length; i++){
        if( headerNames[i] === "category_id" ){
            x++;
            catIdPos = i;
        }
        else if( headerNames[i] === "parent_id" ){
            parentIdPos = i;
            y++;
        }else if( headerNames[i] === "name" ){
            z++;
        }else if( headerNames[i] === "category_link_url" || 
                 headerNames[i] === "category_image_url"  ){
            j++;
        }else{
            categoryLog.push("[ERROR] An invalid header is present: " + headerNames[i] );
        }
        
    }
    
    if( x+y+z === 3)
        categoryLog.push("[OK] All mandatory headers present");
    else if( x === 0 )
        categoryLog.push("[ERROR] A mandatory header is missing: categoryId");
    else if( y === 0 )
        categoryLog.push("[ERROR] A mandatory header is missing: parentId");
    else if( z === 0 )
        categpryLog.push("[ERROR] A mandatory header is missing: name");
    else if( j === 2 ){
        categoryLog.push("[INFO] Optional headers are present: category_link_url and category_image_url");
    }
    else if( x+y+z > 3 ){
        categoryLog.push("[ERROR] Mandatory headers are duplicated");
    }
    else if( j > 2 ){
        categoryLog.push("[ERROR] Optional headers are duplicated");
    }
    
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
	categoryCheck: categoryCheck,
	printLog: printLog
};
