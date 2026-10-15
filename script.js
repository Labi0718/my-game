// HTML에서 id가 "game"인 캔버스 도화지를 찾는다.
const canvas = document.getElementById("game");
// 2D 그림을 그리는 데 사용할 붓(ctx)을 가져온다.
const ctx = canvas.getContext("2d");

// 화면에 놓을 요소의 좌표와 크기를 모아 두어 쉽게 바꿀 수 있게 한다.
const scene = {
  width: canvas.width, // 캔버스의 가로 픽셀 수
  height: canvas.height, // 캔버스의 세로 픽셀 수
  hills: { farY: 370, nearY: 440 }, // 먼 언덕과 가까운 언덕의 시작 높이
  sun: { x: 680, y: 115, radius: 43 }, // 태양의 중심 좌표와 반지름
  cumulonimbus: { baseY: 365 }, // 적란운 덩어리가 하늘 아래쪽에 닿는 높이
  stars: [], // 별의 좌표를 넣으면 하늘에 별을 그린다.
  itemSize: 20, // 떨어지는 모든 아이템의 기준 크기
  // type은 아이콘 종류, x와 y는 중심 좌표, collectible은 수집 가능 여부
  items: [
    { type: "sunflower", x: 132, y: 239, collectible: true },
    { type: "sunflower", x: 346, y: 205, collectible: true },
    { type: "sunflower", x: 548, y: 270, collectible: true },
    { type: "sunflower", x: 694, y: 220, collectible: true },
    { type: "glove", x: 295, y: 268, collectible: false },
    { type: "swan", x: 450, y: 325, collectible: false },
    { type: "moon", x: 622, y: 352, collectible: false },
    { type: "redYarn", x: 748, y: 310, collectible: false },
    { type: "leaf", x: 95, y: 417, collectible: false },
    { type: "star", x: 266, y: 408, collectible: false },
    { type: "bat", x: 520, y: 397, collectible: false },
    { type: "walnut", x: 662, y: 432, collectible: false },
  ],
  conductor: { x: 400, y: 408, scale: 0.55 }, // 지휘자의 중심 위치와 크기 배율
  // 각 UI 칸의 위치와 너비·높이
  hud: {
    song: { x: 24, y: 22, width: 245, height: 48 },
    stage: { x: 310, y: 20, width: 180, height: 34 },
    target: { x: 24, y: 245, width: 90, height: 82 },
    lives: { x: 615, y: 20, width: 160, height: 42, count: 3 },
  },
  // 지휘자 아래 게이지의 위치, 크기, 채워진 퍼센트
  gauge: {
    x: 320,
    y: 535,
    width: 160,
    height: 12,
    panelPadding: 9,
    percent: 0,
  },
};

const colors = {
  skyTop: "#58b9f5", // 하늘 위쪽의 파란색
  skyBottom: "#c9efff", // 하늘 아래쪽의 밝은 파란색
  farHill: "#8bd16b", // 먼 언덕의 초록색
  nearHill: "#4fae5b", // 가까운 언덕의 진한 초록색
  ground: "#338746", // 앞쪽 잔디의 색
  sun: "#ffd166", // 태양과 해바라기 꽃잎의 노란색
  text: "#ffffff", // UI 글자 색
  panel: "rgb(25 91 130 / 88%)", // 반투명 UI 배경색
  good: "#ddff9e", // 목표 아이템 안내 색
  bad: "#ffd1c9", // 목표가 아닌 아이템 안내 색
};

// 적란운이 넓게 발달한 하늘 배경과 햇빛을 그린다.
function drawSky() {
  // 위쪽에서 아래쪽으로 변하는 하늘색 그라데이션을 만든다.
  const sky = ctx.createLinearGradient(0, 0, 0, scene.height);
  // 그라데이션의 시작 지점에 하늘 위쪽 색을 넣는다.
  sky.addColorStop(0, colors.skyTop);
  // 그라데이션의 끝 지점에 하늘 아래쪽 색을 넣는다.
  sky.addColorStop(1, colors.skyBottom);
  // 만든 그라데이션을 채우기 색으로 선택한다.
  ctx.fillStyle = sky;
  // 캔버스 전체를 그라데이션으로 칠한다.
  ctx.fillRect(0, 0, scene.width, scene.height);

  // 하늘에 있는 별 좌표를 순회해 그린다.
  scene.stars.forEach(({ x, y, radius }) => {
    // 별을 흰색 원으로 그리기 위해 채우기 색을 정한다.
    ctx.fillStyle = "#ffffff";
    // 새로운 도형 경로를 시작한다.
    ctx.beginPath();
    // (x, y)를 중심으로 radius 크기의 원을 만든다.
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    // 원 안쪽을 현재 색으로 칠한다.
    ctx.fill();
  });

  // 화면 오른쪽 위에 여름 햇살을 그린다.
  // 현재 그리기 설정을 저장해 그림자 효과가 다른 그림에 번지지 않게 한다.
  ctx.save();
  // 태양 주위에 번지는 빛의 색을 지정한다.
  ctx.shadowColor = "rgb(255 209 102 / 70%)";
  // 빛 번짐의 크기를 지정한다.
  ctx.shadowBlur = 30;
  // 태양을 칠할 색을 지정한다.
  ctx.fillStyle = colors.sun;
  // 태양 원을 그릴 경로를 시작한다.
  ctx.beginPath();
  // 설정한 중심 좌표와 반지름으로 태양 원을 만든다.
  ctx.arc(scene.sun.x, scene.sun.y, scene.sun.radius, 0, Math.PI * 2);
  // 태양 원을 색칠한다.
  ctx.fill();
  // 저장했던 기본 그리기 설정으로 되돌린다.
  ctx.restore();

  // 하늘 전체를 차지하는 크고 층진 적란운 덩어리를 그린다.
  drawCumulonimbusSky();
}

