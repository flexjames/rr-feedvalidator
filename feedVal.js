var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var unzip = require('unzip2');
var deltaError = require('./helper/deltaHelper.js');
var productFull = require('./helper/product_full.js');
var prodInCat = require('./helper/product_in_category.js');
var categoryFull = require('./helper/category_full.js');
var fileName = "\/" + process.argv[2];
var delim = process.argv[3];
var dirPath = __dirname;
var rowCountPf = 1;
var rowCountPic = 1;
var rmdir = require('rmdir');
var productIds;
var categories;
var promise = require('bluebird');
var iterPromises = [];
var picFile;

console.log(dirPath + "\/" + process.argv[2].slice(0, -4) + "\/");

if(process.argv[2].indexOf('zip') > -1){

	fs.createReadStream(dirPath + fileName)
		.pipe(unzip.Extract({path: dirPath + "\/" + process.argv[2].slice(0, -4)}))
		.on('error', function(e){
			throw new Error(e.message);
		})
		.on('close', function(){
			console.log('Done extracting files');

			fs.readdir(dirPath + fileName.slice(0, -4) + "\/", function(err, files){

				if (err){
					throw new Error(err);
				}else{
					console.log('Unzipped Successfully');
					// console.log(files);
					validate(files);
				}
			});
		});
}

// function validate(files){
//     console.time('Validation Excuted In');
//     console.log(files);
//
//     for(var i=0; i < files.length; i++) {
//         //if(files[i].slice(0,12) === 'product_full'){
//         // if (files[i].slice(0, 13) === 'category_full') {
//         //     category_Full(files[i], files)
//         //             .catch(function (err) {
//         //                 console.log(err);
//         //             })
//         //             .then(function (ids) {
//         //                 console.log(ids);
//         //             })
//         //             .then(function () {
//         //                 console.timeEnd('Validation Excuted In');
//         //                 deleteFiles()
//         //             })
//         // }
//
//         if (files[i].slice(0, 19) === 'product_in_category') {
//         	product_In_Category(files[i], files);
//         }
//     }
// }

function validate(files){
	console.time('Validation Excuted In');
	console.log(files);
	for(i=0; i < files.length; i++){
		// console.log(dirPath+fileName.slice(0, -4)+"\/"+files[i]);

		if(files[i].slice(0,12) === 'product_full'){
			iterPromises.push(product_Full(files[i], files));
		}
		if(files[i].slice(0,13) === 'category_full'){
			iterPromises.push(category_Full(files[i], files));
		}
		if(files[i].slice(0,19) === 'product_in_category'){
			picFile = files[i];
		}
	}

	if(iterPromises.length === 2){
		console.log("made it to promise.all");
		promise.all(iterPromises)
		.catch(function(error){
			console.log(error);
		})
		.then(function(fulfilled){
			console.log(fulfilled[0].length, fulfilled[1].length);
			product_In_Category(picFile, fulfilled);
		})
		.then(function(){
			deleteFiles();
		});

	}

	console.timeEnd('Validation Excuted In');
	//deleteFiles();
}

function product_Full(file, files){
	//Validation Process	
	console.time('Product Full Validation Excuted In');
	return new promise(function(resolve, reject){
		var s = fs.createReadStream(dirPath+fileName.slice(0, -4)+"\/"+file)
			.pipe(es.split())
			//.pipe(es.parse({error:true}))
			.pipe(es.mapSync(function(line){
				s.pause();

				productFull.rowCheck(line, rowCountPf,delim);

				rowCountPf++;

				s.resume();
			})
			.on('error', function(){
				reject(new Error('Error while reading file Product Full'));
			})
			.on('end', function(){
				console.log('Read entire file.\n');

				productFull.printLog(rowCountPf);
				productIds = productFull.retrieveAllProductIds();
				resolve(productIds);
				// console.log(productIds);

				console.timeEnd('Product Full Validation Excuted In');
			})
		);
	});
}

function product_In_Category(file, ids){
	console.time('Product In Category Validation Excuted In');
	console.log('Made it to Product_In_Category');
	// console.log("ProductIDs: " + productIds);
	//Validation Process
	var s = fs.createReadStream(dirPath+fileName.slice(0, -4)+"\/"+file)
		.pipe(es.split())
		//.pipe(es.parse({error:true}))
		.pipe(es.mapSync(function(line){
			s.pause();

			prodInCat.rowCheck(line,rowCountPic,delim,ids);

			//console.log(rowCountPic);
			rowCountPic++;

			s.resume();
		})
		.on('error', function(e){
			console.log('Error while reading file Product in Category');
			console.log(e);
		})
		.on('end', function(){
			console.log('Read entire file.\n');

			prodInCat.printLog(rowCountPic);
			// productIds = prodInCat.retrieveAllProductIds();

			console.timeEnd('Product In Category Validation Excuted In');	
		})
	);
}


function category_Full(file) {
    console.time('\n\n\n --- [INFO] --- Entering category_Full function');
    console.log("File is " + file);
    return new promise(function(resolve, reject){
    	var errorLog = [];

    	for (var i = 0; i < 2; i++) {
    			if(i === 0){
    				validateCategoryFull(file, errorLog, i)
    				.then(function(catIds){
    					resolve(catIds);
    				})
    				.catch(function(err){
    					reject(new Error(err));
    				});
    			}else{
    				validateCategoryFull(file, errorLog, i);
    			}
    	}

    });
}

function validateCategoryFull(file, errorLog, runNumber) {
    //Validation Process
    var index = 0;
    console.log('\n\n\n --- [INFO] --- Entering category_Full function');
    return new promise(function(resolve, reject){
    	var s = fs.createReadStream(dirPath + fileName.slice(0, -4) + "\/" + file)
    	    .pipe(es.split())
    	    //.pipe(es.parse({error:true}))
    	    .pipe(es.mapSync(function (line) {
    	            s.pause();

    	            if (line !== "" && index === 0 && runNumber === 0) {
    	                categoryFull.checkCategoryHeader(line, delim);
    	            } else if (line !== "" && index > 0 && runNumber === 0) {
    	                categoryFull.extractCategoryIds(index - 1, line, delim);
    	            } else if (line !== "" && index > 0 && runNumber === 1) {
                      categoryFull.runChecks(index, line, delim);
                      //categoryFullRowCount++;
                  }
    	           
    	            index++;

    	            s.resume();
    	        })
    	        .on('error', function (e) {
    	        		if(runNumber === 1){
    	        			console.error(e);
    	        		}else{
    	        			reject(new Error(e.message));
    	        		}
    	        })
    	        .on('end', function () {
    	            /*productFull.printLog(rowCount);*/
    	            if (runNumber === 0){
    	            	console.log('\n\n\n[Category Full] Resolve Promise in categoryFull file.\n');
    	            	categories = categoryFull.getAllCategoryIds();
    	            	resolve(categories);
    	            }else{
    	            	console.log("\n\n\n[Category Full]" + categoryFull.getErrorMessage());
    	            }

    	            /*console.timeEnd('Validation Excuted In');*/
    	        })
    	    );
    });
}



function deleteFiles(){
	rmdir(dirPath + fileName.slice(0, -4), function (err, dirs, files) {
		if (err) { console.log(err)};
		console.log('Reached Delete Process');
		console.log(dirs);
		console.log(files);
		console.log('All the files are removed');
		return true;
	});
	// console.log("This is the Delete File function for file: " + );
}