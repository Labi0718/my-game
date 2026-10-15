const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 화면의 크기와 게임 요소의 위치를 위쪽에 모아 둔다.
const screen = {
  width: canvas.width,
  height: canvas.height,
  playerX: 400,
  playerY: 438,
};

const colors = {
  skyTop: "#18213f",
  skyBottom: "#8c9bb9",
  farHill: "#657394",
  nearHill: "#384766",
  path: "#8c817d",
  moon: "#fff0c5",
  text: "#fff9ed",
};

function drawSky() {
  const sky = ctx.createLinearGradient(0, 0, 0, screen.height);
  sky.addColorStop(0, colors.skyTop);
  sky.addColorStop(1, colors.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, screen.width, screen.height);

  // 별을 점으로 그리고, 달빛에는 은은한 빛 번짐을 준다.
  const stars = [
    [77, 119, 2], [146, 76, 1.5], [238, 154, 2], [337, 93, 1.5],
    [461, 139, 2], [555, 82, 1.5], [728, 130, 2], [113, 244, 1.5],
    [384, 205, 2], [514, 252, 1.5], [286, 61, 1.5],
  ];
  ctx.fillStyle = "#fff7df";
  stars.forEach(([x, y, radius]) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.save();
  ctx.shadowColor = "rgb(255 240 197 / 70%)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = colors.moon;
  ctx.beginPath();
  ctx.arc(652, 133, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 달 앞에 어두운 원을 겹쳐 초승달 모양을 만든다.
  ctx.fillStyle = "#303c5c";
  ctx.beginPath();
  ctx.arc(673, 111, 41, 0, Math.PI * 2);
  ctx.fill();
}

function drawHills() {
  ctx.fillStyle = colors.farHill;
  ctx.beginPath();
  ctx.moveTo(0, 363);
  ctx.quadraticCurveTo(128, 273, 261, 363);
  ctx.quadraticCurveTo(399, 251, 548, 356);
  ctx.quadraticCurveTo(680, 278, screen.width, 348);
  ctx.lineTo(screen.width, screen.height);
  ctx.lineTo(0, screen.height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.nearHill;
  ctx.beginPath();
  ctx.moveTo(0, 428);
  ctx.quadraticCurveTo(163, 337, 318, 422);
  ctx.quadraticCurveTo(487, 342, 642, 414);
  ctx.quadraticCurveTo(733, 373, screen.width, 408);
  ctx.lineTo(screen.width, screen.height);
  ctx.lineTo(0, screen.height);
  ctx.closePath();
  ctx.fill();

  // 언덕 사이로 이어지는 길을 그린다.
  ctx.fillStyle = colors.path;
  ctx.beginPath();
  ctx.moveTo(310, screen.height);
  ctx.quadraticCurveTo(393, 502, 379, 416);
  ctx.lineTo(437, 416);
  ctx.quadraticCurveTo(425, 507, 527, screen.height);
  ctx.closePath();
  ctx.fill();
}

function drawMoonFragment(x, y, radius) {
  ctx.fillStyle = "#f5d58f";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.nearHill;
  ctx.beginPath();
  ctx.arc(x + radius * 0.45, y - radius * 0.34, radius * 0.82, 0, Math.PI * 2);
  ctx.fill();
}

function drawMusicNote(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(-0.18);
  ctx.fillStyle = "#f1eaff";
  ctx.beginPath();
  ctx.ellipse(0, 14, 8, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(6, -17, 3, 31);
  ctx.fillRect(8, -17, 17, 5);
  ctx.restore();
}

function drawSwan(x, y) {
  ctx.save();
  ctx.fillStyle = "#f5f2f4";
  ctx.beginPath();
  ctx.ellipse(x, y + 31, 32, 12, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 31);
  ctx.quadraticCurveTo(x + 29, y + 10, x + 18, y - 3);
  ctx.quadraticCurveTo(x + 10, y - 14, x + 24, y - 15);
  ctx.quadraticCurveTo(x + 35, y - 11, x + 26, y - 3);
  ctx.quadraticCurveTo(x + 40, y + 22, x + 24, y + 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e9a172";
  ctx.beginPath();
  ctx.moveTo(x + 27, y - 13);
  ctx.lineTo(x + 39, y - 9);
  ctx.lineTo(x + 27, y - 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  const x = screen.playerX;
  const y = screen.playerY;

  // 바닥 그림자
  ctx.fillStyle = "rgb(20 27 45 / 35%)";
  ctx.beginPath();
  ctx.ellipse(x, y + 113, 50, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 하늘색 고양이의 얼굴과 귀
  ctx.fillStyle = "#c3e3ed";
  ctx.beginPath();
  ctx.moveTo(x - 31, y + 26);
  ctx.lineTo(x - 28, y - 3);
  ctx.lineTo(x - 7, y + 14);
  ctx.lineTo(x + 7, y + 14);
  ctx.lineTo(x + 28, y - 3);
  ctx.lineTo(x + 31, y + 26);
  ctx.arc(x, y + 28, 31, 0, Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#34425d";
  ctx.beginPath();
  ctx.arc(x - 10, y + 33, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 10, y + 33, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e99dad";
  ctx.beginPath();
  ctx.arc(x - 19, y + 42, 5, 0, Math.PI * 2);
  ctx.arc(x + 19, y + 42, 5, 0, Math.PI * 2);
  ctx.fill();

  // 달 조각을 받을 바구니
  ctx.fillStyle = "#b67d68";
  ctx.beginPath();
  ctx.moveTo(x - 38, y + 62);
  ctx.lineTo(x + 38, y + 62);
  ctx.lineTo(x + 28, y + 101);
  ctx.lineTo(x - 28, y + 101);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f1c7a5";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y + 65, 27, Math.PI, Math.PI * 2);
  ctx.stroke();
}

function drawHud() {
  ctx.fillStyle = "rgb(22 29 54 / 84%)";
  ctx.fillRect(24, 22, 300, 82);
  ctx.fillStyle = colors.text;
  ctx.font = "bold 19px Arial, 'Malgun Gothic', sans-serif";
  ctx.fillText("선율 수집가", 43, 52);
  ctx.font = "15px Arial, 'Malgun Gothic', sans-serif";
  ctx.fillStyle = "#d9d8e8";
  ctx.fillText("지금 흐르는 곡: 월광 소나타", 43, 80);

  ctx.fillStyle = "rgb(22 29 54 / 84%)";
  ctx.fillRect(24, 116, 190, 46);
  drawMoonFragment(49, 139, 11);
  ctx.fillStyle = colors.text;
  ctx.fillText("달 조각  0 / 5", 71, 145);

  ctx.fillStyle = "rgb(22 29 54 / 82%)";
  ctx.fillRect(24, 520, 752, 54);
  ctx.textAlign = "center";
  ctx.fillStyle = colors.text;
  ctx.fillText("방향키로 바구니를 움직여 달 조각을 모아 보세요", 400, 553);
  ctx.textAlign = "start";
}

function drawFirstScreen() {
  drawSky();
  drawHills();
  drawMoonFragment(211, 281, 17);
  drawMoonFragment(486, 236, 14);
  drawMoonFragment(704, 308, 12);
  drawMusicNote(337, 238, 0.9);
  drawMusicNote(528, 188, 0.72);
  drawSwan(574, 312);
  drawPlayer();
  drawHud();
}

drawFirstScreen();