// 화면 폭을 가로지르며 높이 솟은 적란운 하늘 배경을 그린다.
function drawCumulonimbusSky() {
  // 구름 배경을 그리기 전의 Canvas 설정을 저장한다.
  ctx.save();
  // 화면 아래를 가로지르고 여러 봉우리가 솟는 적란운 외곽선을 만든다.
  ctx.beginPath();
  ctx.moveTo(0, scene.cumulonimbus.baseY - 28);
  ctx.quadraticCurveTo(27, 278, 66, 261);
  ctx.quadraticCurveTo(34, 228, 77, 205);
  ctx.quadraticCurveTo(55, 166, 105, 151);
  ctx.quadraticCurveTo(120, 111, 160, 127);
  ctx.quadraticCurveTo(198, 81, 232, 112);
  ctx.quadraticCurveTo(269, 91, 297, 137);
  ctx.quadraticCurveTo(335, 139, 347, 179);
  ctx.quadraticCurveTo(374, 156, 389, 116);
  ctx.quadraticCurveTo(374, 72, 423, 52);
  ctx.quadraticCurveTo(458, 23, 493, 67);
  ctx.quadraticCurveTo(541, 39, 568, 88);
  ctx.quadraticCurveTo(602, 92, 613, 137);
  ctx.quadraticCurveTo(650, 124, 675, 166);
  ctx.quadraticCurveTo(725, 161, 741, 207);
  ctx.quadraticCurveTo(783, 216, scene.width, 269);
  ctx.lineTo(scene.width, scene.cumulonimbus.baseY);
  ctx.lineTo(0, scene.cumulonimbus.baseY);
  ctx.closePath();

  // 위쪽은 밝고 아래쪽은 푸른 회색인 구름 빛을 만든다.
  const cloudLight = ctx.createLinearGradient(0, 50, 0, scene.cumulonimbus.baseY);
  cloudLight.addColorStop(0, "#ffffff");
  cloudLight.addColorStop(0.48, "#eaf7ff");
  cloudLight.addColorStop(1, "#91b8d2");
  ctx.fillStyle = cloudLight;
  // 적란운 전체를 밝은 구름빛으로 채운다.
  ctx.fill();

  // 구름의 아래쪽을 잘라 음영이 윗부분을 덮지 않도록 한다.
  ctx.clip();
  const cloudShadow = ctx.createLinearGradient(0, 205, 0, scene.cumulonimbus.baseY);
  cloudShadow.addColorStop(0, "rgb(97 143 177 / 0%)");
  cloudShadow.addColorStop(1, "rgb(65 105 142 / 62%)");
  ctx.fillStyle = cloudShadow;
  // 적란운 밑면에 깊이감 있는 푸른 회색 그림자를 더한다.
  ctx.fillRect(0, 205, scene.width, scene.cumulonimbus.baseY - 205);

  // 구름 덩어리 아래쪽에 길게 이어지는 음영 층을 그린다.
  ctx.fillStyle = "rgb(77 121 157 / 28%)";
  ctx.beginPath();
  ctx.ellipse(410, scene.cumulonimbus.baseY - 7, 470, 43, 0, 0, Math.PI * 2);
  ctx.fill();
  // 저장했던 기본 Canvas 설정으로 되돌린다.
  ctx.restore();
}

