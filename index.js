const options = [];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var text = ""

document.getElementById("spin").addEventListener("click", spin);

document.getElementById("addBtn").addEventListener("click", addName);

var bad = "";

function addName() {
    var name = document.getElementById("name").value;
    if (options.length < 250) {
        
        options.push(name);
        arc = Math.PI / (options.length / 2);
    } else {
        alert("Roulette is full!")
    }
    if (name[name.length-1]==" ") {
        bad = name;
    }
    document.getElementById("name").value = "";
    drawRouletteWheel()
}


function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI*2/maxitem;
    
    red   = Math.sin(frequency*item+2+phase) * width + center;
    green = Math.sin(frequency*item+0+phase) * width + center;
    blue  = Math.sin(frequency*item+4+phase) * width + center;
    
    return RGB2Color(red,green,blue);
}

function printNames() {
    const namesList = document.getElementById("namesList");
    namesList.innerHTML=""
    for (let i = 0; i < options.length; i++){
        const node = document.createElement("p");
        const textnode = document.createTextNode("@"+options[i]);
        node.appendChild(textnode);
        namesList.appendChild(node);
    }
}

function drawRouletteWheel() {
    printNames()
    
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for(var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur    = 0;
            ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                            250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        } 

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        if (options.length > 0) {
            ctx.fill();
        }
    }
}



function spin() {
    if (options.length > 1) {
        
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3 + 4 * 1000;
        rotateWheel();
    } else if (options.length == 0) {
        alert("No item added!");
    }
    else {
        alert("You have a winner!");
    }
}

function rotateWheel() {
    spinTime += 30;
    let t = 30
    var i = getIndex();
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    if (options[i] === bad) {
        console.log("Rotate: ", bad)
        spinTime-=30
        spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += (spinAngle * Math.PI / 180)*.5;
        drawRouletteWheel();
        t = 40;
        spinTimeOut = setTimeout(t);
    } 
    spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', t);
}

function getIndex() {
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var indexNum = Math.floor((360 - degrees % 360) / arcd);
    return indexNum
}

function removeName(i) {
    console.log(options)
    if (i > -1) {
        options.splice(i, 1); 
        arc = Math.PI / (options.length / 2);
    }
    console.log(options)
    drawRouletteWheel();
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var index = getIndex();
    console.log(index);
    var text = "Out: "+options[index];
    removeName(index);
    ctx.save();
    ctx.font = 'bold 20px Helvetica, Arial';
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();