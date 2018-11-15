var express = require('express'); //express모듈을 추출
var bodyParser = require("body-parser");
var mysql = require("mysql"); //mysql커넥터

//DB연결
var client = mysql.createConnection({
	user: "root",
	password: "비밀번호"
});

client.query("user Company");
client.query("select * from products", function(error, result, fields) {
	if(error) {
		console.log("쿼리 문장에 오류가 있습니다");
	}else {
		console.log(result);
	}
});

var items = [{
	name: "우유",
	price: "2000"
}, {
	name: "홍차",
	price: "5000"
}, {
	name: "커피",
	price: "5000"
}];



var app = express(); // 서버를 생성

app.use(express.static('public')); // 경로/퍼블릭폴더안에있는문서 로 연결되게끔 폴더이름을 적어준것.
app.use(bodyParser.urlencoded({extended: false}));


app.all('/a', function (request, response) { 
	response.send("<h1>Page A</h1>");
});
app.all('/b', function (request, response) {
	response.send("<h1>Page B</h1>");
});
app.all('/c', function (request, response) {
	response.send("<h1>Page C</h1>");
});

app.all("/data.html", function(request, response) {
	var output ="";
	output += "<!DOCTYPE html>";
	output += "<html>";
	output += "<head>";
	output += "		<title>Data HTML</title>";
	output += "</head>";
	output += "<body>";
	items.forEach(function(item) {
		output += "<div>";
		output += "<h1>" + item.name + "</h1>";
		output += "<h2>" + item.price + "</h2>";
		output += "</div>";
	});
	output += "</body>";
	output += "</html>";
	response.send(output);
});

app.all("/data.json", function(request, response) {
	response.send(items);
});
app.all("/data.xml", function(request, response) {
	var output ="";
	output += "<?xml version='1.0' encoding='UTF-8' ?>";
	output += "<products>";
	items.forEach(function (item) {
		output += "<product>";
		output += "<name>" + item.name + "</name>";
		output += "<price>" + item.price + "</price>";
		output += "</product>";
	});
	output += "</products>";
	response.type("text/xml");
	response.send(output);
});

app.all("/parameter", function(request, response) {
	var name = request.param('name');
	var region = request.param('region');
	
	response.send("<h1>" + name + ":" + region + "</h1>");
});

app.all("/parameter2/:id", function(request, response) {
	var id = request.params.id;
	
	response.send("<h1>" + id + "</h1>");
});


app.get("/products", function (request, response) {
	response.send(items);
});
app.get("/products/:id", function (request, response) {
	var id = Number(request.params.id);
	
	if(isNaN(id)) { //id가 숫자가 아닐 때
		response.send({
			error : "숫자를 입력하세요!"
		});
	}else if (items[id]) {
		response.send(items[id]);
	}else {
		response.send({
			error : "존재하지 않는 데이터입니다!"
		});
	}
});
app.post("/products", function (request, response) {
	var name = request.body.name;
	var price = request.body.price;
	var item = {
		name: name,
		price: price
	};
	items.push(item);
	response.send({
		message: "데이터를 추가했습니다.",
		data : item
	});
});
app.put("/products/:id", function (request, response) {
	var id = Number(request.params.id);
	var name = request.body.name;
	var price = request.body.price;
	
	if(items[id]) {
		if(name) {items[id].name = name; }
		if(price) {items[id].price = price;}
		
		response.send({
			message: '데이터를 수정했습니다.',
			data : items[id]
		});
	}else {
		response.send({
			error : '존재하지 않는 데이터입니다.'
		});
	}
});
app.del("/products/:id", function (request, response) {
	var id = Number(request.params.id);
	
	if(isNaN(id)) {
		response.send({
			error : "숫자를 입력하세요!"
		});
	}else if (items[id]) {
		items.splice(id, 1);
		response.send({
			message : '데이터를 삭제했습니다.'
		});
	}
});






app.use(function (request, response) { //미들웨어. 위 경로에 존재하지 않는 파일명을 적으면 바로 여기로 연결되어 헬로 미들웨어가 노출된다.
	response.send("<h1>Hello Middleware.. !</h1>");
});







//웹 서버를 실행한다
app.listen(52273, function() {
    console.log('Server Running at http://127.0.0.1:52273');
});