// 푸릇푸릇한 여름 언덕과 잔디밭을 그린다.
function drawLandscape() {
  // 설정에 저장된 언덕의 높이를 각각 변수로 꺼낸다.
  const { farY, nearY } = scene.hills;

  // 먼 언덕의 색을 고른다.
  ctx.fillStyle = colors.farHill;
  // 먼 언덕의 외곽선을 그리기 시작한다.
  ctx.beginPath();
  // 언덕 왼쪽 끝에서 곡선 그리기를 시작한다.
  ctx.moveTo(0, farY);
  // 봉우리와 골짜기를 곡선으로 연결해 먼 언덕 모양을 만든다.
  ctx.quadraticCurveTo(130, farY - 105, 265, farY);
  ctx.quadraticCurveTo(410, farY - 115, 555, farY - 4);
  ctx.quadraticCurveTo(690, farY - 90, scene.width, farY - 14);
  // 언덕의 오른쪽과 아래쪽을 캔버스 모서리까지 이어 닫힌 모양으로 만든다.
  ctx.lineTo(scene.width, scene.height);
  ctx.lineTo(0, scene.height);
  // 시작점과 끝점을 연결해 도형 경로를 닫는다.
  ctx.closePath();
  // 먼 언덕 안쪽을 초록색으로 칠한다.
  ctx.fill();

  // 가까운 언덕의 색을 고른다.
  ctx.fillStyle = colors.nearHill;
  // 가까운 언덕의 외곽선을 새로 그리기 시작한다.
  ctx.beginPath();
  // 가까운 언덕의 왼쪽 끝에서 곡선 그리기를 시작한다.
  ctx.moveTo(0, nearY);
  // 여러 곡선을 이어 가까운 언덕의 둥근 능선을 만든다.
  ctx.quadraticCurveTo(155, nearY - 95, 320, nearY - 5);
  ctx.quadraticCurveTo(485, nearY - 88, 645, nearY - 8);
  ctx.quadraticCurveTo(735, nearY - 55, scene.width, nearY - 18);
  // 언덕을 화면 아래까지 이어 닫힌 도형으로 만든다.
  ctx.lineTo(scene.width, scene.height);
  ctx.lineTo(0, scene.height);
  // 언덕 외곽 경로를 닫는다.
  ctx.closePath();
  // 가까운 언덕 안쪽을 진한 초록색으로 칠한다.
  ctx.fill();

  // 앞쪽 잔디밭의 색을 고른다.
  ctx.fillStyle = colors.ground;
  // 언덕 아래쪽을 잔디밭 사각형으로 칠한다.
  ctx.fillRect(0, nearY + 30, scene.width, scene.height - nearY - 30);

  // 잔디밭에 작은 풀잎을 흩어 그린다.
  // 풀잎의 선 색과 굵기를 정한다.
  ctx.strokeStyle = "#8bd16b";
  ctx.lineWidth = 2;
  // x 좌표를 일정 간격으로 옮기며 여러 풀잎을 반복해서 그린다.
  for (let x = 18; x < scene.width; x += 36) {
    // x 좌표를 이용해 풀잎의 높이를 번갈아 바꾼다.
    const y = nearY + 43 + ((x * 7) % 95);
    // 새 풀잎의 선 경로를 시작한다.
    ctx.beginPath();
    // 풀잎 밑동에서 왼쪽 잎 끝까지 선을 긋는다.
    ctx.moveTo(x, y + 9);
    ctx.lineTo(x - 3, y);
    // 밑동에서 오른쪽 잎 끝까지 선을 긋는다.
    ctx.moveTo(x, y + 9);
    ctx.lineTo(x + 4, y - 2);
    // 두 줄을 풀잎으로 화면에 그린다.
    ctx.stroke();
  }
}

// 이 스테이지에서 수집할 유일한 종류의 아이콘인 해바라기를 그린다.
function drawSunflowerIcon(x, y, size) {
  // 해바라기 중심을 기준으로 회전해서 꽃잎을 배치할 준비를 한다.
  ctx.save();
  // 그림의 기준점을 해바라기 중심 좌표로 옮긴다.
  ctx.translate(x, y);
  // 꽃잎 색을 노란색으로 지정한다.
  ctx.fillStyle = "#ffd447";
  // 12개의 꽃잎을 일정한 각도로 돌려 가며 반복해서 그린다.
  for (let petal = 0; petal < 12; petal += 1) {
    // 좌표계를 30도 회전해 다음 꽃잎 자리를 만든다.
    ctx.rotate(Math.PI / 6);
    // 새 꽃잎의 도형 경로를 시작한다.
    ctx.beginPath();
    // 중심 위쪽에 길쭉한 타원 꽃잎 하나를 만든다.
    ctx.ellipse(0, -size * 0.68, size * 0.2, size * 0.38, 0, 0, Math.PI * 2);
    // 꽃잎을 노란색으로 칠한다.
    ctx.fill();
  }
  // 꽃 가운데 원의 색을 갈색으로 바꾼다.
  ctx.fillStyle = "#75451f";
  // 가운데 씨앗 부분의 원 경로를 시작한다.
  ctx.beginPath();
  // 해바라기 중심에 둥근 씨앗 부분을 만든다.
  ctx.arc(0, 0, size * 0.46, 0, Math.PI * 2);
  // 가운데 원을 갈색으로 칠한다.
  ctx.fill();
  // 씨앗 점을 더 어두운 색으로 바꾼다.
  ctx.fillStyle = "#3f2c1e";
  // 가운데에 씨앗 점 9개를 나선형으로 배치한다.
  for (let seed = 0; seed < 9; seed += 1) {
    // 씨앗마다 조금씩 다른 각도를 계산한다.
    const angle = seed * 2.4;
    // 계산한 각도와 중심에서의 거리를 사용해 씨앗의 x좌표를 구한다.
    const seedX = Math.cos(angle) * size * 0.25;
    // 계산한 각도와 중심에서의 거리를 사용해 씨앗의 y좌표를 구한다.
    const seedY = Math.sin(angle) * size * 0.25;
    // 새 씨앗 점의 원 경로를 시작한다.
    ctx.beginPath();
    // 해바라기 중심 기준 위치에 작은 씨앗 원을 만든다.
    ctx.arc(seedX, seedY, Math.max(1, size * 0.045), 0, Math.PI * 2);
    // 씨앗 점을 어두운 색으로 칠한다.
    ctx.fill();
  }
  // 원래 좌표계와 그리기 설정을 복원한다.
  ctx.restore();
}

