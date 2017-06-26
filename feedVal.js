var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var unzip = require('unzip');
var deltaError = require('./helper/deltaHelper.js');
var productFull = require('./helper/product_full.js');
var fileName = "\/" + process.argv[2];
var delim = process.argv[3];
var dirPath = __dirname;
var rowCount = 1;
var rmdir = require('rmdir');

console.log(dirPath + "\/" + process.argv[2].slice(0, -4) + "\/");

if(process.argv[2].indexOf('zip') > -1){

	fs.createReadStream(dirPath + fileName)
		.pipe(unzip.Extract({path: dirPath + "\/" + process.argv[2].slice(0, -4)}))
		.on('error', function(){
			throw new Error(error);
		})
		.on('close', function(){
			console.log('Done extracting files');

			fs.readdir(dirPath + fileName.slice(0, -4) + "\/", function(err, files){

				console.log('Unzipped Successfully');
				if (err){
					throw new Error(err);
				}else{
					// console.log(files);
					validate(files);
				}
			});
		});
}

function validate(files){
	console.log(files);
	for(i=0; i < files.length; i++){
		console.log(dirPath+fileName.slice(0, -4)+"\/"+files[i]);

		if(files[i].slice(0,12) === 'product_full'){
			product_Full();
		}

		if (i === files.length-1){
			console.log('Delete Process Started');
			rmdir(dirPath + fileName.slice(0, -4), function (err, dirs, files) {
				if (err) { console.log(err)};
				console.log('Reached Delete Process');
			  console.log(dirs);
			  console.log(files);
			  console.log('all files are removed');
			});
		}
	// console.time('Validation Excuted In');
	//Validation Process
	// var s = fs.createReadStream(dirPath+fileName+"\/"+files[0])
	// 	.pipe(es.split())
	// 	//.pipe(es.parse({error:true}))
	// 	.pipe(es.mapSync(function(line){
	// 		s.pause();

	// 		if (rowCount === 1){
	// 			deltaError.productHeaderCheck(line.split(delim));
	// 		}

	// 		deltaError.rowMergeCheck(line, rowCount, delim);
	// 		deltaError.rowLengthCheck(line, rowCount, delim);

	// 		rowCount++;

	// 		s.resume();
	// 	})
	// 	.on('error', function(){
	// 		console.log('Error while reading file');
	// 	})
	// 	.on('end', function(){
	// 		console.log('Read entire file.\n');

	// 		deltaError.printLog(rowCount);

	// 		console.timeEnd('Validation Excuted In');
	// 	})
	// );
	}
}

function product_Full(){
	console.time('Validation Excuted In');
	//Validation Process
	var s = fs.createReadStream(dirPath+fileName.slice(0, -4)+"\/"+files[i])
		.pipe(es.split())
		//.pipe(es.parse({error:true}))
		.pipe(es.mapSync(function(line){
			s.pause();

			productFull.rowCheck(line, rowCount,delim);

			rowCount++;

			s.resume();
		})
		.on('error', function(){
			console.log('Error while reading file');
		})
		.on('end', function(){
			console.log('Read entire file.\n');

			productFull.printLog(rowCount);

			console.timeEnd('Validation Excuted In');
		})
	);
}


