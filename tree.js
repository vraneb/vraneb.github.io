let leaves = [
	/* BEGIN ARTICLE NODE INFO */
	{ dest: "aqi.html", label: "AQI" },
	{ dest: "pm.html", label: "PM" },
	{ dest: "ozone.html", label: "Ozone" },
	{ dest: "pollutants.html", label: "Pollutants" },
	{ dest: "nox.html", label: "NOx" },
	{ dest: "co.html", label: "CO" },
	{ dest: "so2.html", label: "SO2" },
	{ dest: "effects.html", label: "Effects" },
	/* END ARTICLE NODE INFO   */
];

let can = document.querySelector("#canvas");
let ctx = can.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight - 50;

can.width = width;
can.height = height;
for (let i = 0; i < leaves.length; i++) {
	leaves[i].size = 75 + Math.random() * 50;
	leaves[i].vx = 6 + Math.random() * 3;
	if (Math.random() > 0.5) {
		leaves[i].vx *= -1;
	}
	leaves[i].vy = 0;
	leaves[i].x = leaves[i].size + Math.random() * (width - 2 * leaves[i].size);
	leaves[i].y = leaves[i].size + Math.random() * 100;
	leaves[i].color = `HSL(${Math.round(Math.random() * 360)}, 80%, 80%)`;
}
function draw() {
	ctx.clearRect(0, 0, width, height);
	ctx.font = `20px Metrophobic`;
	ctx.textAlign = "center";

	// for (let i = 0; i < leaves.length; i++) {
	// 	let leaf = leaves[i];
	// 	for (let c = 0; c < leaf.connections.length; c++) {
	// 		let conn = leaf.connections[c];
	// 		ctx.beginPath()
	// 		ctx.moveTo(leaf.x, leaf.y);
	// 		ctx.lineTo(leaves[conn].x, leaves[conn].y);
	// 		ctx.stroke();
	// 	}
	// }

	for (let i = 0; i < leaves.length; i++) {
		let leaf = leaves[i];
		ctx.fillStyle = leaf.color;
		ctx.beginPath();
		ctx.ellipse(leaf.x, leaf.y, leaf.size, leaf.size, 0, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#000";
		let lines = getLines(ctx, leaf.label, leaf.size * 1.41);
		let start = leaf.y; //- ((lines.length-1)/2)*14;
		for (let l = 0; l < lines.length; l++) {
			ctx.fillText(lines[l], leaf.x, start + 20 * l);
		}
	}
	for (let i = 0; i < leaves.length; i++) {
		leaves[i].vy += 0.3;
		leaves[i].x += leaves[i].vx;
		leaves[i].y += leaves[i].vy;
		if (leaves[i].x > width - leaves[i].size) {
			leaves[i].x = width - leaves[i].size;
			leaves[i].vx *= -1;
			leaves[i].color = `HSL(${Math.round(
				Math.random() * 360
			)}, 80%, 80%)`;
		} else if (leaves[i].x < leaves[i].size) {
			leaves[i].x = leaves[i].size;
			leaves[i].vx *= -1;
			leaves[i].color = `HSL(${Math.round(
				Math.random() * 360
			)}, 80%, 80%)`;
		}
		if (leaves[i].y > height - leaves[i].size) {
			leaves[i].y = height - leaves[i].size;
			leaves[i].vy *= -1;
		} else if (leaves[i].y < leaves[i].size) {
			leaves[i].y = leaves[i].size;
			leaves[i].vy *= -1;
		}
	}
	window.requestAnimationFrame(draw);
}

// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
function getLines(ctx, text, maxWidth) {
	var words = text.split(" ");
	var lines = [];
	var currentLine = words[0];

	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

can.onclick = (e) => {
	let dist = Number.MAX_SAFE_INTEGER;
	let index = -1;
	for (let i = 0; i < leaves.length; i++) {
		let leaf = leaves[i];
		let dx = leaf.x - e.x;
		let dy = leaf.y - e.y;
		let hyp = dx * dx + dy * dy;
		if (hyp < 4 * leaf.size * leaf.size && hyp < dist) {
			index = i;
			dist = hyp;
		}
	}
	if (index != -1) {
		window.location = leaves[index].dest;
	}
	console.log(leaves);
	console.log(e);
};

window.onresize = (e) => {
	let width = window.innerWidth;
	let height = window.innerHeight - 50;
	can.width = width;
	can.height = height;
	ctx = can.getContext("2d");
};

window.requestAnimationFrame(draw);