// 여름 아이템이 아닌 눈송이 아이콘을 그린다.
function drawSnowflakeIcon(x, y, size) {
  // 눈송이를 중심에서 그리도록 좌표와 설정을 저장한다.
  ctx.save();
  // 눈송이 중심을 현재 좌표 원점으로 옮긴다.
  ctx.translate(x, y);
  // 눈송이 선을 연한 파란색으로 지정한다.
  ctx.strokeStyle = "#d8efff";
  // 눈송이 크기에 맞춰 선 굵기를 정한다.
  ctx.lineWidth = Math.max(2, size * 0.11);
  // 선 끝을 둥글게 만든다.
  ctx.lineCap = "round";
  // 6개의 가지를 60도씩 회전하며 그린다.
  for (let arm = 0; arm < 6; arm += 1) {
    // 다음 가지를 그릴 수 있도록 좌표계를 60도 돌린다.
    ctx.rotate(Math.PI / 3);
    // 눈송이 가지의 선 경로를 시작한다.
    ctx.beginPath();
    // 중심에서 바깥쪽 끝까지 주 가지를 그린다.
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    // 주 가지 중간에서 한쪽으로 갈라지는 작은 가지를 그린다.
    ctx.moveTo(0, -size * 0.58);
    ctx.lineTo(-size * 0.22, -size * 0.8);
    // 같은 지점에서 반대쪽으로 갈라지는 작은 가지를 그린다.
    ctx.moveTo(0, -size * 0.58);
    ctx.lineTo(size * 0.22, -size * 0.8);
    // 이번 방향의 눈송이 가지 선을 화면에 그린다.
    ctx.stroke();
  }
  // 눈송이만을 위한 좌표 회전과 색 설정을 복원한다.
  ctx.restore();
}

// 눈사람 아이콘을 그린다.
function drawSnowmanIcon(x, y, size) {
  // 눈사람 몸통과 머리를 눈 색으로 그린다.
  ctx.fillStyle = "#f4fbff";
  ctx.beginPath();
  ctx.arc(x, y + size * 0.25, size * 0.38, 0, Math.PI * 2);
  ctx.arc(x, y - size * 0.28, size * 0.27, 0, Math.PI * 2);
  ctx.fill();
  // 모자와 당근 코를 어두운색과 주황색으로 그린다.
  ctx.fillStyle = "#43536b";
  ctx.fillRect(x - size * 0.3, y - size * 0.62, size * 0.6, size * 0.12);
  ctx.fillRect(x - size * 0.18, y - size * 0.9, size * 0.36, size * 0.3);
  ctx.fillStyle = "#e58a53";
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.28);
  ctx.lineTo(x + size * 0.34, y - size * 0.2);
  ctx.lineTo(x, y - size * 0.12);
  ctx.fill();
}

// 장갑 아이콘을 그린다.
function drawGloveIcon(x, y, size) {
  // 장갑을 비스듬히 그릴 수 있도록 현재 설정을 저장한다.
  ctx.save();
  // 장갑 도형의 기준점을 아이템 좌표로 옮긴다.
  ctx.translate(x, y);
  // 장갑을 약간 기울인다.
  ctx.rotate(-0.35);
  // 장갑을 빨간색으로 칠하도록 지정한다.
  ctx.fillStyle = "#d96667";
  // 손바닥과 엄지 부분의 둥근 외곽선을 시작한다.
  ctx.beginPath();
  // 장갑의 손바닥과 엄지를 둥근 사각형으로 그린다.
  ctx.roundRect(-size * 0.3, -size * 0.46, size * 0.58, size * 0.84, size * 0.18);
  ctx.roundRect(size * 0.16, -size * 0.02, size * 0.32, size * 0.26, size * 0.12);
  // 두 부분을 빨간 장갑으로 칠한다.
  ctx.fill();
  // 다음 아이콘에는 회전 전 설정을 사용한다.
  ctx.restore();
}

// 백조 아이콘을 작게 그린다.
function drawSwanIcon(x, y, size) {
  // 백조를 지정된 중심에 그리고 크기를 공통 기준에 맞춘다.
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  // 백조의 몸통과 긴 목을 흰색 도형으로 만든다.
  ctx.fillStyle = "#f8fbff";
  ctx.beginPath();
  ctx.ellipse(-1, 6, 13, 5, -0.12, 0, Math.PI * 2);
  ctx.moveTo(7, 7);
  ctx.quadraticCurveTo(17, -2, 10, -11);
  ctx.quadraticCurveTo(7, -17, 14, -17);
  ctx.quadraticCurveTo(22, -14, 16, -8);
  ctx.quadraticCurveTo(25, 5, 7, 10);
  // 몸통과 목을 흰색으로 칠한다.
  ctx.fill();
  // 부리를 주황색 삼각형으로 붙인다.
  ctx.fillStyle = "#ed9b69";
  ctx.beginPath();
  ctx.moveTo(15, -16);
  ctx.lineTo(24, -13);
  ctx.lineTo(15, -11);
  ctx.fill();
  // 백조에 적용했던 좌표 이동과 크기 설정을 복구한다.
  ctx.restore();
}

// 초승달 아이콘을 그린다.
function drawMoonIcon(x, y, size) {
  // 먼저 둥근 노란 달을 그린다.
  ctx.fillStyle = "#f7d875";
  ctx.beginPath();
  ctx.arc(x, y, size * 0.48, 0, Math.PI * 2);
  ctx.fill();
  // 배경색 원을 겹쳐 초승달 모양으로 깎는다.
  ctx.fillStyle = colors.skyBottom;
  ctx.beginPath();
  ctx.arc(x + size * 0.3, y - size * 0.2, size * 0.43, 0, Math.PI * 2);
  ctx.fill();
}

// 빨간 실타래와 풀린 실 아이콘을 그린다.
function drawRedYarnIcon(x, y, size) {
  // 빨간 실타래를 선으로 그리도록 선 색과 굵기를 지정한다.
  ctx.strokeStyle = "#d94b54";
  ctx.lineWidth = Math.max(1.5, size * 0.12);
  // 동그란 실타래와 바깥으로 풀린 실의 경로를 만든다.
  ctx.beginPath();
  ctx.arc(x - 2, y, size * 0.38, 0, Math.PI * 2);
  ctx.moveTo(x - size * 0.25, y - size * 0.18);
  ctx.quadraticCurveTo(x + size * 0.15, y, x - size * 0.2, y + size * 0.22);
  ctx.moveTo(x - size * 0.25, y + size * 0.1);
  ctx.quadraticCurveTo(x + size * 0.2, y + size * 0.32, x + size * 0.48, y + size * 0.46);
  // 실타래와 풀린 실 경로를 빨간 선으로 그린다.
  ctx.stroke();
}

// 낙엽 아이콘을 그린다.
function drawLeafIcon(x, y, size) {
  // 낙엽을 기울여 그릴 준비를 한다.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.55);
  // 잎의 바깥 모양을 주황색으로 만든다.
  ctx.fillStyle = "#dc8b3f";
  ctx.beginPath();
  ctx.moveTo(0, size * 0.52);
  ctx.quadraticCurveTo(-size * 0.75, 0, 0, -size * 0.55);
  ctx.quadraticCurveTo(size * 0.75, 0, 0, size * 0.52);
  ctx.fill();
  // 잎 가운데에 노란색 잎맥을 그린다.
  ctx.strokeStyle = "#f4c16e";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.4);
  ctx.lineTo(0, -size * 0.38);
  ctx.stroke();
  // 회전한 좌표계를 복구한다.
  ctx.restore();
}

// 별 아이콘을 그린다.
function drawStarIcon(x, y, size) {
  // 별을 노란색으로 칠하도록 지정한다.
  ctx.fillStyle = "#fff0a8";
  // 별 외곽선을 그릴 경로를 시작한다.
  ctx.beginPath();
  // 뾰족한 점 10개를 안쪽·바깥쪽 반지름을 바꾸며 교차해서 만든다.
  for (let point = 0; point < 10; point += 1) {
    // 짝수 점은 바깥 꼭짓점, 홀수 점은 안쪽 골짜기로 둔다.
    const radius = point % 2 === 0 ? size * 0.52 : size * 0.23;
    // 각 꼭짓점이 놓일 각도를 계산한다.
    const angle = -Math.PI / 2 + (point * Math.PI) / 5;
    // 극좌표의 각도와 거리를 캔버스 x좌표로 바꾼다.
    const pointX = x + Math.cos(angle) * radius;
    // 극좌표의 각도와 거리를 캔버스 y좌표로 바꾼다.
    const pointY = y + Math.sin(angle) * radius;
    // 첫 점은 경로의 시작점으로 지정한다.
    if (point === 0) ctx.moveTo(pointX, pointY);
    // 나머지 점들은 앞 점과 이어 별 모양을 만든다.
    else ctx.lineTo(pointX, pointY);
  }
  // 마지막 꼭짓점을 시작점에 이어 별 모양을 닫는다.
  ctx.closePath();
  // 별 안쪽을 노란색으로 칠한다.
  ctx.fill();
}

// 박쥐 아이콘을 그린다.
function drawBatIcon(x, y, size) {
  // 박쥐 몸통과 양쪽 날개를 진한 보라색 경로로 그린다.
  ctx.fillStyle = "#46506d";
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.25);
  ctx.lineTo(x - size * 0.18, y - size * 0.52);
  ctx.lineTo(x - size * 0.28, y - size * 0.16);
  ctx.quadraticCurveTo(x - size * 0.75, y - size * 0.5, x - size * 0.52, y + size * 0.3);
  ctx.quadraticCurveTo(x - size * 0.22, y + size * 0.16, x, y + size * 0.45);
  ctx.quadraticCurveTo(x + size * 0.22, y + size * 0.16, x + size * 0.52, y + size * 0.3);
  ctx.quadraticCurveTo(x + size * 0.75, y - size * 0.5, x + size * 0.28, y - size * 0.16);
  ctx.lineTo(x + size * 0.18, y - size * 0.52);
  ctx.closePath();
  // 닫힌 날개 모양 안쪽을 진한색으로 칠한다.
  ctx.fill();
}

// 호두 아이콘을 그린다.
function drawWalnutIcon(x, y, size) {
  // 호두의 둥근 껍데기를 갈색 타원으로 그린다.
  ctx.fillStyle = "#91603b";
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.48, size * 0.36, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // 껍데기 가운데 굴곡을 밝은 갈색 선으로 그린다.
  ctx.strokeStyle = "#c18b58";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.3);
  ctx.quadraticCurveTo(x - size * 0.2, y, x, y + size * 0.3);
  ctx.quadraticCurveTo(x + size * 0.2, y, x, y - size * 0.3);
  ctx.stroke();
}

// 아이템 종류에 맞는 작은 그림을 그리고, 해바라기만 테두리로 표시한다.
function drawItem(item) {
  // 아이템 설정에서 위치와 아이콘 종류를 꺼낸다.
  const { x, y, type } = item;
  // 각 아이콘은 같은 기준 크기에서 그리기 시작한다.
  const size = scene.itemSize;
  // 작은 모양의 방해 아이콘은 해바라기와 비슷하게 보이도록 확대한다.
  const iconScale = {
    sunflower: 1,
    snowflake: 1,
    snowman: 1.5,
    glove: 1.6,
    swan: 1.4,
    moon: 1.7,
    redYarn: 1.2,
    leaf: 1.4,
    star: 1.8,
    bat: 1.35,
    walnut: 1.6,
  }[type] ?? 1;
  // 아이콘 종류별 배율을 반영한 실제 그리기 크기를 계산한다.
  const iconSize = size * iconScale;

  // 아이템 종류에 맞는 그리기 함수를 골라 해당 좌표에 그린다.
  if (type === "sunflower") drawSunflowerIcon(x, y, iconSize);
  if (type === "snowflake") drawSnowflakeIcon(x, y, iconSize);
  if (type === "snowman") drawSnowmanIcon(x, y, iconSize);
  if (type === "glove") drawGloveIcon(x, y, iconSize);
  if (type === "swan") drawSwanIcon(x, y, iconSize);
  if (type === "moon") drawMoonIcon(x, y, iconSize);
  if (type === "redYarn") drawRedYarnIcon(x, y, iconSize);
  if (type === "leaf") drawLeafIcon(x, y, iconSize);
  if (type === "star") drawStarIcon(x, y, iconSize);
  if (type === "bat") drawBatIcon(x, y, iconSize);
  if (type === "walnut") drawWalnutIcon(x, y, iconSize);
}

// 지휘봉과 연미복을 갖춘 사람 모습의 지휘자를 그린다.
function drawConductor() {
  // 설정 목록에서 지휘자 위치와 확대·축소 배율을 꺼낸다.
  const { x, y, scale } = scene.conductor;
  // 지휘자만 따로 이동·축소할 수 있도록 현재 설정을 저장한다.
  ctx.save();
  // 이후 지휘자 도형들이 그려질 중심점을 이동한다.
  ctx.translate(x, y);
  // 지휘자 도형 전체의 크기를 배율만큼 조정한다.
  ctx.scale(scale, scale);

  // 사람의 다리와 신발
  // 검은 바지의 왼쪽 다리와 오른쪽 다리를 사각형으로 그린다.
  ctx.fillStyle = "#202a40";
  ctx.fillRect(-25, 88, 18, 39);
  ctx.fillRect(7, 88, 18, 39);
  // 두 발에 검은색 신발을 그린다.
  ctx.fillStyle = "#20202a";
  ctx.fillRect(-30, 122, 26, 9);
  ctx.fillRect(4, 122, 26, 9);

  // 연미복 몸통과 흰 셔츠
  // 연미복의 몸통 외곽선을 그린다.
  ctx.fillStyle = "#202a40";
  ctx.beginPath();
  ctx.moveTo(-38, 25);
  ctx.lineTo(-28, 12);
  ctx.lineTo(28, 12);
  ctx.lineTo(38, 25);
  ctx.lineTo(30, 94);
  ctx.lineTo(-30, 94);
  ctx.closePath();
  // 연미복 몸통을 진한색으로 채운다.
  ctx.fill();
  // 몸통 가운데에 흰 셔츠 모양을 만든다.
  ctx.fillStyle = "#fff5dc";
  ctx.beginPath();
  ctx.moveTo(-13, 16);
  ctx.lineTo(0, 31);
  ctx.lineTo(13, 16);
  ctx.lineTo(8, 76);
  ctx.lineTo(-8, 76);
  ctx.closePath();
  // 셔츠를 흰색으로 채운다.
  ctx.fill();

  // 얼굴, 머리카락, 눈과 미소
  // 피부색 원으로 얼굴을 그린다.
  ctx.fillStyle = "#f2c7a5";
  ctx.beginPath();
  ctx.arc(0, -8, 24, 0, Math.PI * 2);
  ctx.fill();
  // 머리 위쪽의 갈색 머리카락 모양을 그린다.
  ctx.fillStyle = "#49372f";
  ctx.beginPath();
  ctx.arc(0, -15, 24, Math.PI, Math.PI * 2);
  ctx.lineTo(21, -4);
  ctx.quadraticCurveTo(11, -14, 0, -12);
  ctx.quadraticCurveTo(-13, -9, -21, -2);
  ctx.closePath();
  ctx.fill();
  // 얼굴에 작은 두 눈을 그린다.
  ctx.fillStyle = "#303044";
  ctx.beginPath();
  ctx.arc(-8, -6, 2, 0, Math.PI * 2);
  ctx.arc(8, -6, 2, 0, Math.PI * 2);
  ctx.fill();
  // 얼굴 아래에 미소 곡선을 그린다.
  ctx.strokeStyle = "#9a5960";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 1, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 양팔을 벌려 지휘하는 자세와 오른손의 지휘봉
  // 연미복 소매 색과 굵은 선으로 양팔을 뻗어 그린다.
  ctx.strokeStyle = "#202a40";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-27, 32);
  ctx.lineTo(-58, 57);
  ctx.lineTo(-69, 44);
  ctx.moveTo(27, 32);
  ctx.lineTo(53, 16);
  ctx.stroke();
  // 손 색으로 바꾸어 각 팔 끝에 손을 붙인다.
  ctx.strokeStyle = "#f2c7a5";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-69, 44);
  ctx.lineTo(-76, 37);
  ctx.moveTo(53, 16);
  ctx.lineTo(61, 9);
  ctx.stroke();
  // 오른손에서 대각선 위로 뻗는 흰 지휘봉을 그린다.
  ctx.strokeStyle = "#fff2ce";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(61, 9);
  ctx.lineTo(85, -34);
  ctx.stroke();

  // 연미복의 나비넥타이와 단추
  // 셔츠 목 아래에 붉은 나비넥타이를 그린다.
  ctx.fillStyle = "#d87d72";
  ctx.beginPath();
  ctx.moveTo(-10, 23);
  ctx.lineTo(-2, 19);
  ctx.lineTo(0, 25);
  ctx.lineTo(2, 19);
  ctx.lineTo(10, 23);
  ctx.lineTo(2, 30);
  ctx.lineTo(0, 26);
  ctx.lineTo(-2, 30);
  ctx.closePath();
  ctx.fill();
  // 연미복에 작은 금색 단추 두 개를 붙인다.
  ctx.fillStyle = "#d7bd80";
  ctx.beginPath();
  ctx.arc(0, 43, 2, 0, Math.PI * 2);
  ctx.arc(0, 56, 2, 0, Math.PI * 2);
  ctx.fill();

  // 지휘자를 그릴 때 적용한 이동과 크기 배율을 원래대로 돌린다.
  ctx.restore();
}

// 곡 정보와 스테이지 번호, 남은 라이프를 화면 위쪽에 표시한다.
function drawHud() {
  // 상단 UI 칸들의 좌표와 크기를 설정에서 꺼낸다.
  const { song, stage, lives } = scene.hud;

  // 스테이지 표시 칸의 배경색과 둥근 모서리를 정한다.
  ctx.fillStyle = colors.panel;
  ctx.beginPath();
  // 설정한 위치와 크기로 둥근 사각형 배경을 만든다.
  ctx.roundRect(stage.x, stage.y, stage.width, stage.height, 8);
  // 스테이지 배경을 칠한다.
  ctx.fill();
  // 스테이지 글자 색과 정렬 방식을 지정한다.
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.font = "bold 16px Arial, sans-serif";
  // 스테이지 칸의 가운데에 제목을 쓴다.
  ctx.fillText("STAGE 1", stage.x + stage.width / 2, stage.y + 22);
  // 이후 글자는 왼쪽 정렬로 쓴다.
  ctx.textAlign = "start";

  // 음표와 작곡가·곡 제목을 배경 칸 안에 표시한다.
  // 곡 정보 칸의 배경 모양을 만든다.
  ctx.fillStyle = colors.panel;
  ctx.beginPath();
  ctx.roundRect(song.x, song.y, song.width, song.height, 8);
  ctx.fill();
  // 음표 머리 부분을 흰색 타원으로 그린다.
  ctx.fillStyle = colors.text;
  ctx.beginPath();
  ctx.ellipse(song.x + 18, song.y + 27, 5, 3.5, -0.35, 0, Math.PI * 2);
  ctx.fill();
  // 음표의 세로 기둥과 위쪽 깃발을 그린다.
  ctx.fillRect(song.x + 21, song.y + 2, 2, 26);
  ctx.fillRect(song.x + 22, song.y + 2, 13, 3);
  // 음표 옆에 작곡가 이름과 현재 곡 제목을 쓴다.
  ctx.font = "14px Arial, 'Malgun Gothic', sans-serif";
  ctx.fillText("비발디 - 사계 중 여름", song.x + 43, song.y + 29);

  // 오른쪽 위에 라이프를 표시하는 배경 칸을 그린다.
  ctx.fillStyle = colors.panel;
  ctx.beginPath();
  ctx.roundRect(lives.x, lives.y, lives.width, lives.height, 8);
  ctx.fill();
  // 남은 라이프 개수만큼 하트를 일정한 간격으로 그린다.
  for (let heart = 0; heart < lives.count; heart += 1) {
    drawHeart(lives.x + 34 + heart * 43, lives.y + 21, 15);
  }
}

// 지정한 중심 좌표에 라이프를 나타내는 하트 하나를 그린다.
function drawHeart(x, y, size) {
  ctx.fillStyle = "#ff7185";
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.42);
  ctx.bezierCurveTo(x - size * 0.18, y + size * 0.22, x - size, y - size * 0.3, x - size * 0.72, y - size * 0.72);
  ctx.bezierCurveTo(x - size * 0.48, y - size * 1.08, x - size * 0.08, y - size * 0.88, x, y - size * 0.54);
  ctx.bezierCurveTo(x + size * 0.08, y - size * 0.88, x + size * 0.48, y - size * 1.08, x + size * 0.72, y - size * 0.72);
  ctx.bezierCurveTo(x + size, y - size * 0.3, x + size * 0.18, y + size * 0.22, x, y + size * 0.42);
  ctx.fill();
}

// 지휘자 발밑에 진행률 게이지와 현재 퍼센트를 표시한다.
function drawGauge() {
  // 게이지의 위치·크기·현재 채움 비율을 설정에서 꺼낸다.
  const { x, y, width, height, percent } = scene.gauge;
  // 게이지 값이 0%보다 작거나 100%보다 커지지 않게 제한한다.
  const clampedPercent = Math.min(100, Math.max(0, percent));

  // 게이지 주변 배경 칸을 둥근 사각형으로 그린다.
  ctx.fillStyle = colors.panel;
  ctx.beginPath();
  ctx.roundRect(
    x - scene.gauge.panelPadding,
    y - scene.gauge.panelPadding,
    width + scene.gauge.panelPadding * 2,
    height + scene.gauge.panelPadding * 2 + 22,
    8,
  );
  ctx.fill();
  // 아직 채워지지 않은 게이지 바의 바탕을 반투명 흰색으로 그린다.
  ctx.fillStyle = "rgb(255 255 255 / 35%)";
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.fill();
  // 채워지는 부분은 해바라기와 같은 노란색으로 표시한다.
  ctx.fillStyle = "#ffd447";
  // 게이지가 0보다 클 때만 채워진 막대를 그린다.
  if (clampedPercent > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, width * clampedPercent / 100, height, height / 2);
    ctx.fill();
  }

  // 막대 아래에 현재 진행률을 퍼센트로 표시한다.
  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.font = "bold 13px Arial, 'Malgun Gothic', sans-serif";
  ctx.fillText(`선율 게이지 ${clampedPercent}%`, x + width / 2, y + height + 17);
  // 다음 글자를 그릴 때는 왼쪽 정렬로 되돌린다.
  ctx.textAlign = "start";
}

// 목표 아이템이라는 제목 아래에 수집할 해바라기 표시만 둔다.
function drawLegend() {
  // 화면 왼쪽 중간에 놓일 목표 아이템 안내 칸의 위치와 크기를 꺼낸다.
  const { x, y, width, height } = scene.hud.target;
  // 목표 아이템 안내 배경을 둥근 사각형으로 그린다.
  ctx.fillStyle = colors.panel;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.fill();
  // 안내 제목을 가운데 정렬로 쓸 준비를 한다.
  ctx.fillStyle = colors.text;
  ctx.font = "14px Arial, 'Malgun Gothic', sans-serif";
  ctx.textAlign = "center";
  // 배경 칸 위쪽에 "목표 아이템"이라고 쓴다.
  ctx.fillText("목표 아이템", x + width / 2, y + 23);
  // 제목 바로 아래에 수집 대상인 해바라기 아이콘을 그린다.
  drawSunflowerIcon(x + width / 2, y + 56, scene.itemSize * 0.65);
  // 다음 Canvas 텍스트를 왼쪽 정렬로 되돌린다.
  ctx.textAlign = "start";
}

// 배경, 아이템, 지휘자와 지휘자 아래의 게이지를 차례로 그린다.
function drawFirstScreen() {
  // 가장 뒤쪽인 하늘과 햇살, 구름을 먼저 그린다.
  drawSky();
  // 하늘 앞에 언덕과 잔디밭을 그린다.
  drawLandscape();
  // 설정에 등록된 해바라기와 방해 아이템을 모두 그린다.
  scene.items.forEach(drawItem);
  // 아이템 앞쪽에 지휘자를 그린다.
  drawConductor();
  // 곡 제목, 스테이지 이름과 남은 라이프를 그린다.
  drawHud();
  // 왼쪽 위에 목표 아이템 안내를 그린다.
  drawLegend();
  // 지휘자 바로 아래에 현재 게이지를 그린다.
  drawGauge();
}

// 첫 화면을 한 번 그려 브라우저에 보여 준다.
drawFirstScreen();
